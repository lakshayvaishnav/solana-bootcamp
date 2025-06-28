import { FC, FormEvent, useState } from 'react';
import {
  Transaction,
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Movie } from '@/models/movie-model';
import { StarIcon } from '@heroicons/react/24/solid';

import { useFormTransactionToast } from './ui-layout';
import { MOVIE_REVIEW_PROGRAM_ID } from '@/coordinator/movieCordinator';

export const Form: FC = () => {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const showTransactionToast = useFormTransactionToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const movie = new Movie(title, rating, description);
    handleTransactionSubmit(movie);
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleTransactionSubmit = async (movie: Movie) => {
    if (!publicKey) {
      console.log('Please connect your wallet to submit a review.');
      return;
    }

    const buffer = movie.serialize();
    const transaction = new Transaction();

    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(movie.title)],
      new PublicKey(MOVIE_REVIEW_PROGRAM_ID)
    );

    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: pda, isSigner: false, isWritable: true },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: new PublicKey(MOVIE_REVIEW_PROGRAM_ID),
    });

    transaction.add(instruction);

    try {
      const transactionId = await sendTransaction(transaction, connection);
      showTransactionToast({
        signature: transactionId,
        status: 'success',
      });
      console.log(
        `Transaction submitted: https://explorer.solana.com/tx/${transactionId}?cluster=devnet`
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showTransactionToast({
        status: 'failure',
        errorMessage: error.message,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="py-4 px-6 max-w-[450px] flex items-center justify-center flex-col border border-gray-700 rounded-lg bg-gray-800 text-white"
    >
      <div className="mb-4">
        <label className="block text-gray-400 mb-2" htmlFor="title">
          Movie Title
        </label>
        <input
          id="title"
          className="p-2 w-[400px] bg-gray-700 border border-gray-600 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400 mb-2" htmlFor="review">
          Add Your Review
        </label>
        <textarea
          id="review"
          className="w-[400px] p-2 bg-gray-700 border border-gray-600 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-center text-gray-400 mb-2"
          htmlFor="rating"
        >
          Select Rating
        </label>
        <div className="flex  space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-8 w-8 cursor-pointer ${
                star <= rating ? 'text-yellow-400' : 'text-gray-500'
              }`}
              onClick={() => handleStarClick(star)}
            />
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-[400px] p-2 bg-green-600 hover:bg-green-700 rounded"
      >
        Submit Review
      </button>
    </form>
  );
};
