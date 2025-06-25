use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::program_pack::{IsInitialized, Sealed};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct MovieAccountState {
    pub is_initialized: bool,
    pub title: String,
    pub description: String,
    pub rating: u8,
}

/*
    Sealed is Solana's version of Rust's Sized trait. 
    This simply specifies that MovieAccountState has a known size and 
    provides for some compiler optimizations.
*/
impl Sealed for MovieAccountState {}

impl IsInitialized for MovieAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}