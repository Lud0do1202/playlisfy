import crypto from 'crypto';

const generateRandomString = (length: number) => {
    return crypto.randomBytes(60).toString('hex').slice(0, length);
};

export { generateRandomString };
