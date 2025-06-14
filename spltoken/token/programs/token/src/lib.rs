#![allow(warnings)]

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::Token2022,
    token_interface::{ Mint, TokenAccount, TokenInterface, MintTo },
};

declare_id!("Ct1Z2eBNSu2MAgXG82BsaYF69irQwZZkrGPRc26HY224");

#[program]
pub mod token {
    use anchor_spl::token_interface;

    use super::*;

    // pub fn create_mint(ctx: Context<CreateMint>) -> Result<()> {
    //     msg!("createdd mint account : {:?}", ctx.accounts.mint.key());
    //     Ok(())
    // }

    pub fn create_mint_pda(ctx: Context<CreateMintPDA>) -> Result<()> {
        msg!("created mint account using pda : {:?}", ctx.accounts.mint.key());
        Ok(())
    }

    // pub fn create_token_account(ctx: Context<CreateTokenAccount>) -> Result<()> {
    //     msg!("token account created successfully : {:?}", ctx.accounts.token_account.key());
    //     Ok(())
    // }

    // pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
    //     let cpi_accounts = MintTo {
    //         authority: ctx.accounts.signer.to_account_info(),
    //         mint: ctx.accounts.mint.to_account_info(),
    //         to: ctx.accounts.token_account.to_account_info(),
    //     };

    //     let cpi_program = ctx.accounts.token_program.to_account_info();

    //     let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    //     token_interface::mint_to(cpi_context, amount)?;

    //     Ok(())
    // }

    pub fn mint_tokens_pda(ctx:Context<MintTokensPDA>, amount: u64) -> Result<()> {
        let signer_seeds: &[&[&[u8]]] = &[&[b"mint", &[ctx.bumps.mint]]];

        let cpi_accounts = MintTo {
                authority: ctx.accounts.mint.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();

        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        token_interface::mint_to(cpi_context, amount)?;

        Ok(())

    }

    // pub fn mint_tokens_pda()
}

/*
A mint account is an account type in Solana's Token Programs that uniquely represents 
a token on the network and stores global metadata about the token.
*/

// #[derive(Accounts)]
// pub struct CreateMint<'info> {
//     #[account(mut)]
//     pub signer: Signer<'info>,

//     #[account(
//         init,
//         payer = signer,
//         mint::decimals = 6,
//         mint::authority = signer.key(),
//         mint::freeze_authority = signer.key()
//     )]
//     pub mint: InterfaceAccount<'info, Mint>,
//     pub token_program: Interface<'info, TokenInterface>,
//     pub system_program: Program<'info, System>,
// }

#[derive(Accounts)]
pub struct CreateMintPDA<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        mint::decimals = 6,
        mint::authority = mint,
        mint::freeze_authority = mint,
        seeds = [b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

/*
    Anchor provides two sets of constraints for working with token accounts:
Use associated_token constraints when working with Associated Token Accounts (ATAs)
Use token constraints when working with token accounts that are not specifically ATAs, 
such as custom PDAs or token accounts with addresses that are public keys from a keypair
The appropriate constraint to use depends on your specific use case. 
ATAs are recommended for user wallets, while custom token accounts are useful 
for program controlled accounts
*/

// #[derive(Accounts)]
// pub struct CreateTokenAccount<'info> {
//     #[account(mut)]
//     pub signer: Signer<'info>,
//     #[account(
//         init_if_needed,
//         payer = signer,
//         associated_token::mint = mint,
//         associated_token::authority = signer,
//         associated_token::token_program = token_program
//     )]
//     pub token_account: InterfaceAccount<'info, TokenAccount>,
//     pub token_program: Interface<'info, TokenInterface>,
//     pub mint: InterfaceAccount<'info, Mint>,
//     pub associated_token_program: Program<'info, AssociatedToken>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct MintTokens<'info> {
//     #[account(mut)]
//     pub signer: Signer<'info>,

//     #[account(mut)]
//     pub mint: InterfaceAccount<'info, Mint>,

//     #[account(mut)]
//     pub token_account: InterfaceAccount<'info, TokenAccount>,

//     pub token_program: Interface<'info, TokenInterface>,
// }

#[derive(Accounts)]
pub struct MintTokensPDA<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds=[b"mint"],
        bump
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
        associated_token::token_program = token_program
    )]
    pub token_account: InterfaceAccount<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
