import { Router } from 'express';
import spotifyAuth from './spotify_auth';

const router = Router();

router.use(spotifyAuth);

export default router;
