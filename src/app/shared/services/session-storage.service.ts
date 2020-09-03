import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

type SessionStorageKey = 'persistSession' | 'lang';

const handleSessionStorageFunction = () => {
  const handle = <TFunction extends Function>(target: TFunction) => {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      const originalFunction: Function = target.prototype[prop];

      if (originalFunction instanceof Function) {
        target.prototype[prop] = function () {
          if (this.sessionStorageEnabled) {
            return originalFunction.apply(this, arguments);
          }
        };
      }
    }
  };

  return handle;
};

@handleSessionStorageFunction()
@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private sessionStorageEnabled = false;

  constructor() {
    AppComponent.isBrowser.subscribe((isBrowser) => {
      if (isBrowser) {
        this.sessionStorageEnabled = true;
      }
    });
  }

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
