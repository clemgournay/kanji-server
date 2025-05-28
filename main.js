import express from 'express';
import http from 'http';
import cors from 'cors';

import { dirname, resolve } from 'path';
import { KanjiRouter } from './src/endpoints/kanji.js';

import { SocketManager } from './src/classes/socket-manager.js';


const __dirname = resolve(dirname(''));

const app = express()

const server = http.createServer(app, {
  cors: {
    origin: process.env.DOMAINS.split(','),
    methods: ['GET', 'POST']
  }
});

const socketManager = new SocketManager(server);
socketManager.init();

const corsOptions = {
  origin: process.env.DOMAINS.split(',')
};

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(KanjiRouter);

server.listen(process.env.PORT, () => {
  console.log(`listening on *: ${process.env.PORT}`);
});
