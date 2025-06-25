use borsh::{ BorshDeserialize, BorshSerialize };

#[derive(BorshDeserialize, BorshSerialize)]
pub struct MovieAccountState {
    pub is_initialized: bool,
    pub title: String,
    pub description: String,
    pub rating: u8,
}
