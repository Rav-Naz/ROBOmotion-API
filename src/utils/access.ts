import { ClientError } from '../responses/client_errors';
import express from 'express';

const accessToModifyExpirationDate = new Date(2021, 10, 14, 23, 59, 59);
const accessToSmashRobots= new Date(2021, 10, 1, 23, 59, 59);
export default {
    canModify: (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const now = new Date();
            const uzytkownik_typ = (req.query.JWTdecoded as any).uzytkownik_typ;
            if (uzytkownik_typ === 0 && now > accessToModifyExpirationDate) {
                ClientError.badRequest(res, "errors.details.time-to-modify-ended");
                return;
            }
            next();
        },
    getExpirationDate(): Date {
        return accessToModifyExpirationDate;
    },
    getSmashRobotsExpirationDate(): Date {
        return accessToSmashRobots;
    }
}