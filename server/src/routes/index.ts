import { Router } from 'express';
import spotifyAuth from './spotify/auth';
import spotifyPlaylist from './spotify/playlist';

const router = Router();

router.use(spotifyAuth);
router.use(spotifyPlaylist);

export default router;
