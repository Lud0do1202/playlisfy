import { Router, Request, Response } from 'express';
import querystring from 'querystring';
import axios from 'axios';
import { generateRandomString } from '../../utils/string';
import { DB } from '../../models/database';
import dotenv from 'dotenv';
import { UserCreateDto } from '../../dtos/user_dto';
dotenv.config({ path: './environments/.env' });

const router = Router();
const expressCallback = process.env.EXPRESS_URL + '/auth/spotify/callback';
const frontCallback = process.env.FRONT_AUTH_CALLBACK;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

/* --------------------------------- SPOTIFY -------------------------------- */
router.get('/auth/spotify', (req: Request, res: Response) => {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

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
        const user: UserCreateDto = {
            email: profileResponse.data.email,
            spotifyId: profileResponse.data.id,
            spotifyAccessToken: access_token,
            spotifyRefreshToken: refresh_token,
        };
        const exists = await DB.User.getBySpotifyId(user.spotifyId);
        if (!exists) {
            await DB.User.create(user);
        }

        // Redirection
        res.redirect(
            frontCallback +
                '?' +
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
router.get('/auth/spotify/refresh', async (req: Request, res: Response) => {
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
                '?' +
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

const query: any = '';
const spotify_service: any = '';
const nav : any = '';

const init = async () => {
    // Auth from spotify
    if (query.auth_request === 'spotify') {
        localStorage.setItem('spotify_access_token', query.access_token);
        localStorage.setItem('spotify_, query.refresh_token);
        localStorage.setItem('spotify_expires_at'refresh_token', query.expires_at);
    }

    // Auth from cyanite
    else if (query.auth_request === 'cyanite') {
        localStorage.setItem('cyanite_access_token', query.access_token);
        localStorage.setItem('cyanite_refresh_token', query.refresh_token);
        localStorage.setItem('spotify_expires_at', query.expires_at);
    }

    // Auth Spotify
    if (!localStorage.getItem('spotify_access_token') || !localStorage.getItem('spotify_refresh_token')) {
        await axios.get(process.env.SERVER_URL + '/auth/spotify');
        return;
    }

    // Refresh Spotify
    const now = Date.now();
    const nowMinus15min = now - 15 * 60 * 1000;
    if (nowMinus15min > (Number(localStorage.getItem('spotify_expires_at')) || 0)) {
        await axios.get(
            process.env.SERVER_URL +
                '/auth/spotify/refresh?refresh_token=' +
                localStorage.getItem('spotify_refresh_token'),
        );
        return;
    }

    // Auth Cyanite
    if (!localStorage.getItem('cyanite_access_token') || !localStorage.getItem('cyanite_refresh_token')) {
        await axios.get(process.env.SERVER_URL + '/auth/cyanite');
        return;
    }

    // Refresh Cyanite
    if (nowMinus15min > (Number(localStorage.getItem('cyanite_expires_at')) || 0)) {
        await axios.get(
            process.env.SERVER_URL +
                '/auth/cyanite/refresh?refresh_token=' +
                localStorage.getItem('cyanite_refresh_token'),
        );
        return;
    }

    // Redirect home
    nav.redirect('/home');
};
