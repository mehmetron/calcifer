import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileNode } from '../interfaces/file-node';
import { MenuButton } from '../interfaces/menu-button';
import { SocketioService } from '../socketio.service';
import { File } from '../interfaces/file';
import { FileStoreService } from './services/file-store.service';
import { MonacoLanguageService } from './services/monaco-language.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  menuButtons: MenuButton[] = [
    {
      name: 'file-system-explorer',
      matIcon: 'content_copy'
    },
    {
      name: 'search',
      matIcon: 'search'
    },
    {
      name: 'settings',
      matIcon: 'settings'
    }
  ];

  activeMenu: MenuButton = this.menuButtons[0];

  files: FileNode[] = [];

  handleMenuSelection(menu: MenuButton): void {
    this.activeMenu = menu;

    switch (menu.name) {
      case 'file-system-explorer':
        break;
      case 'search':
        break;
      case 'settings':
        break;
      default:
        break;
    }
  }

  constructor(private _socketService: SocketioService, private _fileStore: FileStoreService) {}

  ngOnInit(): void {
    this._socketService.init();
    this._socketService.socket.on('list', (files: FileNode[]) => {
      this.files = files;
    });
    this._socketService.socket.on('sendFile', ({ node, content }: File) => {
      this._fileStore.selectedFile$.next({ node, content });
    })
  }

  ngOnDestroy(): void {
    this._socketService.socket.disconnect();
  }

  selectFile(file: FileNode): void {
    this._socketService.socket.emit('getFile', file);
  }
}