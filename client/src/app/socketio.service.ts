import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

const { path, ssh_url } = environment;
@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: Socket;


  init(): void {
    window.addEventListener('beforeunload', () => {
      this.socket?.disconnect?.();
    });

    const urlParams = new URLSearchParams(window.location.search);
    let host = urlParams.get('h');
    host = host ? host : '';

    this.socket = io(`${ssh_url}/${host}`, {
      path,
      query: {
        host,
        username: 'root',
        password: 'KJ7rNn5yyz321321321z',
      },
    });
  }
}