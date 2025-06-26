use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

pub enum MovieReviewInstruction {
    AddMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    UpdateMovieReview {
        title: String,
        rating: u8,
        description: String,
    },
    AddComment {
        comment: String,
    },
}
#[derive(BorshDeserialize)]
struct CommentPayload {
    comment: String,
}

#[derive(BorshDeserialize)]
struct MovieReviewPayload {
    title: String,
    description: String,
    rating: u8,
}

impl MovieReviewInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        let payload = MovieReviewPayload::try_from_slice(&rest)?;

        match variant {
            0 =>
                Ok(Self::AddMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }),

            1 =>
                Ok(Self::UpdateMovieReview {
                    title: payload.title,
                    rating: payload.rating,
                    description: payload.description,
                }),

            2 =>
                Ok({
                    let payload = CommentPayload::try_from_slice(rest).unwrap();
                    Self::AddComment { comment: payload.comment }
                }),
                
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
