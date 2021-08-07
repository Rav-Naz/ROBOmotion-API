import { ClientError } from './../responses/client_errors';
import express from 'express';
// (req: express.Request, res: express.Response, next: express.NextFunction)
const secret = process.env.JWT_SECRET || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 32);
export default {
    authorize: (typ: number) => {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const decoded = req.query.JWTdecoded as any;
            if (!decoded) {
                ClientError.unauthorized(res, "You have not permission to get the data");
                return;
            }
            const uzytkownik_typ = decoded.uzytkownik_typ;
            if (uzytkownik_typ < typ) {
                ClientError.unauthorized(res, "You have not permission to get the data");
                return;
            }
            next();
        }
    }
}