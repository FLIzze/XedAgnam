const contentRating = ["safe", "suggestive"];
const limit = 10;

export enum FetchType {
        FollowedCount = "followedCount",
        LatestUploadedChapter = "latestUploadedChapter",
        Relevance = "relevance",
}

interface Cover {
        id: string,
        relationships: Relationships,
}

interface Manga {
        id: string,
        type: string,
        attributes: Attributes,
        relationships: Relationships[],
}

interface Attributes {
        title: string[],
        description: string[],
        lastVolume: string,
        lastChapter: string,
        publicationDemographic: string,
        status: string,
        year: number,
}

interface Relationships {
        id: string,
        type: string,
}

export async function FetchBy(fetchType: FetchType) {
        let url = `https://api.mangadex.org/manga?order[${fetchType}]=desc`;

        url = addContentRating(url);
        url = addLimit(url);

        const response = await fetch(url);
        if (!response.ok) {
                throw new Error(`Error fetching by ${fetchType}`);
        }

        const jsonData = await response.json();

        for (let i = 0; i < limit; i++) {
                const manga: Manga = jsonData.data[i];
                FetchCoverById(manga);
        }
}

export async function FetchCoverById(manga: Manga) {
        console.log(manga);
        console.log(manga.relationships[2].id);

        try {
                const jsonData = await fetch(`https://api.mangadex.org/cover/${manga.relationships[2].id}`);
        } catch {
                console.log("Error fetching cover.");
        }

        // const cover: Manga = jsonData.data[0];
        console.log(jsonData.data);
        // const covertArt = json

        // response = await fetch(`https://uploads.mangadex.org/covers/${manga.id}/${}`);

        // https://api.mangadex.org/manga/:id-manga -> infos du manga + id cover_art
        // https://api.mangadex.org/cover/:id-cover_art -> filename cover_art
        // https://uploads.mangadex.org/covers/:id-manga/:filename-cover_art 
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
