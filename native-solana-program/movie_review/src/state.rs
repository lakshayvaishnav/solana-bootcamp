use borsh::{ BorshDeserialize, BorshSerialize };

#[derive(BorshDeserialize, BorshSerialize)]
pub struct MovieAccountState {
    pub is_initialized: bool,
    title: String,
    description: String,
    rating: u8,
}


