import { Injectable } from '@angular/core';

type SessionStorageKey = any;

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  public has(key: SessionStorageKey): boolean {
    return key in sessionStorage;
  }

  public get(key: SessionStorageKey): string {
    return sessionStorage.getItem(key);
  }

  public getJson(key: SessionStorageKey): any {
    return JSON.parse(this.get(key));
  }

  public set(key: SessionStorageKey, value: string) {
    sessionStorage.setItem(key, value);
  }

  public setJson(key: SessionStorageKey, value: any) {
    this.set(key, JSON.stringify(value));
  }

  public remove(key: string) {
    sessionStorage.removeItem(key);
  }

  public clear() {
    sessionStorage.clear();
  }
}
