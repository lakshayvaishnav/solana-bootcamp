#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("HHi3bR2Qc9XwEowF4DA9GxfC8hiY5aXuwyaMvDiCo71X");

#[program]
pub mod crudapp {
    use super::*;

    // Create Instruction
    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = *ctx.accounts.owner.key;
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }

    // Update Instruction
    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        _title: String,
        message: String,
    ) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(_ctx: Context<DeleteEntry>, _title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteEntry<'info> {
    #[account(
    mut,
    seeds = [title.as_bytes(),owner.key().as_ref()],
    bump,
    // only the owner can close this account
    close = owner
  )]
    pub journal_entry: Account<'info, JournalEntyState>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
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

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateEntry<'info> {
    #[account(
      mut,
      seeds = [title.as_bytes(),owner.key().as_ref()],
      bump,
      realloc = 8 + JournalEntyState::INIT_SPACE,
      realloc::payer = owner,
      realloc::zero = true,
    )]
    pub journal_entry: Account<'info, JournalEntyState>,
    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntyState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
