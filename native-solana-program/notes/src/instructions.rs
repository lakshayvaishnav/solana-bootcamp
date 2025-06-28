use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

pub enum NotesInstruction {
    AddNote {
        title: String,
        description: String,
    },
    // UpdateNote {
    //     title: String,
    //     description: String,
    // },
    // DeleteNote {
    //     title: String,
    // },
}

#[derive(BorshDeserialize)]
pub struct NotesPayload {
    title: String,
    description: String,
}

impl NotesInstruction {
    pub fn Unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&discriminator, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        match discriminator {
            0 => {
                let payload = NotesPayload::try_from_slice(rest).map_err(
                    |_| ProgramError::InvalidInstructionData
                )?;
                Ok(Self::AddNote { title: payload.title, description: payload.description })
            }

            // 1 => {
            //     let payload = NotesPayload::try_from_slice(rest).map_err(
            //         |_| ProgramError::InvalidInstructionData
            //     )?;
            //     Ok(Self::UpdateNote { title: payload.title, description: payload.description })
            // }

            // 2 => {
            //     let payload = NotesPayload::try_from_slice(rest).map_err(
            //         |_| ProgramError::InvalidInstructionData
            //     )?;
            //     Ok(Self::DeleteNote { title: payload.title })
            // }

            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
