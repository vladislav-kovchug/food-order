import { createServer, Server } from 'http';
import express from 'express';
import socketIo, {default as SocketIO} from 'socket.io';

// import { Message } from './model';

export class WebsocketServer {
    public static readonly PORT:number = 8888;
    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = WebsocketServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            let clientId = WebsocketServer.guid();

            console.log('Connected client on port %s. Client id: %s.', this.port, clientId);

            socket.on('command', (data: any) => {
                console.log('[server](command): %s', JSON.stringify(data));
                // this.io.emit('message', m);
            });

            socket.on('query', (data: any) => {
                console.log('[server](query): %s', JSON.stringify(data));
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }

    private static guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    public getApp(): express.Application {
        return this.app;
    }
}
