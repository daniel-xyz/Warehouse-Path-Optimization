/**
 * Created by jkoop_000 on 03.07.2016.
 */
//var FileLoader = require('FileLoader');
//import FileLoader from 'FileLoader';

class IndexController {

  constructor ($){
    var $ = $;
    var jobObj;
  }

  readSingleFile(e) {

    var reader = new FileReader();

    reader.onloadend = function (e) {
      document.getElementById('job-container').value = e.target.result;
    };

    reader.readAsText(e.files[0]);

  }

  generateJobs() {
    var generatedData = 'name,item1,item2,item3,item4,item5,item6\n';
    for(var i=1;i<=10;i++){
      var items = Math.round(Math.random() * 3) + 3;

      generatedData += 'customer'+i+',';

      for(var j = 0; j<items;j++){
        generatedData += Math.round(Math.random()*((grid.getSlotsInLane()*grid.getLanes())-1)) + ',';
      }
      generatedData = generatedData.substring(0,generatedData.length-1) + '\n';
    }
    generatedData = generatedData.substring(0,generatedData.length-1);
    document.getElementById('job-container').value = generatedData;
  }

  calculateJobDistance() {
    this.jobObj = this.processData(document.getElementById('job-container').value);
    //for(var singleJobObj of jobObj) {
    
    for(var i=1; i<=Object.keys(this.jobObj).length;i++) {
      var singleJobObj = this.jobObj[i];

      this.jobObj[i].jobDistance = this.calculateSingleJobDistance(singleJobObj);
    }

    this.groupJobs();

    console.log(this.jobObj);
    this.printTable();
  }

  printTable() {
    var tableContent = '<table>' +
      '<tr>' +
      '<td>Id</td>' +
      '<td>Group</td>' +
      '<td>Name</td>' +
      '<td>Items</td>' +
      '<td>Distance</td>' +
      '</tr>\n';

    for(var i=1; i<=Object.keys(this.jobObj).length;i++) {
      tableContent += '<tr>' +
          '<td>' + i + '</td>' +
          '<td>' + this.jobObj[i].groupId + '</td>' +
          '<td>' + this.jobObj[i].name + '</td>' +
          '<td>' + this.jobObj[i].items + '</td>' +
          '<td>' + this.jobObj[i].jobDistance + '</td>' +
          '<td><input type="Button" value="start" onclick="new animations(indexController.animateJobsWithId('+i+'))"))"></input></td>' +
        '</tr>'
    }

    tableContent += '</table>';

    document.getElementById('optimizedJobTable').innerHTML = tableContent;
  }

  animateJobsWithId(groupId) {
    console.log('reached');
    for (let i = 1; i <= Object.keys(this.jobObj).length; i++) {
      //hier könnte ich nur die selektierten gruppen wählen und in ein objekt schicken und an deine animationsfunktion senden
    }
    return this.jobObj[groupId];
  }

  groupJobs() {
    let jobsPerGroup = document.getElementById('jobsPerGroup').value;
    let groupCount = Math.ceil((Object.keys(this.jobObj).length / jobsPerGroup).toFixed(2));
    let jobsAmount = Object.keys(this.jobObj).length;

    for(let i = 1; i<=groupCount;i++){
      let currentJob = this.findShortestPathObj(this.jobObj,false);
      currentJob.groupId = i;
      
      for(let k = 0; k<jobsPerGroup-1;k++) {
        let possibleJobPartners = this.getAllUngroupedJobs();
        let compoundDistance=1000;
        let selectedJobPartnerId;

        for(let j=1; j<Object.keys(this.jobObj).length; j++) {
          if(typeof possibleJobPartners[j]!='undefined') {
            let joinedItems = {};
            joinedItems.items = possibleJobPartners[j].items.concat(currentJob.items);
            joinedItems.items.sort(function(a, b){return a-b});
            if(this.calculateSingleJobDistance(joinedItems)<compoundDistance) {
              compoundDistance = this.calculateSingleJobDistance(joinedItems);
              selectedJobPartnerId = j;
            }
          }
        }
        if(typeof this.jobObj[selectedJobPartnerId] != 'undefined') {
          this.jobObj[selectedJobPartnerId].groupId = i;
        }
      }
    }

  }

  getAllUngroupedJobs() {
    let ungroupedJobs = {};
    for(var i=1; i<=Object.keys(this.jobObj).length;i++) {
      if(typeof this.jobObj[i].groupId == 'undefined') {
          ungroupedJobs[i] = this.jobObj[i];
      }
    }
    return ungroupedJobs;
  }

  findShortestPathObj(jobObj, shortest) {
    var singleJobObj = jobObj[1];
    
    for(var j=1; j<=Object.keys(jobObj).length;j++) {
      if(typeof jobObj[j].groupId == 'undefined') {
        singleJobObj = jobObj[j];
        continue;
      }
    }
    
    for(var i=1; i<=Object.keys(jobObj).length;i++) {
      if(typeof jobObj[i].groupId == 'undefined'){
        if (singleJobObj.jobDistance > jobObj[i].jobDistance && shortest == true) {
          singleJobObj = jobObj[i];
        }
        if (singleJobObj.jobDistance < jobObj[i].jobDistance && shortest == false) {
          singleJobObj = jobObj[i];
        }
      }
    }
    return singleJobObj;
  }

  calculateSingleJobDistance(singleJobObj) {
    var slotsInLane = grid.getSlotsInLane();
    var costTraversing = 0.1;
    var costPerLane = 1;

    var distance = 0;
    var currentLane = 0;

    for(var j=0;j<singleJobObj.items.length;j++) {
      var singleItem = singleJobObj.items[j];

      var goToLane = Math.floor(singleItem / slotsInLane)+1;
      distance += (goToLane-currentLane)*costTraversing;

      if(goToLane != currentLane){
        distance += costPerLane;
      }
      currentLane = goToLane;
    }
    distance = distance + currentLane * costTraversing;

    return (distance).toFixed(1);
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
var indexController;

$(document).ready(function ($){
  console.log('instantiated index controller');
  indexController = new IndexController($);
})

