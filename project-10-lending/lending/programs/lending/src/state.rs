use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bank {
    pub authority: Pubkey, // to make changes to bank state
    pub mint_address: Pubkey, // mint address of the asset
    pub total_deposits: u64, // current number of tokens in the bank
    pub total_deposit_shares: u64, // current number of deposit shares in bank
    pub total_borrowed: u64, // current number of borowwed tokens in the bank
    pub total_borrowed_shares: u64, // current borowwed shares in the bank
    pub liquidation_threshold: u64, // ltv at which the loan is defined as under collaterized and can be liquidated
    pub liquidation_bonus: u64, // bonus percentage of collateral that can be liquidated
    pub liquidation_close_factor: u64, // percentage of collateral that can be liquidated
    pub max_lt: u64, // max % of collaterat that can be borowwed.
    pub last_updated: i64, // timestamp
    pub interest_rate: u64,
}
