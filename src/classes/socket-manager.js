import { Server } from 'socket.io';
import { GetDrawingKanjis } from '../includes/drawing.js';

export class SocketManager {
    
  constructor(server) {
    this.io = new Server(server, {
        cors: {
            origin: process.env.DOMAINS.split(','),
            methods: ['GET', 'POST', 'OPTIONS']
        }
    });
  }

  init() {
    this.io.on('connection', async (socket) => {
      console.log(`[${socket.id}] connected`);

      console.log(socket.handshake.query);

      const mode = socket.handshake.query.mode || 'app';


      switch (mode) {
        case 'app':
          break;
        case 'writepad':
          let parentID = socket.handshake.query.parentID;

          socket.on('send drawing', async (data) => {
            console.log(data);
            const kanjis = await GetDrawingKanjis(data.width, data.height, data.strokes, data.device);
            this.io.to(parentID).emit('receive result', kanjis);
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