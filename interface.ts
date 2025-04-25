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

interface HomeMangaResponse {
        id: string,
        title: string,
        coverUrl: string,
}
