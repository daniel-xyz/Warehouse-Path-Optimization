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
    var generatedData = 'name,groupId,item1,item2,item3,item4,item5,item6\n';
    for(var i=1;i<=10;i++){
      var items = Math.round(Math.random() * 3) + 3;

      generatedData += 'customer'+i+','+i+',';

      for(var j = 0; j<items;j++){
        generatedData += Math.round(Math.random()*63) + ',';
      }
      generatedData = generatedData.substring(0,generatedData.length-1) + '\n';
    }
    generatedData = generatedData.substring(0,generatedData.length-1);
    document.getElementById('job-container').value = generatedData;
  }

  optimizeJobs() {
    var jobObj = this.processData(document.getElementById('job-container').value);
    var slotsInLane = 8;//grid.getSlotsInLane();

    var costTraversing = 0.1;
    var costPerLane = 1;

    //for(var singleJobObj of jobObj) {

    for(var i=1; i<=Object.keys(jobObj).length;i++) {
      var singleJobObj = jobObj[i];
      var currentLane = 0;
      var distance = 0;

      for(var j=0;j<singleJobObj.items.length;j++) {
        var singleItem = singleJobObj.items[j];
        var goToLane = Math.floor(singleItem / slotsInLane)+1;
        console.log('im in lane:'+currentLane);
        console.log('iwant to go to lane:'+goToLane);
        console.log('Traversing costs:'+(goToLane-currentLane)*costTraversing);
        distance += (goToLane-currentLane)*costTraversing;
        if(goToLane != currentLane){
          console.log('Entering new Lane costs:' + costPerLane);
          distance += costPerLane;
        }
        currentLane = goToLane;
        jobObj[i].jobDistance = distance;
        console.log(jobObj[i].jobDistance);
      }
      console.log('lastLane:'+ currentLane + ' cost: ' + currentLane*costTraversing);
      jobObj[i].jobDistance += currentLane * costTraversing;
      jobObj[i].jobDistance = (jobObj[i].jobDistance).toFixed(1);
    }

    console.log(jobObj);
  }

 
  processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var obj = {};

  for (var i=1; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = {};
    tarr['items'] = [];

    for (var j=0; j<data.length; j++) {

      if(headers[j].search('item') != -1) {
        tarr['items'].push(data[j]);
        tarr['items'].sort(function(a, b){return a-b});
      }
      else{
        tarr[headers[j]] = data[j];
      }
    }
    obj[i] = tarr;
  }
  return(obj);
  }

}

var indexController = new IndexController();

