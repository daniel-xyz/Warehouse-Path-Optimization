/**
 * Created by jkoop_000 on 03.07.2016.
 */
//var FileLoader = require('FileLoader');
//import FileLoader from 'FileLoader';

class IndexController {
  constructor (){
  }

  readSingleFile(e) {

    var reader = new FileReader();

    reader.onloadend = function (e) {
      document.getElementById('job-container').value = e.target.result;
    };

    reader.readAsText(e.files[0]);

  }

  optimizeJobs() {
    var jobObj = this.processData(document.getElementById('job-container').value);
    console.log(jobObj);
    // continue implementing
  }

  processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var obj = {};

  for (var i=1; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = {};

    for (var j=0; j<data.length; j++) {
      tarr[headers[j]] = data[j];
    }
    obj[i] = tarr;
  }
  return(obj);
  }

}

var indexController = new IndexController();

