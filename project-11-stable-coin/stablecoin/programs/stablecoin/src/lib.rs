use anchor_lang::prelude::*;

declare_id!("7p5mRD4WXczDvTFao7h2rGnT8JbEK4DpxetaFQzk99j1");

#[program]
pub mod stablecoin {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
