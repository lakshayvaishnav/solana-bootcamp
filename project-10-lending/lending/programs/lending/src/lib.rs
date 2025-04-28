
use anchor_lang::prelude::*;
pub mod state;
pub use state;

declare_id!("3bGvSbAmPfzabXjfjDb7h7TJo7QvhK1XP3aUBLhyQHXC");

#[program]
pub mod lending {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
