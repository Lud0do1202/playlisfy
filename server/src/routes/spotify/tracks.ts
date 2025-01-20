import { Router, Request, Response } from 'express';
import { DB } from '../../models/database';
import dotenv from 'dotenv';
import { TrackCreateDto } from '../../dtos/track_dto';
dotenv.config({ path: './environments/.env' });

const router = Router();

/* --------------------------------- TRACKS --------------------------------- */
router.post('/tracks', async (req: Request, res: Response) => {
    const checkBadRequest = (track: TrackCreateDto | undefined) => {
        if (!track) {
            return 'Body is required';
        }
        if (!track.spotifyId) {
            return '"spotifyId" is required';
        }
        if (typeof track.spotifyId !== 'string') {
            return '"spotifyId" must be a string';
        }
        if (!track.name) {
            return '"name" is required';
        }
        if (typeof track.name !== 'string') {
            return '"name" must be a string';
        }
        if (!track.artists) {
            return '"artists" is required';
        }
        if (typeof track.artists !== 'string') {
            return '"artists" must be a string';
        }
        if (!track.duration) {
            return '"duration" is required';
        }
        if (typeof track.duration !== 'number') {
            return '"duration" must be a number';
        }
        if (track.description && typeof track.description !== 'string') {
            return '"description" must be a string or undefined';
        }
        if (track.instruments && typeof track.instruments !== 'string') {
            return '"instruments" must be a string or undefined';
        }
        if (track.genres && typeof track.genres !== 'string') {
            return '"genres" must be a string or undefined';
        }
        if (track.keywords && typeof track.keywords !== 'string') {
            return '"keywords" must be a string or undefined';
        }
        if (track.voices && typeof track.voices !== 'string') {
            return '"voices" must be a string or undefined';
        }
        if (track.bpm && typeof track.bpm !== 'number') {
            return '"bpm" must be a number or undefined';
        }
        if (track.moods && typeof track.moods !== 'string') {
            return '"moods" must be a string or undefined';
        }
        if (track.movements && typeof track.movements !== 'string') {
            return '"movements" must be a string or undefined';
        }
        if (track.characters && typeof track.characters !== 'string') {
            return '"characters" must be a string or undefined';
        }
        return null;
    };

    try {
        // Get parameters
        const track: TrackCreateDto | undefined = req.body;
        const badRequest = checkBadRequest(track);
        if (badRequest) {
            res.status(400).json({ error: badRequest });
            return;
        }

        // Create playlist
        await DB.Track.create(track!);

        // Success
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});

export default router;
