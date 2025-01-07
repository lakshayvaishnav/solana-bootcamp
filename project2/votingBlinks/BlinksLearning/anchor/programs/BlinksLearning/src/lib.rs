#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod BlinksLearning {
    use super::*;

  pub fn close(_ctx: Context<CloseBlinksLearning>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.BlinksLearning.count = ctx.accounts.BlinksLearning.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.BlinksLearning.count = ctx.accounts.BlinksLearning.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeBlinksLearning>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.BlinksLearning.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeBlinksLearning<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + BlinksLearning::INIT_SPACE,
  payer = payer
  )]
  pub BlinksLearning: Account<'info, BlinksLearning>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseBlinksLearning<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub BlinksLearning: Account<'info, BlinksLearning>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub BlinksLearning: Account<'info, BlinksLearning>,
}

#[account]
#[derive(InitSpace)]
pub struct BlinksLearning {
  count: u8,
}
