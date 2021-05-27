import { Injectable } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private fileSaverService: FileSaverService,
  ) { }

  /**
   * @param data the data
   * @param fileName the file name
   * @param mimeType the mime type
   */
  downloadFile(data: string, fileName?: string, mimeType?: string): void {
    mimeType = mimeType || 'application/octet-stream';

    this.fileSaverService.save(
      new Blob([data], {type: `${mimeType};`}),
      fileName
    );
  }
}
