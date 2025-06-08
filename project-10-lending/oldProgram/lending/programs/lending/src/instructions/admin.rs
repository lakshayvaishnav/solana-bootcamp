use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct InitBank<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        space = 8 + Bank::INIT_SPACE,
        payer = signer,
        seeds = [mint.key().as_ref()],
        bump,
    )]
    pub bank: Account<'info, Bank>,

    // token account to hold the tokens for the bank
    #[account(
        init,
        token::mint = mint,
        payer = signer,
        token::authority = bank_token_account,
        seeds = [b"treasury", mint.key().as_ref()],
        bump
    )]
    /*
     Interface account: -
    This account must conform to a particular interface — in this case,
    the interface of an SPL Token Account.
    The program doesn’t own this account, but it can read and validate its structure.
    Anchor uses this for accounts it doesn’t expect to create or control, 
    like SPL token accounts, oracles, etc.
    */
    pub bank_token_account: InterfaceAccount<'info, TokenAccount>,

    // because we are creating new token accounts
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + User::INIT_SPACE,
        seeds = [signer.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, User>,
    pub system_program: Program<'info, System>,
}

pub fn process_init_bank(
    ctx: Context<InitBank>,
    liquidation_threshold: u64,
    max_ltv: u64,
) -> Result<()> {
    let bank = &mut ctx.accounts.bank;
    bank.mint_address = ctx.accounts.mint.key();
    bank.authority = ctx.accounts.signer.key();
    bank.liquidation_threshold = liquidation_threshold;
    bank.max_ltv = max_ltv;
    bank.interest_rate = 0.05 as u64;
    Ok(())
}

pub fn process_init_user(ctx: Context<InitUser>, usdc_address: Pubkey) -> Result<()> {
    let user = &mut ctx.accounts.user_account;
    user.owner = ctx.accounts.signer.key();
    user.usdc_addres = usdc_address;

    let now = Clock::get()?.unix_timestamp;
    user.last_updated = now;
    Ok(())
}
