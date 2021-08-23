import { Server } from 'socket.io';
import JWT from 'jsonwebtoken';
import * as userRoutes from '../routes/user'

let io: Server;
const secret = process.env.JWT_SECRET || Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 32);

export default  {
    init:  (httpServer: number | import("http").Server | undefined, options: Partial<import("socket.io").ServerOptions> | undefined) : Server => {
        io = new Server(httpServer, options);
        io.on('connection', async socket => {
            const auth = socket.handshake.auth;
            if(auth.token) {
                JWT.verify(auth.token, secret, { ignoreExpiration: false }, async function(err, decoded) {
                    if (err) {
                        return;
                    }
                    const uzytkownik_uuid = (decoded as any).uzytkownik_uuid;
                    const uzytkownik_typ = (decoded as any).uzytkownik_typ;
                    let kanaly = (await userRoutes.KONSTRUKTORZY_pobierzWszystkieRobotyKonstruktora(uzytkownik_uuid) as Array<any>).map((value) => {
                        return `robots/${value.robot_uuid}`;
                    });
                    if (kanaly.length > 0) socket.join(kanaly);
                    socket.join(`users/${uzytkownik_uuid}`)
                    socket.join(`${uzytkownik_typ === 0 ? 'user' : uzytkownik_typ === 1 ? 'referee' : 'admin'}`);
                });
            }
            // console.log('Client connected');
            socket.on('disconnect', () => {
                // console.log('Client disconnected');
            });
        });
        return io;
    },
    getIO: () : Server => {
        if(!io) {
            throw new Error('Socket.io not initialized')
        }
        return io;
    }
}