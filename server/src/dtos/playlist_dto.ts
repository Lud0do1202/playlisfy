export interface PlaylistCreateDto {
    name: string;
    description?: string;
    userId: number;
    userSpotifyId: string;
    spotifyAccessToken: string;
}
