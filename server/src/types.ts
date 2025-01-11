export type CyaniteToken = {
    accessToken: string;
    refreshToken: string;
    iat: string;
    exp: string;
};

export type CyaniteRefreshTokenGenerateResponse = {
    data: {
        refreshTokenRequest: {
            id: string;
            refreshToken: string;
            __typename: string;
        };
    };
};

export type CyaniteAccessTokenGenerateResponse = {
    data: {
        accessTokenGenerate: {
            accessToken: string;
            user: {
                id: string;
                login: string;
                email: string;
                __typename: string;
            };
            __typename: string;
        };
    };
};

export type CyaniteTrackResponse = {
    error?: any;
    data: {
        track: {
            __typename: string;
            id: string;
            title: string;
            tableView: {
                analysisStatus: "FINISHED" | "NOT_STARTED" | "ENQUEUED" | string;
                // advancedInstrumentTags: string[] | null,
                // advancedSubgenreTags: string[] | null,
                // advancedGenreTags: string[] | null,
                // augmentedKeywords: [ { label: string } ] | null,
                // voiceTags: string[] | null,
                // bpmRangeAdjusted: number | null,
                // moodAdvancedTags: string[] | null,
                // movementTags: string[] | null,
                // characterTags: string[] | null,
                transformerCaption: string | null;
                // freeGenreTags: string[] | null,
            };
        };
    };
};

export type CyaniteTrack = {
    id: string;
    success: boolean;
    title?: string;
    description?: string;
    error?: "OVERLOAD" | "WAS_NOT_ANALYZED" | "ENQUEUE_FAILED" | "ALREADY_ENQUEUED" | string;
};

export type CyaniteTrackAnalysis = {
    data: { spotifyTrackEnqueue: { __typename: "SpotifyTrackEnqueueSuccess" | string } };
};
