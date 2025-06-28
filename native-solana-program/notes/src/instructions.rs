use borsh::BorshDeserialize;

pub enum NotesInstruction {
    AddNote {
        title: String,
        description: String,
    },
    UpdateNote {
        title: String,
        description: String,
    },
    DeleteNote {
        title: String,
    },
}

#[derive(BorshDeserialize)]
pub struct NotesPayload {
    title: String,
    description: String,
}
