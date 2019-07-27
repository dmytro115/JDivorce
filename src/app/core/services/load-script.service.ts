import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadScriptService {
  async loadJSLibrary(urls: Array<string>): Promise<any> {
    const promises = urls.map(
      // tslint:disable-next-line: promise-function-async
      (url: string) =>
        new Promise(resolve => {
          const script: HTMLScriptElement = document.createElement('script');
          script.addEventListener('load', r => {
            resolve(url);
          });
          script.src = url;
          document.head.appendChild(script);
        })
    );

    return new Promise(resolve => {
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }
}
