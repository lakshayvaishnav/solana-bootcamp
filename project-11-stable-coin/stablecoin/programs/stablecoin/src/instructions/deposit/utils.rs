use anchor_lang::prelude::*;
use anchor_spl::{
    token_2022::{mint_to, Token2022},
    token_interface::{Mint, MintTo, TokenAccount},
};

use crate::SEED_MINT_ACCOUNT;

pub fn mint_tokens<'info>(
    token_account: InterfaceAccount<'info, TokenAccount>,
    mint_account: InterfaceAccount<'info, Mint>,
    token_program: &Program<'info, Token2022>,
    bump: u8,
    amount: u64,
) -> Result<()> {
    let signer_seeds: &[&[&[u8]]] = &[&[SEED_MINT_ACCOUNT, &[bump]]];

    mint_to(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            MintTo {
                mint: mint_account.to_account_info(),
                to: token_account.to_account_info(),
                authority: mint_account.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )
}

pub fn deposit_sol<'info> () -> Result<()> {

    
    Ok(())
}