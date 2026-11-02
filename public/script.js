const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const socket = io();

document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

//Handle the result event and emit to socket INSIDE the listener scope
recognition.addEventListener('result', (e) => {
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    console.log('Confidence: ' + e.results[last][0].confidence);
    console.log('Transcript: ' + text);

    //Send the transcribed speech to your server
    socket.emit('chat message', text);
});

//Handle errors 
recognition.addEventListener('error', (e) => {
    console.error('Speech recognition error:', e.error);
});