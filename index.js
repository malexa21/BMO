const express = require('express');
const { Server } = require('socket.io');
const { Ollama } = require('ollama');

const app = express(); //?programare functionala
const httpServer = app.listen(5000, () =>{
    console.log("Application started on port 5000");
});

const ioServer = new Server(httpServer);//doua servere http+io

//de adaugat handler in cazul in care aplicatia are o eroare

// connects to http://localhost:11434 by default
const ollama = new Ollama();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname+ '/public'));// clientul poate accesa direct folderul -> express.static

app.get('/', (req, res) => {//controler?
    res.sendFile(__dirname + '/views/index.html');
});//endpoit - ? rest full API ?


ioServer.on('connection', (socket) => { // web socket 
    console.log("CONNECTED TO SERVER " + socket.id)
        socket.conn.on('close', ()=>{
            console.log("Socket disconnected " + socket.id)
        })
    socket.on('chat message', async (text) => {
        console.log("Message recieved: " + text);
        try {
            // Request a response from your local Ollama model
            const response = await ollama.chat({
                model: 'llama3.1', // Must match the model name you pulled
                messages: [{ role: 'user', content: text }],
            });

            const aiText = response.message.content;
            console.log("Ai responded: " + aiText);
            
            // Send the response back to the browser
            socket.emit('bot reply', aiText);

        } catch (error) {
            console.error('Ollama Error:', error);
            socket.emit('bot reply', "Sorry, I couldn't generate a response.");
        }
    });

});


// app.listen(5000, () => {
//     console.log('Server running on port 5000');
// });
