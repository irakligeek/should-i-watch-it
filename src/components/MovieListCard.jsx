export default function MovieListCard({ movie, removeMovie }) {
  return (
    <div className="movie-card flex flex-col items-start text-left relative">
      <button
        className="absolute top-2 right-2 w-6 h-6 bg-white text-white 
         cursor-pointer rounded-full flex flex-col items-center justify-center"
        onClick={() => removeMovie(movie.id)}
      >
        <span className="text-xs text-zinc-800 font-bold">X</span>
      </button>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full object-cover rounded-md"
      />
      <div className="w-full flex flex-col items-start mt-2 mb-6">
        {movie.title ? (
          <h3 className="text-lg font-semibold mt-2">{movie.title}</h3>
        ) : (
          <h3 className="text-lg font-semibold mt-2">{movie.name}</h3>
        )}
        {movie?.genres && (
          <div className="text-xs text-gray-500 mt-1 uppercase">
            <b>{movie?.genres.map((genre) => genre.name).join(", ")}</b>
          </div>
        )}

        <ul className="text-sm text-gray-500 mt-1">
          <li>
            <b className="uppercase">Rating</b>: {movie.vote_average.toFixed(2)}{" "}
            /10
          </li>
          <li>
            <b className="uppercase">Date</b>:
            <span className="ml-1">
              {movie.first_air_date
                ? new Date(movie.first_air_date).getFullYear()
                : new Date(movie.release_date).getFullYear()}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
