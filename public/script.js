const socket = io();
let currentRoom = null;
let userName = '';  // Variável para armazenar o nome do usuário

// Definir nome do usuário
function setUserName() {
    const name = document.getElementById('userName').value.trim();
    if (name) {
        userName = name;  // Armazena o nome do usuário
        document.getElementById('userInfo').style.display = 'none';  // Oculta o campo de nome após definir
        alert('Nome definido: ' + userName);
    } else {
        alert('Por favor, insira um nome.');
    }
}

// Entrar em uma sala
function joinRoom(room) {
    if (currentRoom) {
        socket.emit('leaveRoom', currentRoom);
    }
    currentRoom = room;
    socket.emit('joinRoom', room);
    document.getElementById('messages').innerHTML = '';
    addMessage(`Você entrou na ${room}`);
}

// Enviar mensagem
function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (message.trim() && currentRoom) {
        socket.emit('chatMessage', { room: currentRoom, message, userName });
        document.getElementById('messageInput').value = '';  // Limpa o campo
    }
}

// Receber mensagens
socket.on('message', (message) => {
    addMessage(message);
});

// Adicionar mensagem na interface
function addMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Rola para a última mensagem
}
