use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
pub struct Borrow<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds= [mint.key().as_ref()],
        bump,
    )]
    pub bank: Account<'info, Bank>,

    #[account(
        mut,
        seeds=[b"treasury",mint.key().as_ref()],
        bump,
    )]
    pub bank_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [signer.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, User>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

// TODO :-
// 1. Check if user has enough collateral to borrow
// 2. Warn if borrowing beyond the safe amount but still allow if within the max borrowable amount
// 3. Make a CPI transfer from the bank's token account to the user's token account
// 4. Update the user's borrowed amount and total borrowed value
// 5. Update the bank's total borrows and total borrow shares

pub fn process_borrow(ctx:context<Borrow>, amount:u64) -> Result<()> {

    

    Ok(())
}