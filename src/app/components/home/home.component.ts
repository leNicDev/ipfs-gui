import { Component, OnInit } from '@angular/core';
import { IpfsService } from '../../providers/ipfs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  _files: FileList;
  _hash: string;
  _busy: boolean;


  constructor(public _ipfs: IpfsService) { }


  ngOnInit() {
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

    this._ipfs.add(file)
      .subscribe(
        (hash: string) => {
          console.log(`Successfully added file ${hash}`);
          this._hash = hash;
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

}
