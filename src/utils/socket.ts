import { Server } from 'socket.io';

let io: Server;

export default {
    init: (httpServer: number | import("http").Server | undefined, options: Partial<import("socket.io").ServerOptions> | undefined) => {
        io = new Server(httpServer, options);
        return io;
    },
    getIO: () => {
        if(!io) {
            throw new Error('Socket.io not initialized')
        }
        return io;
    }
}