export default function MovieCard({
  movie,
  getWatchRecommendation,
  addToWatchlist,
  loading,
}) {
  return (
    <div
      key={movie.id}
      className="flex items-center space-x-4 border-b border-zinc-200 mb-12 pb-6 
      bg-white px-8 pt-12 shadow-md rounded-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
    >
      {movie.poster_path !== null && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          className="md:w-64 sm:w-32 w-24 object-cover rounded-md self-start"
        />
      )}

      <div className="flex flex-col items-start h-full self-baseline space-y-2">
        <h3 className="text-2xl font-semibold">
          {movie.title || movie.original_name}
        </h3>

        <p className="text-sm text-gray-600 flex items-center">
          <span className="text-yellow-500 text-lg mr-2">★</span>
          <b className="uppercase">Rating</b>: {movie.vote_average.toFixed(2)}{" "}
          /10
        </p>

        <p className="text-sm text-gray-600 flex items-center">
          <span className="text-yellow-500 text-lg mr-2">📅</span>
          <b className="uppercase">First Aired</b>:{" "}
          {movie.first_air_date
            ? new Date(movie.first_air_date).getFullYear()
            : new Date(movie.release_date).getFullYear()}
        </p>

        {/* Trim this to fit the screen */}

        {movie.overview && (
          <p className="text-gray-600 text-sm/6">
            {movie.overview.length > 300
              ? `${movie.overview.substring(
                  0,
                  movie.overview.lastIndexOf(" ", 300)
                )}...`
              : movie.overview}
          </p>
        )}

        <div className="mt-4 w-full">
          {getWatchRecommendation(movie.vote_average)}
        </div>
        <div>
          <button
            className="px-4 py-2 my-4 bg-blue-500 text-white font-semibold rounded-md
             hover:bg-blue-600 transition cursor-pointer w-full"
            onClick={() => addToWatchlist(movie)}
          >
            {loading
              ? "Adding..."
              : "Add to Watchlist"}{" "}
            
          </button>
        </div>
      </div>
    </div>
  );
}
