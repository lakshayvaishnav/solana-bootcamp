use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{ program_pack::{ IsInitialized, Sealed }, pubkey::Pubkey };

#[derive(BorshDeserialize, BorshSerialize)]
pub struct NotesAccountState {
    pub user: Pubkey, // 32 bytes
    pub title: String, // 4 lenght prefix + N
    pub description: String, // 4 b + description.len()
    pub is_initialized: bool, // it takes 1 byte
}

impl Sealed for NotesAccountState {}

impl IsInitialized for NotesAccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}
