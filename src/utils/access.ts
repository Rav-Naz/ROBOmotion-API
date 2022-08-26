import { ClientError } from '../responses/client_errors';
import express from 'express';
import time_constraints from './time_constraints';

export default {
    canModify: (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const now = new Date();
            const rejestracja = time_constraints.getTimeConstraint("Rejestracja");
            const uzytkownik_typ = (req.query.JWTdecoded as any).uzytkownik_typ;
            if (uzytkownik_typ === 0 && (now > rejestracja?.data_zakonczenia! || now < rejestracja?.data_rozpoczecia!)) {
                ClientError.badRequest(res, "errors.details.time-to-modify-ended");
                return;
            }
            next();
        },
    canModifyDocumentation: (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const now = new Date();
            const dokumentacje = time_constraints.getTimeConstraint("Dokumentacje");
            const uzytkownik_typ = (req.query.JWTdecoded as any).uzytkownik_typ;
            if (uzytkownik_typ == 0 && (now > dokumentacje?.data_zakonczenia!)) {
                ClientError.badRequest(res, "errors.details.time-to-modify-ended");
                return;
            }
            next();
        }

}