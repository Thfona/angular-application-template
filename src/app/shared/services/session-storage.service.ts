import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { isBrowserHandler } from '../utils/is-browser-handler.util';

type storageKey = 'persistSession' | 'lang';

@isBrowserHandler()
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private isBrowser: boolean;

  constructor() {
    AppComponent.isBrowser.subscribe((isBrowser) => {
      this.isBrowser = isBrowser;
    });
  }

  public has(key: storageKey): boolean {
    return key in sessionStorage;
  }

  public get(key: storageKey): string {
    return sessionStorage.getItem(key);
  }

  public getJson(key: storageKey): any {
    return JSON.parse(this.get(key));
  }

  public set(key: storageKey, value: string) {
    sessionStorage.setItem(key, value);
  }

  public setJson(key: storageKey, value: any) {
    this.set(key, JSON.stringify(value));
  }

  public remove(key: storageKey) {
    sessionStorage.removeItem(key);
  }

  public clear() {
    sessionStorage.clear();
  }
}
