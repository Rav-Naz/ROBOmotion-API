import JWT from 'jsonwebtoken';

export default {
    createToken: (uzytkownik_id: number, uzytkownik_uuid: string, uzytkownik_typ: number): string => {
        const payload = {
            uzytkownik_id: uzytkownik_id,
            uzytkownik_uuid: uzytkownik_uuid,
            uzytkownik_typ: uzytkownik_typ
        };
    
        const secret = process.env.JWT_SECRET || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 32);
    
        const signedToken = JWT.sign(payload, secret.toString(), {
            algorithm: 'HS256',
            expiresIn: '1d'
        });
    
        return signedToken;
    }
}