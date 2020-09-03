import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

type LocalStorageKey = 'persistSession' | 'lang';

const handleLocalStorageFunction = () => {
  const handle = <TFunction extends Function>(target: TFunction) => {
    for (const prop of Object.getOwnPropertyNames(target.prototype)) {
      const originalFunction: Function = target.prototype[prop];

      if (originalFunction instanceof Function) {
        target.prototype[prop] = function () {
          if (this.localStorageEnabled) {
            return originalFunction.apply(this, arguments);
          }
        };
      }
    }
  };

  return handle;
};

@handleLocalStorageFunction()
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private localStorageEnabled = false;

  constructor() {
    AppComponent.isBrowser.subscribe((isBrowser) => {
      if (isBrowser) {
        this.localStorageEnabled = true;
      }
    });
  }

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
