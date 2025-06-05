import { Author, FeedData, Manga, PageResponse } from "@/interface";
import { Filter } from "@/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const apiUrl = "https://api.mangadex.org";
const uploadApiUrl = "https://uploads.mangadex.org";
const contentRating = ["safe", "suggestive"];
const lang = "en";

async function fetchByType(type: Filter): Promise<Manga[]> {
    try {
        let url = new URL(
            `${apiUrl}/manga?order[${type}]=desc&hasAvailableChapters=1&availableTranslatedLanguage[]=${lang}&limit=10`
        );
        contentRating.forEach(rating => url.searchParams.append("contentRating[]", rating));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching by ${type}`);
        }

        const mangaList = await response.json();
        return mangaList.data;
    } catch (error) {
        console.error(`fetchByType error:`, error);
        throw error;
    }
}

async function fetchMangaMetadataById(id: string): Promise<Manga> {
    try {
        const response = await fetch(`${apiUrl}/manga/${id}`);
        if (!response.ok) {
            throw new Error("Error fetching manga metadata");
        }

        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.error(`fetchMangaMetadataById error:`, error);
        throw error;
    }
}

async function fetchCoverByManga(manga: Manga): Promise<string> {
    try {
        const coverRelationShip = manga.relationships.find(el => el.type === "cover_art");
        const response = await fetch(`${apiUrl}/cover/${coverRelationShip?.id}`);
        if (!response.ok) {
            throw new Error("Error fetching cover data");
        }

        const data = await response.json();
        const fileName = data.data.attributes.fileName;

        const coverResponse = await fetch(`${uploadApiUrl}/covers/${manga.id}/${fileName}`);
        if (!coverResponse.ok) {
            throw new Error("Error fetching cover image");
        }

        return coverResponse.url;
    } catch (error) {
        console.error(`fetchCoverByManga error:`, error);
        throw error;
    }
}

async function fetchPageByChapter(pageUrl: string, hash: string): Promise<string> {
    try {
        const response = await fetch(`${uploadApiUrl}/data-saver/${hash}/${pageUrl}`);
        if (!response.ok) {
            throw new Error("Error fetching chapter page");
        }

        return response.url;
    } catch (error) {
        console.error(`fetchPageByChapter error:`, error);
        throw error;
    }
}

async function fetchPageResponse(id: string): Promise<PageResponse> {
    try {
        const response = await fetch(`${apiUrl}/at-home/server/${id}`);
        if (!response.ok) {
            throw new Error("Error fetching page response");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`fetchPageResponse error:`, error);
        throw error;
    }
}

export function useFetchByType(fetchType: Filter) {
    return useQuery({
        queryKey: ["mangas", fetchType],
        queryFn: async (): Promise<Manga[]> => {
            return fetchByType(fetchType);
        },
    });
}

export function useFetchMangaMetadataById(id: string) {
    return useQuery({
        queryKey: ["mangaId", id],
        queryFn: async (): Promise<Manga> => {
            return fetchMangaMetadataById(id);
        },
    });
}

export function useFetchCoverByManga(manga: Manga) {
    return useQuery({
        queryKey: ["cover", manga.id],
        queryFn: async (): Promise<string> => {
            return fetchCoverByManga(manga);
        },
    });
}

export function useFetchPageResponse(id: string) {
    return useQuery({
        queryKey: ["server", id],
        queryFn: async (): Promise<PageResponse> => {
            return fetchPageResponse(id);
        },
    });
}

export async function fetchMangaFeed(
    mangaId: string,
    offset: number,
    limit: number
): Promise<FeedData[]> {
    try {
        const url = new URL(
            `${apiUrl}/manga/${mangaId}/feed?order[volume]=asc&order[chapter]=asc&limit=${limit}&includeExternalUrl=0&offset=${offset}`
        );
        url.searchParams.append("translatedLanguage[]", lang);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error fetching manga feed.");
        }

        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error(`fetchMangaFeed error:`, error);
        throw error;
    }
}

export function useFetchMangaFeed(mangaId: string, limit: number) {
    return useInfiniteQuery({
        queryKey: ["feed", mangaId],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = pageParam;

            const chapters = await fetchMangaFeed(mangaId, offset, limit);
            return chapters;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === limit ? allPages.length * limit : undefined,
    });
}

export function useFetchPage(pageUrl: string, hash: string) {
    return useQuery({
        queryKey: ["chapterPage", pageUrl],
        queryFn: () => fetchPageByChapter(pageUrl, hash),
    });
}

export function useFetchAuthor(authorId: string) {
    return useQuery({
        queryKey: ["authorId", authorId],
        queryFn: () => fetchAuthor(authorId),
    });
}

async function fetchAuthor(authorId: string): Promise<Author> {
    try {
        const response = await fetch(`${apiUrl}/author/${authorId}`);

        if (!response.ok) {
            throw new Error(`Error fetching author`);
        }

        const data = await response.json();
        const author: Author = data.data;

        return author;
    } catch (error) {
        console.error(`fetchByType error:`, error);
        throw error;
    }
}
