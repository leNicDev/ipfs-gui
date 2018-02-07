import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { HttpClient } from '@angular/common/http';

import * as ipfsApi from 'ipfs-api';
import { AddResult } from '../models/AddResult';
import { readFileSync } from 'fs';

@Injectable()
export class IpfsService {

  ipfs: any;


  constructor(public _http: HttpClient) {
    this.ipfs = ipfsApi('localhost', '8080', { protocol: 'http' });
  }


  isDaemonRunning(host: string, port: number): Observable<boolean> {
    return new Observable<boolean>((subscriber: Subscriber<boolean>) => {
      this._http.get(`http://${host}:${port}/api/v0/version`)
        .subscribe(
          (response: any) => {
            subscriber.next(true);
            subscriber.complete();
          },
          (error: any) => {
            subscriber.next(false);
          }
        );
    });
  }

  add(file: File, progressFunction?: Function): Observable<AddResult> {
    return new Observable<AddResult>((subscriber: Subscriber<AddResult>) => {
      const files = [
        {
          path: file.path,
          content: readFileSync(file.path, { encoding: 'buffer' })
        }
      ];

      const options = {
        progress: (bytes: number) => {
          if (progressFunction) {
            progressFunction(bytes)
          }
        }
      };

      this.ipfs.files.add(files, options, (err, res) => {
        if (err) {
          subscriber.error(err);
        } else {
          for (let i = 0; i < res.length; i++) {
            subscriber.next(res[i]);
          }
          subscriber.complete();
        }
      });
    });
  }

}
