import rateLimit from 'express-rate-limit';
import { ClientError } from '../responses/client_errors';

export const apiRatelimit = rateLimit({
    windowMs: 30 * 1000,
    max: 50,
    handler: (req, res, next) => {
        ClientError.tooManyRequests(res);
    },
    headers: true
});