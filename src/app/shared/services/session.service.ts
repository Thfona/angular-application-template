import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { CookiesService } from './cookies.service';
import { JwtService } from './jwt.service';
import { LocalStorageService } from './local-storage.service';
import { endpoints } from '../constants/endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _accessToken: string;
  private refreshTokenKey = 'refreshToken';

  constructor(
    private httpClient: HttpClient,
    private cookiesService: CookiesService,
    private jwtService: JwtService,
    private localStorageService: LocalStorageService
  ) {}

  // Access Token
  public get accessToken(): string {
    return this._accessToken;
  }

  public set accessToken(value: string) {
    this._accessToken = value;
  }

  // Refresh Token
  public get refreshToken(): string {
    return this.cookiesService.getCookie(this.refreshTokenKey);
  }

  public set refreshToken(value: string) {
    if (this.persistSession) {
      const refreshTokenExpiration = new Date(this.getRefreshTokenExpirationDate()).toUTCString();

      this.cookiesService.setCookie(this.refreshTokenKey, value, refreshTokenExpiration);
    } else {
      this.cookiesService.setCookie(this.refreshTokenKey, value);
    }
  }

  // Persist Session
  public get persistSession(): boolean {
    return this.localStorageService.getJson('persistSession');
  }

  public set persistSession(value: boolean) {
    this.localStorageService.setJson('persistSession', value);
  }

  // Access Token methods
  public isAccessTokenInvalid(): boolean {
    return this.jwtService.isTokenInvalid(this.accessToken);
  }

  public isAccessTokenExpired(): boolean {
    return this.jwtService.isTokenExpired(this.accessToken);
  }

  public getAccessTokenExpirationDate(): Date {
    return this.jwtService.getTokenExpirationDate(this.accessToken);
  }

  public decodeAccessToken(): any {
    return this.jwtService.decodeToken(this.accessToken);
  }

  public removeAccessToken() {
    this.accessToken = '';
  }

  // Refresh Token methods
  public isRefreshTokenInvalid(): boolean {
    return this.jwtService.isTokenInvalid(this.refreshToken);
  }

  public isRefreshTokenExpired(): boolean {
    return this.jwtService.isTokenExpired(this.refreshToken);
  }

  public getRefreshTokenExpirationDate(): Date {
    return this.jwtService.getTokenExpirationDate(this.refreshToken);
  }

  public decodeRefreshToken(): any {
    return this.jwtService.decodeToken(this.refreshToken);
  }

  public removeRefreshToken() {
    this.cookiesService.removeCookie(this.refreshTokenKey);
  }

  public refreshAccessToken(): Observable<string> {
    if (this.isAccessTokenExpired()) {
      const url = endpoints.refreshAccessToken;
      const refreshToken = this.refreshToken;

      const options = {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${refreshToken}`
        }
      };

      return this.httpClient.post<any>(url, null, options).pipe(
        share(),
        map((response) => {
          const accessToken = response.token;
          const newRefreshToken = response.refreshToken;

          this.accessToken = accessToken;
          this.refreshToken = newRefreshToken;

          return accessToken;
        })
      );
    }

    return of(this.accessToken);
  }

  public logout() {
    this.redirect();
    sessionStorage.clear();
    localStorage.clear();
    this.cookiesService.clearCookies();
    this.removeAccessToken();
  }

  private redirect() {
    const origin = window.location.origin;
    window.location.href = `${origin}`;
  }
}
