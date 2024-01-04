const socketCtrl = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.id;

        handleConnection(socket, io, userId);
    });
};


const ArrayOfContent = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum et sollicitudin ac orci phasellus egestas tellus."
]


const roomUsers = {};
const users = []
let solution = [];

const handleConnection = (socket, io, userId) => {


    socket.on('game:join', (data) => {
        const { username, roomCode } = data;

        console.log(`length of the room code ${roomCode}`, roomUsers[roomCode]?.length);
        if (roomUsers[roomCode]?.length >= 2) {
            console.log('game full');
            return socket.emit('game:full', 'Sorry, the game is already full');
        }

        if (!roomUsers[roomCode]) {
            socket.join(roomCode);
            roomUsers[roomCode] = [{
                username,
                socketId: socket.id
            }];
            console.log('roomUsers', roomUsers);
        } else {
            roomUsers[roomCode].push({
                username,
                socketId: socket.id
            });
            socket.join(roomCode);
            console.log('roomUsers', roomUsers);
        }

        console.log(username, 'has joined the room with code', roomCode);
        socket.emit('game:joined', data);
        io.to(roomCode).emit('game:joined', data);

        if (roomUsers[roomCode].length === 2) {
            console.log('game:start')
            const randomIndex = Math.floor(Math.random() * ArrayOfContent.length);
            socket.emit('game:start', ArrayOfContent[randomIndex])
            io.to(roomCode).emit('game:start', ArrayOfContent[randomIndex]);
        }


        socket.on('game:submit', (data) => {
            solution.push(data);
            console.log(solution);
            if (solution.length === 2) {
                let winner = '';
                if (solution[0].currentTime > solution[1].currentTime) {
                    winner = solution[1].username;
                    console.log(winner)
                } else if (
                    solution[0].currentTime < solution[1].currentTime
                ) {
                    winner = solution[0].username;
                    console.log(winner)
                }
                else {
                    winner = 'Draw';
                }

                io.to(roomCode).emit('game:winner', winner);
                roomUsers[roomCode] = [];
                solution = [];
            }
        })



    });



    socket.on('join', (commId) => {
        socket.join(commId.id);

        console.log('joined', commId.username);

        const response = {

            message: `${commId.username} joined the chat`,
        };

        socket.to(commId.id).emit('new-user', response);
    })

    socket.on('disconnect', () => {

    });

    socket.on('send-message', (message) => {

        const response = {
            message: {
                content: message.message,
                sender: {
                    id: message._id,
                    username: message.username,
                    profile: message.profile
                }
            }
        }

        socket.to(message.id).emit('new-message', response);
    });


}

module.exports = { socketCtrl };