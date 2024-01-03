const socketCtrl = (io) => {
    io.on('connection', (socket) => {
        const userId = socket.id;

        handleConnection(socket, io, userId);
    });
};

const handleConnection = (socket, io, userId) => {



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