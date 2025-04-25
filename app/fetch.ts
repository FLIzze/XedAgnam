const contentRating = ["safe", "suggestive"];
const limit = 10;
const apiUrl = "https://api.mangadex.org";
const uploadApiUrl = "https://uploads.mangadex.org";

export enum FetchType {
        FollowedCount = "followedCount",
        LatestUploadedChapter = "latestUploadedChapter",
        Relevance = "relevance",
}

interface Cover {
        id: string,
        relationships: Relationships,
        attributes: CoverAttributes,
}

interface CoverResponse {
        url: string,
}

interface Manga {
        id: string,
        type: string,
        attributes: Attributes,
        relationships: Relationships[],
}

interface CoverAttributes {
        volume: string,
        fileName: string,
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
        let url = `${apiUrl}/manga?order[${fetchType}]=desc`;

        url = addContentRating(url);
        url = addLimit(url);

        const response = await fetch(url);
        if (!response.ok) {
                throw new Error(`Error fetching by ${fetchType}`);
        }

        const jsonData = await response.json();
        const covers: string[] = [];

        for (let i = 0; i < limit; i++) {
                const manga: Manga = jsonData.data[i];
                const coverUrl = await fetchCoverById(manga);
                covers.push(coverUrl);
        }

        console.log(covers);
}

async function fetchCoverById(manga: Manga): Promise<string> {
        const coverRelationShip = manga.relationships.find(el => el.type === "cover_art");

        const response = await fetch(`${apiUrl}/cover/${coverRelationShip?.id}`);
        if (!response.ok) {
                console.log("Error fetching cover");
                return '';
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
