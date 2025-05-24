import {
    ChapterInfo,
    Cover,
    CoverResponse,
    FeedData,
    HomeMangaResponse,
    Manga,
    PageResponse,
} from "@/interface";
import { Filter } from "@/types";
import { useQuery } from "@tanstack/react-query";

const apiUrl = "https://api.mangadex.org";
const uploadApiUrl = "https://uploads.mangadex.org";
const contentRating = ["safe", "suggestive"];
const limit = 10;

async function fetchByType(type: Filter): Promise<HomeMangaResponse[]> {
    let url = `${apiUrl}/manga?order[${type}]=desc`;

    url = addContentRating(url);
    url = addLimit(url);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error fetching by ${type}`);
    }

    const jsonData = await response.json();
    const covers: HomeMangaResponse[] = [];

    for (let i = 0; i < limit; i++) {
        const manga: Manga = jsonData.data[i];
        const titleObj = manga.attributes.title;
        const title: string = String(Object.entries(titleObj)[0][1]);
        const coverUrl = await fetchCoverByManga(manga);

        const response: HomeMangaResponse = {
            coverUrl: coverUrl,
            id: manga.id,
            title: title,
        };
        covers.push(response);
    }

    return covers;
}

async function fetchMangaMetadataById(id: string): Promise<Manga> {
    const response = await fetch(`${apiUrl}/manga/${id}`);
    if (!response.ok) {
        throw new Error("Error fetching cover");
    }

    const data = await response.json();
    const manga: Manga = data.data;

    return manga;
}

async function fetchCoverByManga(manga: Manga): Promise<string> {
    const coverRelationShip = manga.relationships.find(el => el.type === "cover_art");
    const response = await fetch(`${apiUrl}/cover/${coverRelationShip?.id}`);
    if (!response.ok) {
        throw new Error("Error fetching cover");
    }

    const data = await response.json();
    const cover: Cover = data.data;
    const fileName = cover.attributes.fileName;

    const cover_response: CoverResponse = await fetch(
        `${uploadApiUrl}/covers/${manga.id}/${fileName}`
    );
    return cover_response.url;
}

async function fetchPageByChapter(chapterInfo: ChapterInfo, index: number): Promise<string> {
    const uploadResponse = await fetch(
        `${uploadApiUrl}/data/${chapterInfo.hash}/${chapterInfo.data[index]}`
    );
    if (!uploadResponse.ok) {
        throw new Error("Error fetching pages");
    }

    return uploadResponse.url;
}

async function fetchPageResponse(id: string): Promise<PageResponse> {
    const response = await fetch(`${apiUrl}/at-home/server/${id}`);
    if (!response.ok) {
        throw new Error("Error fetching at-home/server");
    }

    const data = await response.json();
    const pageResponse: PageResponse = data;

    return pageResponse;
}

function addContentRating(url: string): string {
    contentRating.forEach((rating: string) => {
        url += `&contentRating[]=${rating}`;
    });

    return url;
}

function addLimit(url: string): string {
    return url + `&limit=${limit}`;
}

export function useFetchByType(fetchType: "followedCount" | "latestUploadedChapter" | "relevance") {
    return useQuery({
        queryKey: ["mangas", fetchType],
        queryFn: async (): Promise<HomeMangaResponse[]> => {
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
    const response = await fetch(
        `${apiUrl}/manga/${mangaId}/feed?order[volume]=asc&order[chapter]=asc&limit=100`
    );
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
