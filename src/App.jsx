import "./App.css";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import Footer from "./components/Footer";
import logo from "../logo.png";
import { useAuth } from "react-oidc-context";
import awsCognito from "./aws-cognito";
import MovieListCard from "./components/MovieListCard";

function App() {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState(null);
  const [searchType, setSearchType] = useState("movie"); // Default is 'movie'
  const [isLoading, setIsLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userWatchlist, setUserWatchlist] = useState(false);

  // useEffect(() => {
  //   if (window.location.search.includes("code=")) {
  //     const newUrl = window.location.origin + window.location.pathname;
  //     window.history.replaceState({}, document.title, newUrl);
  //   }
  // }, []);

  // Get user watchlist on
  useEffect(() => {
    if (auth.isAuthenticated) {
      getUserMovies();
    }
  }, [auth.isAuthenticated]);

  const getUserMovies = async () => {
    if (auth.isAuthenticated) {
      setWatchlistLoading(true);
      //call getUserWatchlist API Gateway endpoint passing user email
      const userId = auth.user?.profile.email;
      const userToken = auth.user?.id_token;
      if (!userId || !userToken) {
        console.error("User ID or token is missing");
        return false;
      }
      try {
        const response = await fetch(
          `https://k1znmi2cr7.execute-api.us-east-1.amazonaws.com/dev/get-user-movies?userId=${encodeURIComponent(
            userId
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        setUserWatchlist(data.movies);
        setWatchlistLoading(false);
        return data.movies || [];
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        setWatchlistLoading(false);
        return [];
      }
    }
    setWatchlistLoading(false);
    return false;
  };

  const fetchMoviesAndTV = async (query) => {
    try {
      // Replace the local API call with the API Gateway URL and include the 'type' parameter
      const endpoint = `https://k1znmi2cr7.execute-api.us-east-1.amazonaws.com/dev/search-movies?query=${encodeURIComponent(
        query
      )}&type=${encodeURIComponent(searchType)}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is ok (status 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log("Fetched movies and TV shows:", data);

      // You can now update your UI based on the response, for example:
      setMovies(data.movies || []);
      return data.movies;
    } catch (error) {
      console.error("Error fetching movies and TV shows:", error);
      return [];
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      await fetchMoviesAndTV(searchQuery);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setIsSearching(false);
  };

  const addToWatchlist = async (movie) => {
    if (!auth.isAuthenticated) {
      alert("Please sign in to add movies to your watchlist.");
      return;
    }
    const movieId = String(movie.id);
    const userId = auth.user?.profile.email;
    const userToken = auth.user?.id_token;

    try {
      setIsLoading(true);
      // For example, call your backend endpoint that stores the watchlist item.
      const response = await fetch(
        "https://k1znmi2cr7.execute-api.us-east-1.amazonaws.com/dev/add-movie",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId, userId, type: searchType }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.statusCode !== 200) {
        console.error("Error adding movie to watchlist:", data);
        alert("Something went wrong...");
      } else {
        console.log("Movie added to watchlist:", data);
        //... Update the watchlist in the UI
        setUserWatchlist((prevWatchlist) => [...prevWatchlist, movie]);
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      alert("Failed to add movie to watchlist.");
    }
    setIsLoading(false);
  };

  function getWatchRecommendation(rating) {
    if (rating >= 8) {
      return (
        <div className="flex items-center text-yellow-500">
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="font-semibold text-yellow-500 mx-2">Must Watch</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
        </div>
      );
    } else if (rating >= 6.5) {
      return (
        <div className="flex items-center text-yellow-500">
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="font-semibold mx-2">Worth watching</span>
          <span className="text-yellow-500 text-xl">★</span>
          <span className="text-yellow-500 text-xl">★</span>
        </div>
      );
    } else if (rating >= 4.5) {
      return (
        <div className="flex items-center text-orange-500">
          <span className="text-yellow-500 text-xl">★</span>
          <span className="ml-2 font-semibold">Maybe</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-500">
          <span className="text-yellow-500 text-xl mx-2">👎</span>
          <span className="ml-2 font-semibold">Waste of Time</span>
        </div>
      );
    }
  }

  const handleSignOut = () => {
    auth.removeUser();
    const clientId = awsCognito.client_id;
    const logoutUri =  import.meta.env.VITE_LOGOUT_URI;
    const cognitoDomain =
      "https://us-east-1vevbdzdmq.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const removeMovie = async (movieId) => {
    const userId = auth.user?.profile.email;
    const userToken = auth.user?.id_token;

    if (!auth.isAuthenticated) {
      return;
    }
    if (!userId || !userToken) {
      console.error("User ID or token is missing");
      return;
    }
    const url =
      "https://k1znmi2cr7.execute-api.us-east-1.amazonaws.com/dev/remove-movie";

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ userId, movieId }),
      });

      const data = await response.json();
      //updarte watchlist
      setUserWatchlist(
        userWatchlist.filter((movie) => movie.id !== parseInt(movieId))
      );

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete movie");
      }

      return data;
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  console.log("is authenticated", auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 ">
      <header className="w-full text-right p-4 max-w-2xl">
        {auth.isAuthenticated && (
          <button
            onClick={() => handleSignOut()}
            className="text-blue-400 font-black hover:text-blue-500 px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        )}
        {!auth.isAuthenticated && (
          <button
            onClick={() => auth.signinRedirect()}
            type="submit"
            className="text-blue-400 font-black hover:text-blue-500 px-4 py-2 rounded-md transition-colors cursor-pointer"
          >
            Sign In
          </button>
        )}
      </header>
      <section className="w-full max-w-2xl sm:p-8 px-2 flex-grow">
        <h1 className="sm:text-4xl text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-12 h-12 mr-4" />
          Should I Watch This?
        </h1>

        <div className="w-full">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row">
            <div className="flex w-full pb-4 sm:pb-0">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-sm font-bold custom-select"
              >
                <option value="movie" className="text-sm">
                  Movie
                </option>
                <option value="tv" className="text-sm">
                  TV
                </option>
              </select>
              <input
                required
                type="text"
                placeholder="Search for a movie or TV show..."
                className="flex-grow sm:px-4 px-2 py-2 sm:border-t sm:border-b border
                 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800
                 rounded-r-md sm:rounded-r-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-r-md rounded-l-md sm:rounded-l-none transition-colors cursor-pointer sm:w-32"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <div className="mt-8 w-full ">
          {movies && movies.length > 0 && (
            <div className="">
              {movies.length > 0 && (
                <MovieCard
                  movie={movies[0]}
                  getWatchRecommendation={getWatchRecommendation}
                  addToWatchlist={() => addToWatchlist(movies[0])}
                  loading={isLoading}
                />
              )}
            </div>
          )}
          {movies && movies.length == 0 && (
            <div className="text-left text-gray-600">
              {isSearching ? (
                <p>Loading...</p>
              ) : (
                <p>No results found. Please try a different search.</p>
              )}
            </div>
          )}
        </div>

        {/* Watchlist */}
        {userWatchlist && userWatchlist.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🎬 My Watchlist
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px]">
              {userWatchlist.map((movie) => (
                <MovieListCard
                  key={movie.id}
                  movie={movie}
                  removeMovie={removeMovie}
                />
              ))}
            </div>
          </div>
        ) : auth.isAuthenticated && watchlistLoading ? (
          <p className="text-gray-500 text-sm mt-8">
            Loading your watchlist...
          </p>
        ) : auth.isAuthenticated && userWatchlist?.length === 0 ? (
          <p className="text-gray-500 text-sm mt-8">
            No movies in your watchlist. Start adding some!
          </p>
        ) : null}
      </section>
      <Footer />
    </div>
  );
}

export default App;
