import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Card from "./components/Card";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [movies, setMovies] = useState([]); // Stores all movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Stores filtered movies
  const [genres, setGenres] = useState([]); // Stores genres
  const [activeGenre, setActiveGenre] = useState("All"); // Current selected genre
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(""); // Error message
  const [showGenres, setShowGenres] = useState(false); // Toggle button for genres visibility
  const [searchQuery, setSearchQuery] = useState(""); // Stores the search query

  const tmdbApiKey = "4b86804d2b1ffd88a7ed721d21dbfc62"; // my TMDB API key

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      setLoading(true);
      setError("");

      try {
        const genreResponse = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApiKey}&language=en-US`
        );

        // list of genres to include
        const selectedGenres = [
          "Animation",
          "Comedy",
          "Family",
          "Horror",
          "Science Fiction",
          "Fantasy",
          "Romance",
        ];

        // Filter only selected genres
        const filteredGenres = genreResponse.data.genres.filter((genre) =>
          selectedGenres.includes(genre.name)
        );

        setGenres([{ id: "All", name: "All" }, ...filteredGenres]);

        // Fetch movies for each genre
        const genreMoviesPromises = filteredGenres.map((genre) =>
          axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&with_genres=${genre.id}&language=en-US&page=1`
          )
        );

        const genreMoviesResponses = await Promise.all(genreMoviesPromises);

        // ItCombines all movies fetched and limit to 10 movies per genre
        const combinedMovies = genreMoviesResponses.flatMap(
          (response, index) => {
            const genreName = filteredGenres[index].name;
            return response.data.results.slice(0, 10).map((movie) => ({
              ...movie,
              genreName,
            }));
          }
        );

        // Remove duplicate movies
        const uniqueMovies = combinedMovies.filter(
          (movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );

        setMovies(uniqueMovies);
        setFilteredMovies(uniqueMovies);
      } catch (err) {
        console.error("Error fetching movies by genre:", err);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, []);

  // Filter movies based on the selected genre
  const filterByGenre = (genreName) => {
    setActiveGenre(genreName);
    setSearchQuery("");
    if (genreName === "All") {
      setFilteredMovies(movies);
    } else {
      const genreId = genres.find((g) => g.name === genreName)?.id;
      if (genreId) {
        const filtered = movies.filter((movie) =>
          movie.genre_ids.includes(genreId)
        );
        setFilteredMovies(filtered);
      }
    }
  };

  // Search movies by title
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredMovies(filtered);
    if (filtered.length === 0) {
      setError("No movies found for your search.");
    } else {
      setError("");
    }
  };

  const toggleGenres = () => {
    setShowGenres((prev) => !prev);
  };

  return (
    <div className="App">
      <Header />
      <SearchBar onSearch={handleSearch} setSearchQuery={setSearchQuery} />

      <button className="toggle-genres-button" onClick={toggleGenres}>
        {showGenres ? "Hide Genres" : "Show Genres"}
      </button>

      <div className={`genres ${showGenres ? "visible" : ""}`}>
        {genres.map((genre) => (
          <button
            key={genre.id}
            className={`genre-button ${
              activeGenre === genre.name ? "active" : ""
            }`}
            onClick={() => filterByGenre(genre.name)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading">Loading movies...</div>}

      {filteredMovies.length > 0 && searchQuery && (
        <div className="search-results">
          <h2>Search Results for "{searchQuery}"</h2>
          <div className="search-result-list">
           
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="search-result-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                />
                <div className="search-result-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-rating">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="movie-release-date">
                    Release Date:{" "}
                    {movie.release_date ? movie.release_date : "Not Available"}
                  </p>
                  <div className="movie-desc">
                    {movie.overview || "No description available."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && filteredMovies.length > 0 && (
        <div className="movie-list">
          {filteredMovies.map((movie) => (
            <Card key={movie.id} movie={movie} genres={genres} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
