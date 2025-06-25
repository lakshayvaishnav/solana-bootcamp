use solana_program::{entrypoint::{self, ProgramResult, __AccountInfo}, pubkey::Pubkey};

pub mod instruction;
pub mod state;

use instruction::MovieReviewInstruction;

entrypoint!(process_insturction);


pub fn process_instruction (
    program_id : &Pubkey,
    accounts : &[__AccountInfo],
    instruction_data : &[u8]
) -> ProgramResult{

    let instruction = MovieReviewInstruction::unpack(instruction_data)?;

    match instruction {
        MovieReviewInstruction::AddMovieReview { title, rating, description } => {
            // function call to add movie review
        }
    }

}


pub fn add_movie_review (
    program_id : &Pubkey,
    accounts : &[__AccountInfo],

) -> ProgramResult {

}