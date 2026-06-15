import axios from "axios"

const BASE_URL = "https://api.themoviedb.org/3"

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        "Content-Type": "application/json",
    }
});

export interface MovieFilters {
    genres?: string;
    yearFrom?: string;
    yearTo?: string;
    minRating?: string;
    maxRating?: string;
    language?: string;
}

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
}
