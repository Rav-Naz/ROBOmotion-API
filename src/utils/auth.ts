import { ClientError } from './../responses/client_errors';
import express from 'express';
import sha256 from 'sha256';

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
    },
    hashPassword(haslo: string): String {
        return sha256(haslo);
    }
}