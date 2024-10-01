import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GameInfo } from '../models/gameInfo';
import * as signalR from '@microsoft/signalr';
import { ChessHttpService } from "./chess-http.service";

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  private apiUrl = 'http://localhost:5140/api/';

  private newGameInfo = new BehaviorSubject<GameInfo | undefined>(undefined);

  private hubConnection: HubConnection | undefined;

  private subscribed: boolean = false;

  private opened: boolean = false;

  public onNewGameInfo() {
    console.log(2312321)
    return this.newGameInfo.asObservable();
  }

  public startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + '/api/hub/game', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch(err => console.log('Error while starting SignalR connection: ' + err));

    this.hubConnection.onclose = (error) => {
      console.log('SignalR connection closing with an error ' + error.toString());
      window.location.reload();
    };

    this.opened = true;
  }

  public closeConnection = () => {
    if (!this.opened)
      return;

    this.hubConnection?.stop()
      .then(() => console.log('SignalR connection stopped'))
      .catch(err => console.log('Error on SignalR connection stopping: ' + err));

    this.opened = false;
  }

  public refreshConnection = () => {
    console.log('SignalR connection refreshing');

    this.newGameInfo = new BehaviorSubject<GameInfo | undefined>(undefined);
  }

  public addTransferChartDataListener = () => {
    if (this.hubConnection == null || this.subscribed)
      return;

    this.hubConnection.on('GameInfo', (data) => {
      this.newGameInfo.next(data);
    });

    this.subscribed = true;

    console.log('SignalR listeners added successfully');
  }
}