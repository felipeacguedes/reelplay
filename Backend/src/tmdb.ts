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
    minVotes?: string;
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


export async function getRandomMovie(filters: MovieFilters): Promise<Movie> {
    const params: Record<string, string> = {
        sort_by: "popularity.desc",
        include_adult: "false",
        include_video: "false",
        language: filters.language ?? "pt-BR",
        page: "1",
    };

    if (filters.genres) params["with_genres"] = filters.genres;
    if (filters.yearFrom) params["primary_release_date.gte"] = `${filters.yearFrom}-01-01`;
    if (filters.yearTo) params["primary_release_date.lte"] = `${filters.yearTo}-12-31`;
    if (filters.minRating) params["vote_average.gte"] = filters.minRating;
    params["vote_count.gte"] = filters.minVotes ?? "100";

    // primeiro, fazemos uma requisição para obter o número total de páginas disponíveis com os filtros aplicados
    
    const firstResponse = await tmdbClient.get<{ total_pages: number; results: Movie[] }>(
        "/discover/movie",
        { params }
    );

    const totalPages = Math.min(firstResponse.data.total_pages, 500);

    if (totalPages === 0) {
        throw new Error("Nenhum filme encontrado com os filtros fornecidos.");
    }

    // depois, sorteamos uma página aleatória

    const randomPage = Math.floor(Math.random() * totalPages) + 1;
    let results: Movie[];
    if(randomPage === 1) {
        results = firstResponse.data.results;
    } else {
        const pageResponse = await tmdbClient.get<{ results: Movie[] }>("/discover/movie", { 
            params: { ...params, page: String(randomPage) }, });
            results = pageResponse.data.results;
    }

    if (results.length === 0) {
        throw new Error("Página retornou sem resultados.");
    }

    // por fim, sorteamos um filme da página

    const randomIndex = Math.floor(Math.random() * results.length);
    const movie = results[randomIndex];

    if (!movie) {
        throw new Error("Nenhum filme encontrado na página sorteada.");
    }

    return movie;
}
