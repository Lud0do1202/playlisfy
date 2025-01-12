import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios, { AxiosResponse } from "axios";
import { env } from "process";
import {
    CyaniteRefreshTokenGenerateResponse,
    CyaniteToken,
    CyaniteAccessTokenGenerateResponse,
    CyaniteTrackResponse,
    CyaniteTrack,
    CyaniteTrackAnalysis,
} from "./types";

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
app.post("/cyanite/tracks", async (req, res) => {
    // Headers
    const token = req.headers.authorization || "";
    const headers = {
        "Content-Type": "application/json",
        Authorization: token,
    };

    // Get ids
    const trackIds: string[] = req.body.ids || [];
    const delay =
        trackIds.length > 1000
            ? 25
            : trackIds.length > 500
            ? 60
            : trackIds.length > 250
            ? 90
            : trackIds.length > 100
            ? 120
            : trackIds.length > 50
            ? 150
            : trackIds.length > 25
            ? 200
            : trackIds.length > 10
            ? 350
            : 500;

    // Get all promise results
    const promiseResponses: { id: string; promise: Promise<AxiosResponse<CyaniteTrackResponse, any>> }[] = [];
    let count = 0;
    for (const trackId of trackIds) {
        console.log(++count, " --> ", trackId);
        // Body
        const body = {
            operationName: "SimilaritySearchTrack",
            variables: {
                id: trackId,
                tableViewMode: "standard",
                isCustomRange: false,
            },
            query: "query SimilaritySearchTrack($id: ID!, $isCustomRange: Boolean!, $tableViewMode: TrackTableViewMode!, $tableViewVersion: TrackTableViewVersion) {\n  track(id: $id) {\n    __typename\n    ... on Error {\n      message\n      __typename\n    }\n    ... on Track {\n      id\n      title\n      audioUrl\n      cover {\n        url\n        __typename\n      }\n      tableView(mode: $tableViewMode, version: $tableViewVersion) {\n        isLatestAnalysisVersion\n        latestAnalysisVersion\n        bpm\n        analysisStatus\n        timeSignature\n        key\n        instrumentTags\n        instrumentPresence {\n          label\n          type\n          value\n          __typename\n        }\n        advancedInstrumentTags\n        advancedInstrumentPresence {\n          label\n          type\n          value\n          __typename\n        }\n        predominantVoiceGender\n        voicePresenceProfile\n        subgenreTags\n        subgenreMean {\n          label\n          type\n          value\n          __typename\n        }\n        advancedSubgenreTags\n        advancedSubgenreMean {\n          label\n          type\n          value\n          __typename\n        }\n        moodTags\n        moodMean {\n          label\n          type\n          value\n          __typename\n        }\n        genreTags\n        genreMean {\n          label\n          type\n          value\n          __typename\n        }\n        advancedGenreTags\n        advancedGenreMean {\n          label\n          type\n          value\n          __typename\n        }\n        valenceMean\n        arousalMean\n        energyLevel\n        energyDynamics\n        emotionalProfile\n        emotionalDynamics\n        musicalEraTag\n        augmentedKeywords {\n          label\n          value\n          __typename\n        }\n        voiceTags\n        bpmRangeAdjusted\n        moodAdvancedTags\n        moodAdvancedMean {\n          label\n          type\n          value\n          __typename\n        }\n        movementTags\n        movementMean {\n          label\n          type\n          value\n          __typename\n        }\n        characterTags\n        characterMean {\n          label\n          type\n          value\n          __typename\n        }\n        classicalEpochTags\n        classicalEpochMean {\n          label\n          type\n          value\n          __typename\n        }\n        transformerCaption\n        freeGenreTags\n        analysisError\n        __typename\n      }\n      audioAnalysisV6 {\n        __typename\n        ... on AudioAnalysisV6Failed {\n          error {\n            message\n            __typename\n          }\n          __typename\n        }\n      }\n      __typename\n    }\n    ... on Track @include(if: $isCustomRange) {\n      audioDuration\n      waveformUrl\n      __typename\n    }\n  }\n}\n",
        };

        // Call
        const promiseResponse = axios.post<CyaniteTrackResponse>(env.CYANITE_API as string, body, { headers });
        promiseResponses.push({ id: trackId, promise: promiseResponse });

        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Get the results
    const responses = await Promise.all(
        promiseResponses.map(async (response) => {
            const result = await response.promise;
            return { id: response.id, data: result.data };
        })
    );
    const tracks: CyaniteTrack[] = [];

    // Iterate over the responses
    count = 0;
    const promisesAnalyse: { id: string; promise: Promise<AxiosResponse<CyaniteTrackAnalysis, any>> }[] = [];
    for (const response of responses) {
        const trackId = response.id;

        // ----> OVERLOAD <---- //
        if (response.data.data == null) {
            console.log(++count, " --> OVERLOAD: ", trackId);
            tracks.push({ id: trackId, success: false, error: "OVERLOAD" });
            continue;
        }

        // ----> SUCCESS <---- //
        if (response.data.data.track.tableView.analysisStatus === "FINISHED") {
            const { id, title, tableView } = response.data.data.track;
            const description = tableView.transformerCaption || "";

            console.log(++count, " --> SUCCESS: ", id);
            tracks.push({ id: trackId, title, description, success: true });
            continue;
        }

        // ----> ALREADY ENQUEUED <---- //
        if (response.data.data.track.tableView.analysisStatus === "ENQUEUED") {
            console.log(++count, " --> ALREADY ENQUEUED: ", trackId);
            tracks.push({ id: trackId, success: false, error: "ALREADY_ENQUEUED" });
            continue;
        }

        // Start analyse
        const promiseAnaylse = cyaniteAnalyseTrack(token, trackId);
        promisesAnalyse.push({ id: trackId, promise: promiseAnaylse });
    }

    // Wait for all the tracks to be analysed
    const analysis = await Promise.all(
        promisesAnalyse.map(async (response) => {
            const result = await response.promise;
            return { id: response.id, data: result.data };
        })
    );

    // Iterate over the analysis
    for (const analysed of analysis) {
        const trackId = analysed.id;

        // ----> OVERlOAD ANALYSE <---- //
        if (analysed.data.data == null) {
            console.log(++count, " --> OVERLOAD ANALYSE: ", trackId);
            tracks.push({ id: trackId, success: false, error: "OVERLOAD" });
            continue;
        }

        // ----> WAS NOT ANALYSED <---- //
        if (analysed.data.data.spotifyTrackEnqueue.__typename === "SpotifyTrackEnqueueSuccess") {
            console.log(++count, " --> WAS NOT ANALYSED: ", trackId);
            tracks.push({ id: trackId, success: false, error: "WAS_NOT_ANALYZED" });
            continue;
        }

        // ----> ENQUEUE FAILED <---- //
        console.log(++count, " --> ENQUEUE FAILED: ", trackId);
        tracks.push({ id: trackId, success: false, error: "ENQUEUE_FAILED" });
    }

    res.send(tracks);
});

const cyaniteAnalyseTrack = async (token: string, trackId: string) => {
    // Headers
    const headers = {
        "Content-Type": "application/json",
        Authorization: token,
    };

    // Body
    const body = {
        operationName: "SimilaritySearchEnqueueSpotifyTrackAnalysis",
        variables: {
            input: {
                spotifyTrackId: trackId,
            },
        },
        query: "mutation SimilaritySearchEnqueueSpotifyTrackAnalysis($input: SpotifyTrackEnqueueInput!) {\n  spotifyTrackEnqueue(input: $input) {\n    __typename\n    ... on SpotifyTrackEnqueueSuccess {\n      enqueuedSpotifyTrack {\n        id\n        __typename\n      }\n      __typename\n    }\n    ... on Error {\n      message\n      __typename\n    }\n  }\n}\n",
    };

    // Call
    const result = await axios.post<CyaniteTrackAnalysis>(env.CYANITE_API as string, body, { headers });
    return result;
};

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
