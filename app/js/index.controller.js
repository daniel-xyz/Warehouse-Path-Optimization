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

  generateJobs() {
    var generatedData = "name,item1,item2,item3,item4,item5,item6\n";
    for(var i=1;i<=10;i++){
      var items = Math.round(Math.random() * 3) + 3;

      generatedData += "customer"+i+",";

      for(var j = 0; j<items;j++){
        generatedData += Math.round(Math.random()*63) + ',';
      }
      generatedData = generatedData.substring(0,generatedData.length-1) + "\n";
    }
    generatedData = generatedData.substring(0,generatedData.length-1);
    document.getElementById('job-container').value = generatedData;
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

