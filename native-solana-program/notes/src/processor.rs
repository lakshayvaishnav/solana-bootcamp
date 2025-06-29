use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ next_account_info, AccountInfo }, address_lookup_table::{ instruction, program }, entrypoint::ProgramResult, msg, program::invoke_signed, pubkey::Pubkey, rent::Rent, system_instruction, system_program, sysvar::Sysvar
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

    let (pda, bump) = Pubkey::find_program_address(
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
    );

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
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();

    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;


    // updating the account details 
    
    msg!("unpacking the account details");
    let account_data = &mut NotesAccountState::try_from_slice(&pda_account.data.borrow())?;


    account_data.title = title;
    account_data.description = description;
    Ok(())
}
