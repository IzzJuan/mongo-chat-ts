const chatForm = <HTMLElement>document.getElementById("chat-form");
const chatMessages = <HTMLElement>document.querySelector(".chat-messages");
const roomName = <HTMLElement>document.getElementById('room-name');
const userList = <HTMLElement>document.getElementById('users');

const { username, room }: any = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        this.socket.emit('joinRoom', { username, room });

        this.socket.on('roomUsers', ({ room, users }: any) => {
            outputRoomName(room);
            outputUsers(users);
        });

        this.socket.on('message', (message: any) => {
            console.log(message);
            outputMessage(message);

            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        chatForm.addEventListener('submit', (e: any) => {
            e.preventDefault();

            const msg = e.target.elements.msg.value;
            console.log(msg);
            this.socket.emit('chatMessage', msg)

            e.target.elements.msg.value = '';
            e.target.elements.msg.focus();
        });

        function outputMessage(message: any) {
            const div = <HTMLElement>document.createElement('div');
            div.classList.add('message');
            div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
            document.querySelector('.chat-messages')?.appendChild(div);
        }

        function outputRoomName(room: any) {
            roomName.innerText = room;
        }

        function outputUsers(users: any) {
            userList.innerHTML = `
            ${users.map((user: any) => `<li>${user.username}</li>`).join('')}
            `;
        }

    }
}

const client = new Client();