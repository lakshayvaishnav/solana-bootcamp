'use client';

import { FC } from 'react';
import { Movie } from '@/models/movie-model';
import { StarIcon } from '@heroicons/react/24/solid';

export interface CardProps {
  movie: Movie;
}

export const Card: FC<CardProps> = ({ movie }) => {
  // Ensure the rating is capped at 5
  const displayRating = Math.min(movie.rating, 5);

  return (
    <div className="p-4 w-[500px] border border-gray-700 rounded-lg m-2 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {movie.title.length ? movie.title : 'no title'}
        </h2>
        <div className="flex items-center">
          {/* Render stars based on the rating */}
          {[...Array(5)].map((_, index) => (
            <StarIcon
              key={index}
              className={`h-4 w-4 ${
                index < displayRating ? 'text-yellow-400' : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-400 mt-2">
        {movie.description.length ? movie.description : 'no description'}
      </p>
    </div>
  );
};
