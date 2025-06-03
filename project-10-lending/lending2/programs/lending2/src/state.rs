use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bank {
    pub authority: Pubkey,          // to make changes to bank state
    pub mint_address: Pubkey,       // mint address of the asset
    pub total_deposits: u64,        // current number of tokens in the bank
    pub total_deposit_shares: u64,  // current number of deposit shares in bank
    pub total_borrowed: u64,        // current number of borowwed tokens in the bank
    pub total_borrowed_shares: u64, // current borowwed shares in the bank
    pub liquidation_threshold: u64, // ltv at which the loan is defined as under collaterized and can be liquidated
    pub liquidation_bonus: u64, // % of liquidation sent to the liquidator as bonus for processing the liquidation
    /*
     When a borrower's loan becomes undercollateralized (i.e., the value of their collateral drops too
    much relative to their borrowed amount), their position becomes eligible for liquidation.
        To resolve this risk and maintain solvency of the protocol,
         a third party (the liquidator) can step in and repay some or all of the borrower's debt
         . In return, the liquidator gets to seize part of the borrower's collateral
         — with a bonus, as a reward for helping the system stay healthy.
             */
    pub liquidation_close_factor: u64, // percentage of collateral that can be liquidated
    pub max_ltv: u64,                  // max % of collateral that can be borowwed.
    pub last_updated: i64,             // timestamp
    pub interest_rate: u64,
}

#[account]
#[derive(InitSpace)]
pub struct User {
    pub owner: Pubkey,              // user's wallet
    pub deposited_sol: u64,         // deposited token in the sol bank
    pub deposited_sol_shares: u64,  // user's deposited share in sol bank
    pub borrowed_sol: u64,          // user's borrowed tokens in the sol bank
    pub borrowed_sol_shares: u64,   // user's borrowed shares
    pub deposited_usdc: u64,        // deposited tokens in the usdc token
    pub deposited_usdc_shares: u64, // deposited shares in the usdc bank
    pub borrowed_usdc: u64,         // borrowed usdc in the usdc bank
    pub borrowed_usdc_shares: u64,  //...
    pub usdc_addres: Pubkey,        // usdc mint address
    pub health_factor: u64,         // current health factor of the user
    pub last_updated: i64,          // timestamp
    pub interest_rate: u64,
    pub last_updated_borrow: i64,
}
