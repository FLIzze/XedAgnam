export interface Cover {
        id: string,
        relationships: Relationships,
        attributes: CoverAttributes,
}

export interface CoverResponse {
        url: string,
}

// wtf mangadex
export interface VolumesResponse {
        volumes: Record<string, Volume>, 
}

export interface Volume {
        volume: string,
        count: number,
        chapters: Record<string, Chapter>, 
}

export interface Chapter {
        chapter: number,
        id: number,
}

export interface Manga {
        id: string,
        type: string,
        attributes: Attributes,
        relationships: Relationships[],
}

interface CoverAttributes {
        volume: string,
        fileName: string,
}

interface Description {
        en: string,
}

interface Attributes {
        title: {},
        description: Description,
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

export interface HomeMangaResponse {
        id: string,
        title: string,
        coverUrl: string,
}
