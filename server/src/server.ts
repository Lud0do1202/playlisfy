import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { env } from "process";
import { CyaniteRefreshTokenGenerateResponse, CyaniteToken, CyaniteAccessTokenGenerateResponse } from "./types";

/* -------------------------------------------------------------------------- */
/*                                 Environment                                */
/* -------------------------------------------------------------------------- */
dotenv.config();

/* -------------------------------------------------------------------------- */
/*                              App Configuration                             */
/* -------------------------------------------------------------------------- */
const app = express();
app.use(express.json());
app.use(cors());

/* -------------------------------------------------------------------------- */
/*                                     GET                                    */
/* -------------------------------------------------------------------------- */
/* ------------------------------- Hello Word ------------------------------- */
app.get("/", async (req, res) => {
    res.send({ message: "Hello Word!" });
});

/* -------------------------------------------------------------------------- */
/*                                   CYANITE                                  */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- Login --------------------------------- */
app.post("/cyanite/login", async (req, res) => {
    // Headers
    const headers = { "Content-Type": "application/json" };

    // ---------- Refresh Token Generate ---------- //
    const body = {
        operationName: "refreshTokenGenerate",
        variables: {
            data: {
                loginOrEmail: env.CYANITE_EMAIL,
                password: env.CYANITE_PASSWORD,
            },
        },
        query: "mutation refreshTokenGenerate($data: RefreshTokenRequestInput!) {\n  refreshTokenRequest(data: $data) {\n    id\n    refreshToken\n    __typename\n  }\n}\n",
    };
    const response = await axios.post<CyaniteRefreshTokenGenerateResponse>(env.CYANITE_API as string, body, {
        headers,
    });

    // Refresh Token
    const refreshToken = response.data.data.refreshTokenRequest.refreshToken;

    // ---------- Access Token Generate ---------- //
    const url = (env.SERVER as string) + "/cyanite/refresh-token";
    const token = await axios.post<CyaniteToken>(url, { refreshToken }, { headers });

    // Response
    res.send(token.data);
});

/* ------------------------------ Refresh Token ----------------------------- */
app.post("/cyanite/refresh-token", async (req, res) => {
    // Headers
    const headers = { "Content-Type": "application/json" };

    // Body
    const refreshToken = req.body.refreshToken;
    const body = {
        operationName: "accessTokenGenerate",
        variables: { data: { refreshToken } },
        query: "mutation accessTokenGenerate($data: AccessTokenGenerateInput!) {\n  accessTokenGenerate(data: $data) {\n    accessToken\n    user {\n      id\n      login\n      email\n      __typename\n    }\n    __typename\n  }\n}\n",
    };

    // Call
    const response = await axios.post<CyaniteAccessTokenGenerateResponse>(env.CYANITE_API as string, body, { headers });

    // Response
    const accessToken = response.data.data.accessTokenGenerate.accessToken;

    // Iat utc
    const iat = new Date();
    const exp = new Date(iat.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const token: CyaniteToken = { accessToken, refreshToken, iat: iat.toISOString(), exp: exp.toISOString() };

    res.send(token);
});

/* ---------------------------------- Track --------------------------------- */
app.get("/cyanite/track", async (req, res) => {
    res.sendStatus(200);
});

/* -------------------------------------------------------------------------- */
/*                                   OPEN AI                                  */
/* -------------------------------------------------------------------------- */
/* ------------------------------- Sort Track ------------------------------- */
app.post("/openai/sort-tracks", async (req, res) => {
    res.sendStatus(200);
});

/* -------------------------------------------------------------------------- */
/*                                   Listen                                   */
/* -------------------------------------------------------------------------- */
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}...`);
});
