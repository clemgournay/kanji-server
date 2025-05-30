import { Server } from 'socket.io';
import { GetDrawingResults } from '../includes/drawing.js';

export class SocketManager {
    
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.DOMAINS.split(','),
        methods: ['GET', 'POST', 'OPTIONS']
      }
    });
    this.instances = {};
    this.childrens = {};
  }

  init() {

    this.io.on('connection', async (socket) => {
      console.log(`[${socket.id}] connected`);

      console.log(socket.handshake.query);

      const mode = socket.handshake.query.mode || 'app';

      this.instances[socket.id] = {};

      switch (mode) {
        case 'app':

          socket.on('new character', (character) => {
            this.instances[socket.id] = {character};
            if (this.childrens[socket.id]) {
              this.io.to(this.childrens[socket.id]).emit('new character');
            } 
          });

          break;
        case 'writepad':
          let parentID = socket.handshake.query.parentID;
          this.childrens[parentID] = socket.id;

          socket.on('send drawing', async (data) => {
            const character = this.instances[parentID].character;
            const characters = await GetDrawingResults(data.width, data.height, data.strokes, data.device);
            const result = character && (character.symbol === characters[0]);
            this.io.to(parentID).emit('receive result', result);
          });
          break;
        default:
      }

      socket.on('disconnect', () => {
          console.log(`[${socket.id}] disconnected`);
      });

    });
  }

  emit(message, ...data) {
    console.log('emit socket', message, data);
    this.socket.emit(message, ...data);
  }
}