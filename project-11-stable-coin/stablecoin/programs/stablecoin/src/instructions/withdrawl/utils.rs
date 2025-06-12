use anchor_lang::{
    prelude::*,
    solana_program::example_mocks::solana_sdk::system_program,
    system_program::{transfer, Transfer},
};

use crate::SEED_SOL_ACCOUNT;

pub fn withdraw_sol<'info>(
    bump: u8,
    depositor_key: &Pubkey,
    system_program: &Program<'info, System>,
    from: &SystemAccount<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    let signer_seeds: &[&[&[u8]]] = &[&[SEED_SOL_ACCOUNT, depositor_key.as_ref(), &[bump]]];

    transfer(
        CpiContext::new_with_signer(
            system_program.to_account_info(),
            Transfer {
                from: from.to_account_info(),
                to: to.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    );
    Ok(())
}
