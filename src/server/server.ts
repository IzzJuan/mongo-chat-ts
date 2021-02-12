import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import { formatMessage } from './messages';
import { getCurrentUser, userJoin, userLeave, getRoomUsers } from './users';

const port: number = 3000
const botName: String = 'Mongo Bot'

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server

    constructor(port: number) {
        this.port = port

        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        this.server = new http.Server(app)
        this.io = new socketIO.Server(this.server);

        this.io.on('connection', (socket: socketIO.Socket) => {

            socket.on('joinRoom', ({ username, room }) => {

                const user = userJoin(socket.id, username, room);

                socket.join(user.room);

                socket.emit('message', formatMessage(botName, 'Welcome to MongoChat!'));

                socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

                this.io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                })

            });

            socket.on('chatMessage', (msg: any) => {
                const user = getCurrentUser(socket.id);
                this.io.to(user.room).emit('message', formatMessage(user.username, msg));

            });

            socket.on('disconnect', () => {
                const user = userLeave(socket.id);
                if (user) {
                    this.io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

                    this.io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                    })
                }
            });

        });
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()