use anchor_lang::prelude::*;

use target::cpi::{accounts::Update as UpdateCpi, update as update_cpi};
use target::program::Target;
use target::DataAccount;

declare_id!("Hxu2ozPdaCYsVZUvpYByEvvGRxNF2EPUdQfEjgq6Fscw");

#[program]
pub mod caller {
    use super::*;

    pub fn call_update(ctx: Context<CallUpdate>, data: u64) -> Result<()> {
        let cpi_accounts = UpdateCpi {
            data_account: ctx.accounts.data_account.to_account_info(),
        };

        let cpi_program = ctx.accounts.target_program.to_account_info();

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        update_cpi(cpi_ctx, data)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CallUpdate<'info> {
    /// the on chain target program
    pub target_program: Program<'info, Target>,

    pub data_account: Account<'info, DataAccount>,
}
