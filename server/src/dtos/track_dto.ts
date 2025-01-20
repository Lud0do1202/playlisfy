export interface TrackCreateDto {
    spotifyId: string;
    uri: string;
    name: string;
    artists: string;
    duration: number;
    description?: string;
    instruments?: string;
    genres?: string;
    keywords?: string;
    voices?: string;
    bpm?: number;
    moods?: string;
    movements?: string;
    characters?: string;
}
