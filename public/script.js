console.log("script is loaded")
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();//?clasa - structura care defineste obiectele cu caracteristici comune si functionalitate comuna
//?constructor? ?instanta unei clase? se creeaza o instanta pe baza a object oriented programming
const socket = io();// tot constructor de instanta, bazat pe paradigma functional programming 

//ex: sa def doua obiecte folosind functional programming si object oriented programmng cu diferentele evidentiate

document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});
//metode statice vs metode per instanta

//Handle the result event and emit to socket INSIDE the listener scope
recognition.addEventListener('result', (e) => { //de implementat un script mic care sa foloseasca observer
    //mostenire intre clase?
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

socket.on('bot reply', (aiText) => {
    console.log("AI response: " + aiText);
})