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
const cyaniteApi = process.env.CYANITE_API || '';
const cyaniteEmail = process.env.CYANITE_EMAIL;
const cyanitePassword = process.env.CYANITE_PASSWORD;
const cyaniteRefreshTokenUrl = process.env.EXPRESS_URL + '/cyanite/refresh-token';

/* ---------------------------------- LOGIN --------------------------------- */
router.get('/auth/cyanite', async (req: Request, res: Response) => {
    // Headers
    const headers = { 'Content-Type': 'application/json' };

    // ---------- Refresh Token Generate ---------- //
    const body = {
        operationName: 'refreshTokenGenerate',
        variables: {
            data: {
                loginOrEmail: cyaniteEmail,
                password: cyanitePassword,
            },
        },
        query: 'mutation refreshTokenGenerate($data: RefreshTokenRequestInput!) {\n  refreshTokenRequest(data: $data) {\n    id\n    refreshToken\n    __typename\n  }\n}\n',
    };
    const response = await axios.post(cyaniteApi, body, { headers });

    // Refresh Token
    const refreshToken = response.data.data.refreshTokenRequest.refreshToken;

    // ---------- Access Token Generate ---------- //
    const token = await axios.post(cyaniteRefreshTokenUrl, { refreshToken }, { headers });

    // Response
    res.send(token.data);
});

router.get('/auth/cyanite/refresh_token', async (req: Request, res: Response) => {
    // Headers
    const headers = { "Content-Type": "application/json" };

    // Body
    const refreshToken = req.query.refreshToken;
    const body = {
        operationName: "accessTokenGenerate",
        variables: { data: { refreshToken } },
        query: "mutation accessTokenGenerate($data: AccessTokenGenerateInput!) {\n  accessTokenGenerate(data: $data) {\n    accessToken\n    user {\n      id\n      login\n      email\n      __typename\n    }\n    __typename\n  }\n}\n",
    };

    // Call
    const response = await axios.post(cyaniteApi, body, { headers });

    // Response
    const accessToken = response.data.data.accessTokenGenerate.accessToken;

    // Iat utc
    const token = { accessToken, refreshToken };

    res.send(token);
});

export default router;