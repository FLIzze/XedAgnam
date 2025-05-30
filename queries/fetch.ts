import { ChapterInfo, FeedData, HomeMangaResponse, Manga, PageResponse } from "@/interface";
import { Filter } from "@/types";
import { useQuery } from "@tanstack/react-query";

const apiUrl = "https://api.mangadex.org";
const uploadApiUrl = "https://uploads.mangadex.org";
const contentRating = ["safe", "suggestive"];
const languages = ["en"];

async function fetchByType(type: Filter, index: number): Promise<HomeMangaResponse> {
    try {
        let url = `${apiUrl}/manga?order[${type}]=desc`;

        url = addContentRating(url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching by ${type}`);
        }

        const jsonData = await response.json();

        const manga: Manga = jsonData.data[index];
        const titleObj = manga.attributes.title;
        const title: string = String(Object.entries(titleObj)[0][1]);
        const coverUrl = await fetchCoverByManga(manga);

        const cover = {
            coverUrl,
            id: manga.id,
            title,
        };

        return cover;
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

async function fetchPageByChapter(chapterInfo: ChapterInfo, index: number): Promise<string> {
    try {
        const response = await fetch(
            `${uploadApiUrl}/data-saver/${chapterInfo.hash}/${chapterInfo.dataSaver[index]}`
        );
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

function addContentRating(url: string): string {
    contentRating.forEach((rating: string) => {
        url += `&contentRating[]=${rating}`;
    });

    return url;
}

export function useFetchByType(fetchType: Filter, index: number) {
    return useQuery({
        queryKey: ["mangas", fetchType, index],
        queryFn: async (): Promise<HomeMangaResponse> => {
            return fetchByType(fetchType, index);
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
        queryKey: ["cover", manga],
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

async function fetchMangaFeed(mangaId: string): Promise<FeedData[]> {
    const url = new URL(
        `${apiUrl}/manga/${mangaId}/feed?order[volume]=asc&order[chapter]=asc&limit=100`
    );
    languages.forEach(lang => url.searchParams.append("translatedLanguage[]", lang));

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error fetching manga feed.");
    }

    const data = await response.json();

    return data.data;
}

export function useFetchMangaFeed(mangaId: string) {
    return useQuery({
        queryKey: ["feed", mangaId],
        queryFn: () => fetchMangaFeed(mangaId),
    });
}

export function useFetchPageByChapter(chapterInfo: ChapterInfo, index: number) {
    return useQuery({
        queryKey: ["chapterPage", chapterInfo.hash, index],
        queryFn: () => fetchPageByChapter(chapterInfo, index),
    });
}
