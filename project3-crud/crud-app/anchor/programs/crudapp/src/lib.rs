#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod crudapp {
    use super::*;

    pub fn create_journal_entry(ctx: Context<CreateEntry>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEntry<'info> {
    #[account(
    init,
    seeds = [title.as_bytes(),owner.key().as_ref()],
    bump,
    space = 8 + JournalEntyState::INIT_SPACE,
    payer = owner,
  )]
    pub journal_entry: Account<'info, JournalEntyState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntyState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub titie: String,
    #[max_len(1000)]
    pub message: String,
}
