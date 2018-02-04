import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { spawn } from 'child_process';

@Injectable()
export class IpfsService {

  constructor(public _zone: NgZone) {}


  add(file: File): Observable<string> {
    return new Observable<string>((subscriber: Subscriber<string>) => {
      console.log('Uploading file ' + file.path);

      const process = spawn('ipfs', ['add', file.path, '--quiet']);

      process.stdout.on('data', (data: string) => {
        this._zone.runTask(() => {
          subscriber.next(data);
          subscriber.complete();
        });
      });

      process.stderr.on('data', (data: string) => {
        this._zone.runTask(() => {
          subscriber.error(data);
        });
      });
    });
  }

}
