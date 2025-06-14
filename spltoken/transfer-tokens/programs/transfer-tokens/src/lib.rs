#![allow(warnings)]

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{ Mint, TokenAccount, TokenInterface },
};

declare_id!("FGkMtWCFedRQDA7u3PHHMztDaDBfr7QaTjNV5pfNiXpU");

#[program]
pub mod transfer_tokens {
    use anchor_spl::{ token_2022::MintTo, token_interface };

    use super::*;

    pub fn create_and_mint_tokens(ctx: Context<CreateAndMintTokens>, amount: u64) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[b"mint", &[ctx.bumps.mint]]];

        let cpi_accounts = MintTo {
            authority: ctx.accounts.mint.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();

        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token_interface::mint_to(cpi_context, amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAndMintTokens<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        mint::authority = mint,
        mint::freeze_authority = mint,
        mint::decimals = 6,
        seeds = [b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = signer,
        token::mint = mint,
        token::authority = token_account,
        seeds = [b"token"],
        bump
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
            mut,
            seeds = [b"mint"],
            bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        token::mint = mint,
        token::authority = sender_token_account,
        seeds=[b"token"],
        bump
    )]
    pub sender_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program
    )]
    pub recipients_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}
