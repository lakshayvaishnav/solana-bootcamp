use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrorCode {
    #[msg("Invalid Price")]
    InvalidPrice,
    #[msg("Below health Factor")]
    BelowMinHealthFactor,
}
