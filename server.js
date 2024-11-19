const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Gerenciar conexões e salas
io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);
    
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${socket.id} entrou na sala: ${room}`);
        io.to(room).emit('message', `Usuário ${socket.id} entrou na sala.`);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`${socket.id} saiu da sala: ${room}`);
        io.to(room).emit('message', `Usuário ${socket.id} saiu da sala.`);
    });

    socket.on('chatMessage', ({ room, message, userName }) => {
        console.log(`Mensagem recebida na sala ${room}: ${message}`);
        io.to(room).emit('message', `${userName}: ${message}`);  // Envia a mensagem com o nome do usuário
    });

    socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
