import { Router } from 'express';
import spotifyAuth from './spotify/auth';
import spotifyPlaylist from './spotify/playlist';
import spotifyTracks from './spotify/tracks';

const router = Router();

router.use(spotifyAuth);
router.use(spotifyPlaylist);
router.use(spotifyTracks);

export default router;
