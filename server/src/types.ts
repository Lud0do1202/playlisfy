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
