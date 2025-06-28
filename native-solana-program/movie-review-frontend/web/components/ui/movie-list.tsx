import { FC, useState, useEffect } from 'react';
import { Card } from './movie-card';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { MovieCoordinator } from '@/coordinator/movieCordinator';
import { Movie } from '@/models/movie-model';
export const MovieList: FC = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const connection = new Connection(clusterApiUrl('devnet'));
  const [movies, setMovies] = useState<Movie[]>([]); // Specify the type here
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    MovieCoordinator.fetchPage(connection, page, 5, search, search !== '').then(
      setMovies
    );
  }, [connection, page, search]);

  return (
    <div className="py-5 flex flex-col w-fullitems-center justify-center">
      <input
        id="search"
        className="w-[300px] p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-400"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />

      {movies.map((movie, i) => (
        <Card key={i} movie={movie} />
      ))}

      <div className="flex justify-between mt-4">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
          >
            Previous
          </button>
        )}
        {movies.length === 5 && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 bg-gray-300 text-black font-semibold rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
