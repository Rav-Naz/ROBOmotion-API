import { ClientError } from './../responses/client_errors';
import JWT from 'jsonwebtoken';
import express from 'express';

const secret = process.env.JWT_SECRET || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 32);
export default {
    createToken: (uzytkownik_id: number, uzytkownik_uuid: string, uzytkownik_typ: number): string => {
        const payload = {
            uzytkownik_id: uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            uzytkownik_typ: uzytkownik_typ
        };
    
    
        const signedToken = JWT.sign(payload, secret.toString(), {
            algorithm: 'HS256',
            expiresIn: '1d'
        });
    
        return signedToken;
    },
    verify: (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const token = req.header("token");
            if (!token) {
                ClientError.unauthorized(res, "You have not permission to get the data");
                return;
            }
            JWT.verify(token, secret, { ignoreExpiration: false }, function(err, decoded) {
                if (err) {
                    ClientError.unauthorized(res, "You have not permission to get the data");
                    return;
                }
                delete decoded?.iat;
                delete decoded?.exp;
                req.query.JWTdecoded = decoded;
            });
            next();
    
        }
}