import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../../providers/ipfs.service';
import { AddResult } from '../../models/AddResult';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  _files: FileList;
  _hash: string;
  _busy: boolean;

  _error: string;


  constructor(public _ipfs: IpfsService) { }


  ngOnInit() {
    this._ipfs.isDaemonRunning('127.0.0.1', 5001)
      .subscribe(
        (result: boolean) => {
          if (!result) {
            this.error = 'The IPFS daemon is currently not running! Start it using <span class="mono">ipfs daemon</span>.';
          }
        }
      );
  }


  onFileChange(files: FileList) {
    this._files = files;

    // Add file to IPFS
    if (this._files && this._files.length > 0) {
      this.ipfsAddFile(this._files.item(0));
    }
  }

  ipfsAddFile(file: File) {
    this._busy = true;

    const progress = (bytes: number) => {
      console.log(`Progress: ${bytes}/${file.size}`);
    };

    this._ipfs.add(file, progress)
      .subscribe(
        (result: AddResult) => {
          console.log(`Successfully added file ${JSON.stringify(result)}`);
          this._hash = result.hash;
          this._busy = false;
          console.log('Test');
        },
        (error: string) => {
          console.error(`Failed to add file: ${error}`);
          this._busy = false;
        }
      );
  }


  onHashClick() {
    document.execCommand('copy');
  }

  onHashCopy(event: any) {
    event.preventDefault();

    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', this._hash);
    }
  }


  get error() {
    return this._error;
  }

  set error(error: string) {
    this._error = error;
  }

}
