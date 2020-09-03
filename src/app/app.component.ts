import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  static isBrowser = new BehaviorSubject<boolean>(null);
  static isServer = new BehaviorSubject<boolean>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    AppComponent.isServer.next(isPlatformServer(platformId));
  }
}
