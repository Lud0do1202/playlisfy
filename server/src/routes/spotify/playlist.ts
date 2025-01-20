import { Router, Request, Response } from 'express';
import { DB } from '../../models/database';
import dotenv from 'dotenv';
import { PlaylistCreateDto } from '../../dtos/playlist_dto';
dotenv.config({ path: './environments/.env' });

const router = Router();

/* --------------------------------- CREATE --------------------------------- */
router.post('/playlists', async (req: Request, res: Response) => {
    const checkBadRequest = (playlist: PlaylistCreateDto | undefined) => {
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
    };

    try {
        // Get parameters
        const playlist: PlaylistCreateDto | undefined = req.body;
        const badRequest = checkBadRequest(playlist);
        if (badRequest) {
            res.status(400).json({ error: badRequest });
            return;
        }

        // Create playlist
        await DB.Playlist.create(playlist!);

        // Success
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error });
    }
});

/* ------------------------------- ADD TRACKS ------------------------------- */
router.post('/playlists/:id/tracks', async (req: Request, res: Response) => {
    const checkBadRequest = (trackIds: number[] | undefined) => {
        if (!trackIds) {
            return '"trackIds" is required';
        }
        if (!Array.isArray(trackIds) || trackIds.some((trackId: number) => typeof trackId !== 'number')) {
            return "'trackIds' must be an array of numbers";
        }
        return null;
    };

    try {
        // Get parameters
        const playlistId = parseInt(req.params.id);
        const trackIds: number[] = req.body;

        // Bad request
        const badRequest = checkBadRequest(trackIds);
        if (badRequest) {
            res.status(400).json({ error: badRequest });
            return;
        }

        // Add tracks
        await DB.Playlist.addTracks(playlistId, trackIds);

        // Success
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
