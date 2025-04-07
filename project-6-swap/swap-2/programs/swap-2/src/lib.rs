pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("CYVNqXKnxQApda3X1V5hRCKrhFcWAkt3yxtei6zbq4ys");

#[program]
pub mod swap_2 {
    use super::*;

    pub fn make_offer(context: Context<MakeOffer>) -> Result<()> {
    instructions::make_offer::send_offered_tokens_to_vault()?;        
    instructions::make_offer::save_offer(context);
    }
    
}
