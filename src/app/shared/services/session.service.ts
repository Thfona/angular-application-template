import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookiesService } from './cookies.service';
import { JwtService } from './jwt.service';
import { LocalStorageService } from './local-storage.service';
import { authenticationPath, endpoints } from '../constants/endpoints.constant';

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

  public refreshAccessToken(): Observable<string> {
    if (this.isAccessTokenExpired()) {
      const url = endpoints.refreshAccessToken.url;

      const options = {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      };

      return this.httpClient.post<any>(url, null, options).pipe(
        share(),
        map((response) => {
          const accessToken = response.token;
          const newRefreshToken = response.refreshToken;

          this.accessToken = accessToken;
          this.setRefreshToken(newRefreshToken);

          return accessToken;
        })
      );
    }

    return of(this.accessToken);
  }

  // Refresh Token methods
  public setRefreshToken(refreshToken: string) {
    const refreshTokenAdditionalOptions = `; domain=${environment.apiBaseUrl}; path=${authenticationPath}; secure; HttpOnly`;

    if (this.persistSession) {
      const refreshTokenExpiration = new Date(this.jwtService.getTokenExpirationDate(refreshToken)).toUTCString();

      this.cookiesService.setCookie(
        this.refreshTokenKey,
        refreshToken,
        refreshTokenExpiration,
        refreshTokenAdditionalOptions
      );
    } else {
      this.cookiesService.setCookie(this.refreshTokenKey, refreshToken, '', refreshTokenAdditionalOptions);
    }
  }

  // Other methods
  public logout() {
    const url = endpoints.logout.url;
    const accessToken = this.accessToken;

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${accessToken}`
      }
    };

    this.httpClient.post<any>(url, null, options);

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
