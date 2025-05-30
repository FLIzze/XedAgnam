export interface Cover {
    id: string;
    relationships: Relationships;
    attributes: CoverAttributes;
}

export interface CoverResponse {
    url: string;
}

export interface Manga {
    id: string;
    type: string;
    attributes: Attributes;
    relationships: Relationships[];
}

interface CoverAttributes {
    volume: string;
    fileName: string;
}

interface Description {
    en: string;
}

interface Attributes {
    title: string;
    description: Description;
    lastVolume: string;
    lastChapter: string;
    publicationDemographic: string;
    status: string;
    year: number;
}

interface Relationships {
    id: string;
    type: string;
}

export interface HomeMangaResponse {
    id: string;
    title: string;
    coverUrl: string;
}

export interface PageResponse {
    baseUrl: string;
    chapter: ChapterInfo;
}

export interface ChapterInfo {
    hash: string;
    data: string[];
    dataSaver: string[];
}

export interface FeedData {
    id: string;
    type: string;
    attributes: FeedAttribute;
}

interface FeedAttribute {
    chapter: string;
    volume: string;
    pages: number;
    translatedLanguage: string;
    title: string;
}

export interface Translation {
    title: string;
    lang: string;
    id: string;
}
