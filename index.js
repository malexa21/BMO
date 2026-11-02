const express = require('express');
const { Server } = require('socket.io');
const { Ollama } = require('ollama');

const app = express();
const server = app.listen(5000);
const io = new Server(server);


// connects to http://localhost:11434 by default
const ollama = new Ollama();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname+ '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'views', 'index.html');
});

io.on('connection', (socket) => {
    console.log("CONNECTED TO SERVER")
    socket.on('chat message', async (text) => {
        console.log("Message recieved: ");
        try {
            // Request a response from your local Ollama model
            const response = await ollama.chat({
                model: 'llama3', // Must match the model name you pulled
                messages: [{ role: 'user', content: text }],
            });

            const aiText = response.message.content;
            
            // Send the response back to the browser
            socket.emit('bot reply', aiText);
        } catch (error) {
            console.error('Ollama Error:', error);
            socket.emit('bot reply', "Sorry, I couldn't generate a response.");
        }
    });
});

/* 
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
*/