import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

export interface VisualDataObject {
  episodeName: string,
  source: {
    web: {
      finishRate: number,
      noSubmitRate: number,
      userCount: number
    },
    tablet: {
      finishRate: number,
      noSubmitRate: number,
      userCount: number
    }
    total: {
      finishRate: number,
      noSubmitRate: number,
      userCount: number
    }
  }
}

@Component({
  selector: 'app-visual-data',
  templateUrl: './visual-data.component.html',
  styleUrls: ['./visual-data.component.less']
})
export class VisualDataComponent implements OnInit {
  csvContent: string;
  // parsedCsv: string[][];
  data: any;
  downloadJsonHref;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  onFileLoad(fileLoadedEvent) {
    let parsedCsv = this.loadFileData(fileLoadedEvent);
    console.log(parsedCsv);

    // parsing -> create data obj
    let dataObjects = this.rawDataToDataObj(parsedCsv);
    let visualDataObjects = this.dataObjectsToVisualDataObjects(dataObjects);
    this.data = {
      data: visualDataObjects
    };
    this.generateDownloadJsonUri(this.data);
    //console.log(visualDataObjects);
    // present visual(data)
    // visual code

  }

  generateDownloadJsonUri(jsonObj) {
    var theJSON = JSON.stringify(jsonObj);
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
  }

  loadFileData(fileLoadedEvent) {
    // get file data -> file data obj
    const csvSeparator = ',';
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(textFromFileLoaded);

    const txt = textFromFileLoaded;
    const csv = [];
    const lines = txt.split('\n');
    lines.forEach(element => {
      const cols: string[] = element.split(csvSeparator);
      csv.push(cols);
    });
    return csv;
  }

  rawDataToDataObj(rowData) {
    // let dataObjects: VisualDataObject[];
    let columnsNames = rowData[0];
    console.log('columnsNames', columnsNames);
    let data = [];
    for (let i = 1; i < rowData.length; i++) {
      let obj = {};
      for (let j = 0; j < columnsNames.length; j++) {
        let columnName = columnsNames[j] || '';
        let columnData = rowData[i][j] || '';
        Object.assign(obj, {[columnName.trim()]: columnData.trim()});
      }
      data.push(obj);
    }
    console.log('data', data);
    return data;
  }

  dataObjectsToVisualDataObjects(dataObjects: any[]): VisualDataObject[] {
    let visualData: VisualDataObject[] = [];
    for (let i = 0; i < dataObjects.length; i++) {
      let visualDataObject: VisualDataObject = {
        episodeName: dataObjects[i].episode_name,
        source: {
          web: {
            finishRate:  100 * parseFloat(dataObjects[i].web_finish_rate) || 0,
            noSubmitRate: 100 * parseFloat(dataObjects[i].web_no_submit) / parseFloat(dataObjects[i].web_start_episode) || 0,
            userCount: parseFloat(dataObjects[i].web_start_episode)
          },
          tablet: {
            finishRate: 100 *parseFloat(dataObjects[i].tablet_finish_rate) || 0,
            noSubmitRate: 100 * parseFloat(dataObjects[i].tablet_no_submit) / parseFloat(dataObjects[i].tablet_start_episode) || 0,
            userCount: parseFloat(dataObjects[i].tablet_start_episode)
          },
          total: {
            finishRate: 100 *((parseFloat(dataObjects[i].web_finish_episode) + parseFloat(dataObjects[i].tablet_finish_episode)) || 0)
             / (parseFloat(dataObjects[i].web_start_episode) + parseFloat(dataObjects[i].tablet_start_episode)) || 0,
            noSubmitRate: (parseFloat(dataObjects[i].web_no_submit) + parseFloat(dataObjects[i].tablet_no_submit))
              / (parseFloat(dataObjects[i].web_start_episode) + parseFloat(dataObjects[i].tablet_start_episode)) || 0,
            userCount: parseFloat(dataObjects[i].web_start_episode) + parseFloat(dataObjects[i].tablet_start_episode)
          }
        }
      };
      visualData.push(visualDataObject);
    }
    return visualData;
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;
    if (files && files.length) {
      const fileToRead = files[0];

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad.bind(this);

      fileReader.readAsText(fileToRead, "UTF-8");
    }

  }

}
