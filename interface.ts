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

interface Lang {
    en: string;
}

interface Attributes {
    title: Lang;
    altTitles: Lang[];
    description: Lang;
    lastVolume: string;
    lastChapter: string;
    publicationDemographic: string;
    status: string;
    year: number;
    tags: Tags[];
    availableTranslatedLanguages: string[];
    originalLanguage: string;
}

interface Tags {
    id: string;
    attributes: TagAttributes;
}

interface TagAttributes {
    name: Langs;
}

interface Langs {
    en: string;
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

export interface Author {
    id: string;
    attributes: AuthorAttributes;
}

interface AuthorAttributes {
    name: string;
    imaUrl: string;
    twitter: string;
    pixiv: string;
    melonBook: string;
    fanBox: string;
    booth: string;
    nicoVideo: string;
    skeb: string;
    fantia: string;
    tumblr: string;
    youtube: string;
    weibo: string;
    naver: string;
    namicomi: string;
    website: string;
    version: string;
    createdAt: string;
    updatedAt: string;
}
