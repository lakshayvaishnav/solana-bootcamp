#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::Metadata,
    token_interface::{Mint, TokenAccount, TokenInterface},
};

declare_id!("BrLPbsKw3m7SGe5WQbmoKs5w7qJtRhHXkDh2Cbt9N35Z");

#[constant]
pub const NAME: &str = "TOKEN LOTTERY TICKET TICKET #";
pub const SYMBOL: &str = "TLT";
pub const URI:&str = "https://imgs.search.brave.com/nodruDXW5zqheP1m3NtbdCARtS1u8F3w5n_GofIF65Q/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzEwLzU1Lzg3/LzM2MF9GXzUxMDU1/ODcwMV9pRXZ6TFo4/SVFVV1dsQ0wxWEto/Rlp0d0E0dE5PRHRj/MS5qcGc";

#[program]
pub mod tokenlottery {
    use anchor_spl::{
        metadata::{
            create_master_edition_v3, create_metadata_accounts_v3,
            mpl_token_metadata::types::{CollectionDetails, Creator, DataV2},
            sign_metadata, CreateMasterEditionV3, CreateMetadataAccountsV3, SignMetadata,
        },
        token::{mint_to, MintTo},
    };

    use super::*;
    /*
    ctx.bumps.token_lottery: This retrieves the bump seed value that was automatically
     determined by Anchor when deriving the PDA for the token_lottery account.
     */
    pub fn initialize_config(ctx: Context<Initialize>, start: u64, end: u64, price: u64) -> Result<()> {
        ctx.accounts.token_lottery.bump = ctx.bumps.token_lottery;
        ctx.accounts.token_lottery.start_time = start;
        ctx.accounts.token_lottery.end_time = end;
        ctx.accounts.token_lottery.ticket_price = price;
        /*
        the .key method on an AccountInfo gives you a reference to a Pubkey
        authority field on token_lottery is of type Pubkey (an owned value), not &Pubkey.
         So you need to turn that &Pubkey into a Pubkey
         */
        ctx.accounts.token_lottery.authority = *ctx.accounts.payer.key;
        ctx.accounts.token_lottery.lottery_pot_amount = 0;
        ctx.accounts.token_lottery.total_tickets = 0;
        ctx.accounts.token_lottery.randomness_account = Pubkey::default();
        ctx.accounts.token_lottery.winner_chosen = false;

        Ok(())
    }

    pub fn initialize_lottery(ctx: Context<InitalizeLottery>) -> Result<()> {
        /*
        A reference to a slice of references to slices of references to byte strings.
         This is the type of signer_seeds.
         */
        let signer_seeds: &[&[&[u8]]] = &[&[b"collection_mint".as_ref(), &[ctx.bumps.collection_mint]]];
        msg!("Creating mint account !");
        mint_to(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.collection_mint.to_account_info(),
                    to: ctx.accounts.collection_token_account.to_account_info(),
                    authority: ctx.accounts.collection_mint.to_account_info(),
                },
                signer_seeds,
            ),
            1,
        )?;

        msg!("Creating metadat account !");
        create_metadata_accounts_v3(
            CpiContext::new_with_signer(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata.to_account_info(),
                    mint: ctx.accounts.collection_mint.to_account_info(),
                    mint_authority: ctx.accounts.collection_mint.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    update_authority: ctx.accounts.collection_mint.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
                &signer_seeds,
            ),
            DataV2 {
                name: NAME.to_string(),
                symbol: SYMBOL.to_string(),
                uri: URI.to_string(),
                seller_fee_basis_points: 0,
                creators: Some(vec![Creator {
                    address: ctx.accounts.collection_mint.key(),
                    verified: false,
                    share: 100,
                }]),
                collection: None,
                uses: None,
            },
            true,
            true,
            Some(CollectionDetails::V1 { size: 0 }),
        )?;

        msg!("Creating Master Edition");
        create_master_edition_v3(
            CpiContext::new_with_signer(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMasterEditionV3 {
                    payer: ctx.accounts.payer.to_account_info(),
                    mint: ctx.accounts.collection_mint.to_account_info(),
                    edition: ctx.accounts.master_edition.to_account_info(),
                    mint_authority: ctx.accounts.collection_mint.to_account_info(),
                    update_authority: ctx.accounts.collection_mint.to_account_info(),
                    metadata: ctx.accounts.metadata.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    token_program: ctx.accounts.token_program.to_account_info(),
                },
                &signer_seeds,
            ),
            Some(0),
        )?;

        msg!("Verifying the collection");

        sign_metadata(CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            SignMetadata {
                creator: ctx.accounts.collection_mint.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
            },
            signer_seeds,
        ))?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
    init,
    payer = payer,
    space = 8 + TokenLottery::INIT_SPACE,
    seeds = [b"token_lottery".as_ref()],
    bump
  )]
    pub token_lottery: Account<'info, TokenLottery>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct TokenLottery {
    pub bump: u8,
    pub winner: u64,
    pub winner_chosen: bool,
    pub start_time: u64,
    pub end_time: u64,
    pub lottery_pot_amount: u64,
    pub total_tickets: u64,
    pub ticket_price: u64,
    pub authority: Pubkey,
    pub randomness_account: Pubkey,
}

#[derive(Accounts)]
pub struct InitalizeLottery<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /*

    */
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer,
        seeds = [b"collection_mint".as_ref()],
        bump
    )]
    pub collection_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = payer,
        token::mint = collection_token_account,
        token::authority = payer,
        seeds = [b"collection_associated_token".as_ref()],
        bump,
    )]
    pub collection_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut, 
    seeds = [b"metadata", 
    token_metadata_program.key().as_ref(), 
    collection_mint.key().as_ref(),
    b"edition"], 
    bump, 
    seeds::program = token_metadata_program.key())]
    /*
    unchecked accounts - These are accounts that are not deserialized into a Rust struct but are still checked by the program
     */
    /// CHECK: This account is checked by the metadata smart contract
    pub metadata: UncheckedAccount<'info>,

    #[account(mut)]
    /// CHECK : This account is checked by the metadata smart contract
    pub master_edition: UncheckedAccount<'info>,

    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,

    pub rent: Sysvar<'info, Rent>,
}
