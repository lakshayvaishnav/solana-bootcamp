use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface},
};
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::state::{Bank, User};

#[derive(Accounts)]
pub struct Liquidate<'info> {
    #[account(mut)]
    pub liquidator: Signer<'info>,

    pub price_update: Account<'info, PriceUpdateV2>,
    pub collateral_mint: InterfaceAccount<'info, Mint>,
    pub borrowed_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [collateral_mint.key().as_ref()],
        bump
    )]
    pub collateral_bank: Account<'info, Bank>,

    #[account(
        mut,
        seeds = [borrowed_mint.key().as_ref()],
        bump
    )]
    pub borrowed_bank: Account<'info, Bank>,

    #[account(
        mut,
        seeds = [b"treasury", collateral_mint.key().as_ref()],
        bump
    )]
    pub collateral_bank_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"treasury", borrowed_mint.key().as_ref()],
        bump
    )]
    pub borrowed_bank_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [liquidator.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, User>,

    #[account(
        init_if_needed ,
        payer = liquidator,
        associated_token::mint = collateral_mint,
        associated_token::authority = liquidator,
        associated_token::token_program = token_program
    )]
    pub liquidator_collateral_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,


    #[account(
        init_if_needed ,
        payer = liquidator,
        associated_token::mint = borrowed_mint,
        associated_token::authority = liquidator,
        associated_token::token_program = token_program
    )]
    pub liquidator_borrowed_token_account: InterfaceAccount<'info, TokenAccount>,
    
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
