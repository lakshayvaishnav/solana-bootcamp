export type AnchorMovieReviewProgram = {
  "version": "0.1.0",
  "name": "anchor_movie_review_program",
  "instructions": [
    {
      "name": "addMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deleteMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeTokenMint",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "movieAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reviewer",
            "type": "publicKey"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidRating",
      "msg": "Rating must be between 1 and 5"
    },
    {
      "code": 6001,
      "name": "TitleTooLong",
      "msg": "Movie Title too long"
    },
    {
      "code": 6002,
      "name": "DescriptionTooLong",
      "msg": "Movie Description too long"
    }
  ]
};

export const IDL: AnchorMovieReviewProgram = {
  "version": "0.1.0",
  "name": "anchor_movie_review_program",
  "instructions": [
    {
      "name": "addMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "rating",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deleteMovieReview",
      "accounts": [
        {
          "name": "movieReview",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeTokenMint",
      "accounts": [
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "movieAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reviewer",
            "type": "publicKey"
          },
          {
            "name": "rating",
            "type": "u8"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidRating",
      "msg": "Rating must be between 1 and 5"
    },
    {
      "code": 6001,
      "name": "TitleTooLong",
      "msg": "Movie Title too long"
    },
    {
      "code": 6002,
      "name": "DescriptionTooLong",
      "msg": "Movie Description too long"
    }
  ]
};
