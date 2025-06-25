#![allow(warnings)]
use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ next_account_info, AccountInfo },
    entrypoint::ProgramResult,
    entrypoint,
    program::invoke,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
    msg,
};

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    // Unpack instruction data
    let instruction = CounterInstruction::unpack(instruction_data)?;

    // Match instruction type
    match instruction {
        CounterInstruction::InitializeCounter { initial_value } => {
            process_initialize_counter(program_id, accounts, initial_value)?;
        }
        CounterInstruction::IncrementCounter => process_increment_counter(program_id, accounts)?,
    }
    Ok(())
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum CounterInstruction {
    InitializeCounter {
        initial_value: u64, // variant 0
    },
    IncrementCounter, // variant 1
}

impl CounterInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // get the instruction variant from the first byte
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        match variant {
            0 => {
                let initial_value = u64::from_le_bytes(
                    rest.try_into().map_err(|_| ProgramError::InvalidInstructionData)?
                );
                Ok(Self::InitializeCounter { initial_value })
            }
            1 => Ok(Self::IncrementCounter), // no additional data needed
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct CounterAccount {
    count: u64,
}



fn process_initialize_counter(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_value: u64
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let counter_account = next_account_info(accounts_iter)?;
    let payer_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let account_space = 8;

    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(account_space);

    invoke(
        &system_instruction::create_account(
            payer_account.key,
            counter_account.key,
            required_lamports,
            account_space as u64,
            program_id
        ),
        &[payer_account.clone(), counter_account.clone(), system_program.clone()]
    )?;

    // Create a new CounterAccount struct with the initial value
    let counter_data = CounterAccount {
        count: initial_value,
    };

    // Get a mutable reference to the counter account's data field
    let mut account_data = &mut counter_account.data.borrow_mut()[..];

    // Serialize the CounterAccount struct into the account's data
    counter_data.serialize(&mut account_data)?;

    msg!("Counter initialized with value: {}", initial_value);
    Ok(())
}

/*
Note that in practice, a developer must implement various security checks to validate the accounts passed to the program.
 Since all accounts are provided by the caller of the instruction,
 there is no guarantee that the accounts provided are the ones the program expects. 
 Missing account validation checks are a common source of program vulnerabilities.

*/

// adding check to ensure the account refferring to is owendy by the executing program
fn process_increment_counter(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let counter_account = next_account_info(accounts_iter)?;

    // verify account ownership
    if counter_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    // borrow the account data mutabily
    let mut data = counter_account.data.borrow_mut();

    // Deserialize the account data into our counteraccount struct
    let mut counter_data = CounterAccount::try_from_slice(&data)?;
    counter_data.count = counter_data.count.checked_add(1).ok_or(ProgramError::InvalidAccountData)?;

    counter_data.serialize(&mut &mut data[..])?;

    msg!("Counter incremented to : {}", counter_data.count);

    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use solana_program_test::*;
    use solana_sdk::{
        address_lookup_table::program,
        instruction::{ AccountMeta, Instruction },
        signature::{ keypair, Keypair, Signer },
        system_program,
        transaction::Transaction,
    };

    #[tokio::test]
    async fn test_counter_program() {
        let program_id = Pubkey::new_unique();
        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "counter_program",
            program_id,
            processor!(process_instruction)
        ).start().await;

        // create a new keypair to use as the address for our counter account
        let counter_keypair = Keypair::new();
        let initial_value: u64 = 42;

        // step 1 : initalize the counter:
        println!("🔫 testing counter initialization");

        // create initialize instruction
        // vec![] it is a macro used to create vec<T> a growable heap allocated vector
        // vec![0] creates a vector containing single element 0
        let mut init_instruction_data = vec![0]; // 0 => initialize instruction
        init_instruction_data.extend_from_slice(&initial_value.to_le_bytes());

        let initalize_instruction = Instruction::new_with_bytes(
            program_id,
            &init_instruction_data,
            vec![
                AccountMeta::new(counter_keypair.pubkey(), true),
                AccountMeta::new(payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::id(), false)
            ]
        );

        // sendtransaction with initialize instruction
        let mut transaction = Transaction::new_with_payer(
            &[initalize_instruction],
            Some(&payer.pubkey())
        );
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey()).await
            .expect("Failed to get counter account");

        if let Some(account_data) = account {
            let counter = CounterAccount::try_from_slice(&account_data.data).expect(
                "Failed to deserialize counter data"
            );
            assert_eq!(counter.count, 42);
            println!(" ✅ counter initialized successfully with values : {}", counter.count);
        }

        println!("🔫 Testing counter increment...");

        // create increment instruction
        let increment_instruction = Instruction::new_with_bytes(
            program_id,
            &[1],
            vec![AccountMeta::new(counter_keypair.pubkey(), true)]
        );

        // send transaction with increment instruction
        let mut transaction = Transaction::new_with_payer(
            &[increment_instruction],
            Some(&payer.pubkey())
        );
        transaction.sign(&[&payer, &counter_keypair], recent_blockhash);
        banks_client.process_transaction(transaction).await.unwrap();

        // check account data
        let account = banks_client
            .get_account(counter_keypair.pubkey()).await
            .expect("failed to get counter account");

        if let Some(account_data) = account {
            let counter = CounterAccount::try_from_slice(&account_data.data).expect(
                "failed to deserialize counter data"
            );
            assert_eq!(counter.count, 43);

            println!("✅ counter increment successfully to : {}", counter.count);
        }
    }
}
