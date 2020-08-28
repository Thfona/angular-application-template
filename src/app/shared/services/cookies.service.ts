import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  private cookieStore = {};

  constructor() {
    this.parseCookies();
  }

  public getCookie(key: string) {
    this.parseCookies();

    return this.cookieStore[key];
  }

  public setCookie(key: string, value: string, expiration = '', additionalOptions = '') {
    document.cookie = `${key}=${value}; expires=${expiration}${additionalOptions}`;
  }

  public removeCookie(key: string) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  public clearCookies() {
    const cookies = document.cookie;

    const cookiesArray = cookies.split(';');

    for (const cookieIndex of cookiesArray.keys()) {
      const currentCookie = cookiesArray[cookieIndex];
      const equalsIndex = currentCookie.indexOf('=');
      const key = equalsIndex > -1 ? currentCookie.substr(0, equalsIndex) : currentCookie;

      this.removeCookie(key);
    }
  }

  private parseCookies() {
    this.cookieStore = {};

    const cookies = document.cookie;

    const cookiesArray = cookies.split(';');

    for (const cookie of cookiesArray) {
      const cookieKeyAndValue = cookie.split('=');
      this.cookieStore[cookieKeyAndValue[0].trim()] = cookieKeyAndValue[1];
    }
  }
}
