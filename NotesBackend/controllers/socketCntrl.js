const socketCtrl = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.id;

        handleConnection(socket, io, userId);
    });
};




function generateRandomSentence() {
    const subjects = ['The cat', 'A dog', 'My friend', 'A bird', 'The sun'];
    const verbs = ['runs', 'jumps', 'sings', 'flies', 'sleeps'];
    const objects = ['on the roof', 'in the garden', 'under the tree', 'with joy', 'through the clouds'];
    const adjectives = ['happy', 'colorful', 'playful', 'gentle', 'majestic'];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];

    const sentence = `${subject} ${verb} ${adjective} and ${verb} ${adjective} ${object}. ${subject} ${verb} ${adjective} ${object} ${subject} ${verb} ${adjective} ${object}.`;

    return sentence;
}

let randomSentence = generateRandomSentence();







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
            socket.emit('game:start', randomSentence)
            io.to(roomCode).emit('game:start', randomSentence);
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