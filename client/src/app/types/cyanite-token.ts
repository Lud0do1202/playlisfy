export type CyaniteToken = {
  /** The access token used to authenticate API requests. */
  accessToken: string;

  /** The refresh token used to obtain a new access token when the current one expires. */
  refreshToken: string;

  /** The issued-at time (iat) of the token, indicating when the token was created. */
  iat: string;

  /** The expiration time (exp) of the token, specifying when the token will expire. */
  exp: string;
};
