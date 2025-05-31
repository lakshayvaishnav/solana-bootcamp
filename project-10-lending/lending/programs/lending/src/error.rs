use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("user has insufficient funds for withdrawl")]
    InsufficientFunds
}