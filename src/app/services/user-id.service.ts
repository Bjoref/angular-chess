import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserIdService {
  private currentId: number = 1;
  public currentColor: string = 'White'

  setUserId(id: number): void {
    this.currentId = id;
  }

  getUserId(): number {
    return this.currentId;
  }
}
