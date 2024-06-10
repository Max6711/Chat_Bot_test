const express = require('express');
const bodyParser = require('body-parser');
const { NlpManager } = require('node-nlp');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Створення екземпляра менеджера NLP
const manager = new NlpManager({ languages: ['en'] });

// Навчання бота
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'how are you', 'greetings.howareyou');
manager.addDocument('en', 'bye', 'greetings.bye');
manager.addDocument('en', 'what is your name', 'identity.name');
manager.addDocument('en', 'who are you', 'identity.name');
manager.addDocument('en', 'what can you do', 'capabilities');

manager.addAnswer('en', 'greetings.hello', 'Hello!');
manager.addAnswer('en', 'greetings.hello', 'Hi!');
manager.addAnswer('en', 'greetings.howareyou', 'I am fine, thank you!');
manager.addAnswer('en', 'greetings.bye', 'Goodbye!');
manager.addAnswer('en', 'identity.name', 'I am a chatbot created using Node.js!');
manager.addAnswer('en', 'capabilities', 'I can chat with you and answer your questions.');

// Навчання моделі
(async () => {
    await manager.train();
    manager.save();
    console.log('Model trained');
})();

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Received message:', message);
    const response = await manager.process('en', message);
    console.log('Response:', response.answer);
    res.json({ response: response.answer });
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
