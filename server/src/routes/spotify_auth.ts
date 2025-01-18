import { Router, Request, Response } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { generateRandomString } from '../utils/string';
import { DB } from '../models/database';
import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

const router = Router();
const expressCallback = process.env.EXPRESS_URL + '/auth/spotify/callback';
const frontCallback = process.env.FRONT_AUTH_CALLBACK;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

/* --------------------------------- SPOTIFY -------------------------------- */
router.get('/auth/spotify', (req: Request, res: Response) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    res.redirect(
        'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: scope,
                redirect_uri: expressCallback,
                state: state,
            }),
    );
});

/* ------------------------------- CREDENTIALS ------------------------------ */
router.get('/auth/spotify/callback', async (req: Request, res: Response) => {
    // Get parameters
    const code = req.query.code || null;
    const state = req.query.state || null;
    const error = req.query.error || null;

    // Error
    if (!state || !code || error) {
        res.redirect(frontCallback + querystring.stringify({ error: 'state_mismatch' }));
        return;
    }

    // Ask for access token
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = {
        code: code,
        redirect_uri: expressCallback,
        grant_type: 'authorization_code',
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
    };

    try {
        // Ask credentials
        const tokenResponse = await axios.post(tokenUrl, body, { headers });
        const { access_token, refresh_token } = tokenResponse.data;

        // Get spotify user profile
        const profileUrl = 'https://api.spotify.com/v1/me';
        const profileResponse = await axios.get(profileUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        // Create user if not exists
        const { email, id: spotifyId } = profileResponse.data;
        const exists = await DB.User.getBySpotifyId(spotifyId);
        if (!exists) {
            await DB.User.create({ email, spotifyId });
        }

        // Redirection
        res.redirect(
            frontCallback +
                querystring.stringify({
                    access_token,
                    refresh_token,
                }),
        );
    } catch (__error) {
        res.redirect(frontCallback + querystring.stringify({ error: 'invalid_token' }));
    }
});

/* ------------------------------ REFRESH TOKEN ----------------------------- */
router.get('/auth/spotify/refresh_token', async (req: Request, res: Response) => {
    const refresh_token = req.query.refresh_token;
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
    };
    const body = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
    };

    try {
        // Ask credentials
        const tokenResponse = await axios.post(tokenUrl, body, { headers });
        const { access_token, refresh_token } = tokenResponse.data;

        // Redirection
        res.redirect(
            frontCallback +
                querystring.stringify({
                    access_token,
                    refresh_token,
                }),
        );
    } catch (__error) {
        res.redirect(frontCallback + querystring.stringify({ error: 'invalid_token' }));
    }
});

export default router;
