export interface UserCreateDto {
    spotifyId: string;
    email: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
}
