import React from "react";

const Card = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={`${movie.title} poster`}
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
        <p className="movie-description">
          {movie.overview.length > 150
            ? `${movie.overview.substring(0, 150)}...`
            : movie.overview}
        </p>
      </div>
    </div>
  );
};

export default Card;
