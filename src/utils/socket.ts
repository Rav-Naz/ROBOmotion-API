import { Server } from 'socket.io';

let io: Server;

export default  {
    init:  (httpServer: number | import("http").Server | undefined, options: Partial<import("socket.io").ServerOptions> | undefined) : Server => {
        io = new Server(httpServer, options);
        io.on('connection', socket => {
            // console.log('Client connected');
            // TODO: dodać JWT i autoryzować dostęp do kanałów (user/judge/admin)
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