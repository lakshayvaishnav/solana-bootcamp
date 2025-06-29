use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ next_account_info, AccountInfo },
    entrypoint::ProgramResult,
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
    let account_data = &mut NotesAccountState::try_from_slice(&pda_account.data.borrow())?;

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
        let program_test = ProgramTest::new(
            "notes",
            program_id,
            processor!(process_instruction)
        );

        let (mut banks_client , payer , recent_blockchash) = program_test.start().await;

        let title : String = "job leni h".to_owned();
        let description : String = "sample description it is".to_owned();
    }
}
