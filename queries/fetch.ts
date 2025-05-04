import { useQuery } from "@tanstack/react-query";

const apiUrl = "https://api.mangadex.org";
const uploadApiUrl = "https://uploads.mangadex.org";
const contentRating = ["safe", "suggestive"];
const limit = 10;

export async function fetchByType(fetchType: "followedCount" | "latestUploadedChapter" | "relevance"): Promise<HomeMangaResponse[]> {
        let url = `${apiUrl}/manga?order[${fetchType}]=desc`;

        url = addContentRating(url);
        url = addLimit(url);

        const response = await fetch(url);
        if (!response.ok) {
                throw new Error(`Error fetching by ${fetchType}`);
        }

        const jsonData = await response.json();
        const covers: HomeMangaResponse[] = [];

        for (let i = 0; i < limit; i++) {
                const manga: Manga = jsonData.data[i];
                const titleObj = manga.attributes.title
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

export async function fetchMangaById(id: string): Promise<Manga> {
        const response = await fetch(`${apiUrl}/manga/${id}`);
        if (!response.ok) {
                throw new Error("Error fetching cover");
        }

        const jsonData = await response.json();
        const manga: Manga = jsonData.data;

        return manga;
}

export async function fetchCoverByManga(manga: Manga): Promise<string> {
        const coverRelationShip = manga.relationships.find(el => el.type === "cover_art");
        const response = await fetch(`${apiUrl}/cover/${coverRelationShip?.id}`);
        if (!response.ok) {
                throw new Error("Error fetching cover");
        }

        const jsonData = await response.json();
        const cover: Cover = jsonData.data;
        const fileName = cover.attributes.fileName;

        const cover_response: CoverResponse = await fetch(`${uploadApiUrl}/covers/${manga.id}/${fileName}`);
        return cover_response.url
}

function addContentRating(url: string): string {
        contentRating.forEach((rating: string) => {
                url += `&contentRating[]=${rating}`;
        })

        return url;
}

function addLimit(url: string): string {
        return url + `&limit=${limit}`;
}

export function useFetchByType(fetchType: "followedCount" | "latestUploadedChapter" | "relevance") {
        return useQuery({
               queryKey: ["mangas"],
                queryFn: async (): Promise<HomeMangaResponse[]> => {
                        return fetchByType(fetchType);
                },
        })
}

export function useFetchMangaById(id: string) {
        return useQuery({
                queryKey: ["mangaIndex", id],
                queryFn: async (): Promise<Manga> => {
                        return fetchMangaById(id);
                },
        })
}

export function useFetchCoverByManga(manga: Manga) {
        return useQuery({
                queryKey: ["cover", manga],
                queryFn: async (): Promise<string> => {
                        return fetchCoverByManga(manga);
                },
        })
}
