#![allow(warnings)]
use anchor_lang::prelude::*;

pub mod constants;
pub mod state;
pub mod instructions;
pub mod error;

pub use error::*;
pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("7p5mRD4WXczDvTFao7h2rGnT8JbEK5DpxetaFQzk99j1");

#[program]
pub mod stablecoin {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        process_initialize_config(ctx)?;
        Ok(())
    }

    pub fn update_config(ctx:Context<UpdateConfig>, min_health_factor: u64) -> Result<()> {
        process_update_config(ctx, min_health_factor);
        Ok(())
    }
}
