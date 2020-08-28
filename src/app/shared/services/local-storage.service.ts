import { Injectable } from '@angular/core';

type LocalStorageKey = 'persistSession' | 'lang';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public has(key: LocalStorageKey): boolean {
    return key in localStorage;
  }

  public get(key: LocalStorageKey): string {
    return localStorage.getItem(key);
  }

  public getJson(key: LocalStorageKey): any {
    return JSON.parse(this.get(key));
  }

  public set(key: LocalStorageKey, value: string) {
    localStorage.setItem(key, value);
  }

  public setJson(key: LocalStorageKey, value: any) {
    this.set(key, JSON.stringify(value));
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
