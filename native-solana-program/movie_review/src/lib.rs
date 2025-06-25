use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::{  ProgramResult, },
    system_instruction,
    program::invoke_signed,
    pubkey::Pubkey,
    rent::Rent,
    sysvar::Sysvar,
    msg,
    entrypoint
};

pub mod instruction;
pub mod state;

use instruction::MovieReviewInstruction;

use crate::state::MovieAccountState;

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    let instruction = MovieReviewInstruction::unpack(instruction_data)?;

    match instruction {
        MovieReviewInstruction::AddMovieReview { title, rating, description } => {
            // function call to add movie review
            add_movie_review(program_id, accounts, title, description, rating)
        }
    }
    
}

pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    rating: u8
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    // getting accounts
    let initializer = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    // deriving the pda
    let (_pda, bump_seed) = Pubkey::find_program_address(
        &[initializer.key.as_ref(), title.as_bytes().as_ref()],
        program_id
    );

    let account_len: usize = 4 + title.len() + (4 + description.len()) + 1 + 1;

    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);

    // creating the account
    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            pda_account.key,
            rent_lamports,
            account_len as u64,
            program_id
        ),
        &[initializer.clone(), pda_account.clone(), system_program.clone()],
        &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump_seed]]]
    )?;

    // updating the details of the account.
    let mut account_data = MovieAccountState::try_from_slice(&pda_account.data.borrow())?;

    account_data.is_initialized = true;
    account_data.title = title;
    account_data.description = description;
    account_data.rating = rating;

    // serializing the data
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;

    msg!("final data serialized , and updated the account data brooo ✅✅✅✅ ");
    Ok(())
}
