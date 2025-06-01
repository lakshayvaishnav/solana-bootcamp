use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("user has insufficient funds for withdrawl")]
    InsufficientFunds,
    #[msg("requested amount exceeds borrowable amount")]
    OverBorrowableAmount,
    #[msg("request amount exceeds depositable amount")]
    OverRepay,
    #[msg("user not under collateralized , cannot be liquidateed")]
    NotUnderCollateralized
}