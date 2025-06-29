use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ next_account_info, AccountInfo },
    entrypoint::ProgramResult,
    borsh1::try_from_slice_unchecked,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};



use crate::{ instructions::NotesInstruction, state::NotesAccountState };

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let instruction = NotesInstruction::Unpack(instruction_data)?;

    match instruction {
        NotesInstruction::AddNote { title, description } => {
            process_add_notes(program_id, accounts, title, description)
        }

        NotesInstruction::UpdateNote { title, description } => {
            process_update_notes(program_id, accounts, title, description)
        }

        NotesInstruction::DeleteNote { title } => {
            process_delete_notes(program_id, accounts, title)
        }
    }
}

pub fn process_add_notes(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String
) -> ProgramResult {
    msg!("adding notes");

    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (_pda, bump) = Pubkey::find_program_address(
        &[initializer.key.as_ref(), title.as_bytes().as_ref()],
        program_id
    );

    let account_len: usize = 1000;

    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(account_len);

    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            pda_account.key,
            lamports,
            account_len as u64,
            program_id
        ),
        &[initializer.clone(), pda_account.clone(), system_program.clone()],
        &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump]]]
    )?;

    msg!(" ✅ pda created successfully ");

    msg!("unpacking state account");
    // let account_data = &mut NotesAccountState::try_from_slice(&pda_account.data.borrow())?;
    let mut account_data = try_from_slice_unchecked::<NotesAccountState>(&pda_account.data.borrow()).unwrap();

    msg!("borrowed account data ");
    account_data.title = title;
    account_data.description = description;
    account_data.is_initialized = true;

    msg!("serializing the data");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("satate account serialized");

    Ok(())
}

fn process_update_notes(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let _initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let _system_program = next_account_info(account_info_iter)?;

    // updating the account details

    msg!("unpacking the account details");
    let account_data = &mut NotesAccountState::try_from_slice(&pda_account.data.borrow())?;

    account_data.title = title;
    account_data.description = description;

    msg!("serializing the data");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}

fn process_delete_notes(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _title: String
) -> ProgramResult {
    msg!("Deleting notes");
    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let _system_program = next_account_info(account_info_iter)?;

    // drain lamports from pda back to initializer;
    let pda_lamports = **pda_account.lamports.borrow() as u32;
    **pda_account.lamports.borrow_mut() = 0;
    **initializer.lamports.borrow_mut() = initializer
        .lamports()
        .checked_shl(pda_lamports)
        .ok_or(ProgramError::InvalidAccountData)?;

    // zero out data to invalidate the account's state
    let data = &mut pda_account.data.borrow_mut();
    for byte in data.iter_mut() {
        *byte = 0;
    }

    msg!("✅ note account closed and lamports returned");
    Ok(())
}

#[cfg(test)]
mod tests {
    use {
        super::*,
        assert_matches::*,
        solana_program_test::*,
        solana_program::{
            instruction::{ AccountMeta, Instruction },
            system_program::ID as SYSTEM_PROGRAM_ID,
        },
        solana_sdk::{
            signature::Signer,
            sysvar::rent::ID as SYSVAR_RENT_ID,
            transaction::Transaction,
        },
    };

    #[tokio::test]
    async fn test_add_notes_instruction() {
        let program_id = Pubkey::new_unique();
        let program_test = ProgramTest::new("notes", program_id, processor!(process_instruction));

        let (mut banks_client, payer, recent_blockhash) = program_test.start().await;

        let title: String = "job leni h".to_owned();
        let description: String = "sample description it is".to_owned();

        let add_notes_ix = create_add_note_ix(payer.pubkey(), program_id, title, description, SYSTEM_PROGRAM_ID);

        let mut transaction = Transaction::new_with_payer(&[add_notes_ix], Some(&payer.pubkey()));

        transaction.sign(&[&payer], recent_blockhash);

        assert_matches!(banks_client.process_transaction(transaction).await, Ok(_));

    }

    fn create_add_note_ix(
        payer: Pubkey,
        program_id: Pubkey,
        title: String,
        description: String,
        system_program: Pubkey
    ) -> Instruction {
        let (add_note_pda, _bump_seed) = Pubkey::find_program_address(
            &[payer.as_ref(), title.as_bytes()],
            &program_id
        );

        let mut data_vec = vec![0];

        /*
        
        [discriminant] + [title.len as u32 (4 bytes)] + [title as bytes] + ...
        .to_le_bytes() used for ints
        .into_bytes for string
         */

        // appended the length of title
        data_vec.append(
            &mut TryInto::<u32>::try_into(title.len()).unwrap().to_le_bytes().try_into().unwrap()
        );

        // appending the title
        data_vec.append(&mut title.into_bytes());

        // appending the len of description
        data_vec.append(&mut TryInto::<u32>::try_into(description.len()).unwrap().to_le_bytes().try_into().unwrap());

        // appending the description
        data_vec.append(&mut description.into_bytes());

        Instruction { program_id: program_id, accounts: vec![
            AccountMeta::new_readonly(payer, true),
            AccountMeta::new(add_note_pda, false),
            AccountMeta::new_readonly(system_program, false),
        ], data: data_vec }

    }
}
