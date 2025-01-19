import { Router, Request, Response } from 'express';
import { DB } from '../../models/database';
import dotenv from 'dotenv';
import { PlaylistCreateDto } from '../../dtos/playlist_dto';
dotenv.config({ path: './environments/.env' });

const router = Router();

/* ------------------------------- BAD REQUEST ------------------------------ */
const badRequestPlaylistCreateDto = (playlist: PlaylistCreateDto | undefined) => {
    if (!playlist) {
        return 'Body is required';
    }
    if (!playlist.name) {
        return '"name" is required';
    }
    if (typeof playlist.name !== 'string') {
        return '"name" must be a string';
    }
    if (playlist.description && typeof playlist.description !== 'string') {
        return '"description" must be a string or undefined';
    }
    if (!playlist.userId) {
        return '"userId" is required';
    }
    if (typeof playlist.userId !== 'number') {
        return '"userId" must be a number';
    }
    if (!playlist.userSpotifyId) {
        return '"userSpotifyId" is required';
    }
    if (typeof playlist.userSpotifyId !== 'string') {
        return '"userSpotifyId" must be a string';
    }
    if (!playlist.spotifyAccessToken) {
        return '"spotifyAccessToken" is required';
    }
    if (typeof playlist.spotifyAccessToken !== 'string') {
        return '"spotifyAccessToken" must be a string';
    }
    return null;
}

/* --------------------------------- SPOTIFY -------------------------------- */
router.post('/playlist', async (req: Request, res: Response) => {
    try {
        // Get parameters
        const playlist: PlaylistCreateDto | undefined = req.body;
        const badRequest = badRequestPlaylistCreateDto(playlist);
        if (badRequest) {
            res.status(400).json({ error: badRequest });
            return;
        }

        // Create playlist
        const success = await DB.Playlist.create(playlist!)
        if (!success) {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Success
        res.status(201).json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
