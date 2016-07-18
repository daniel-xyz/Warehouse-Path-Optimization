'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by jkoop_000 on 03.07.2016.
 */
//var FileLoader = require('FileLoader');
//import FileLoader from 'FileLoader';

var IndexController = function () {
  function IndexController($) {
    _classCallCheck(this, IndexController);

    var $ = $;
    var jobObj;
  }

  _createClass(IndexController, [{
    key: 'readSingleFile',
    value: function readSingleFile(e) {

      var reader = new FileReader();

      reader.onloadend = function (e) {
        document.getElementById('job-container').value = e.target.result;
      };

      reader.readAsText(e.files[0]);
    }
  }, {
    key: 'generateJobs',
    value: function generateJobs() {
      var generatedData = 'name,item1,item2,item3,item4,item5,item6\n';
      for (var i = 1; i <= 10; i++) {
        var items = Math.round(Math.random() * 3) + 3;

        generatedData += 'customer' + i + ',';

        for (var j = 0; j < items; j++) {
          generatedData += Math.round(Math.random() * (grid.getSlotsInLane() * grid.getLanes() - 1)) + ',';
        }
        generatedData = generatedData.substring(0, generatedData.length - 1) + '\n';
      }
      generatedData = generatedData.substring(0, generatedData.length - 1);
      document.getElementById('job-container').value = generatedData;
    }
  }, {
    key: 'calculateJobDistance',
    value: function calculateJobDistance() {
      this.jobObj = this.processData(document.getElementById('job-container').value);
      //for(var singleJobObj of jobObj) {

      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        var singleJobObj = this.jobObj[i];

        this.jobObj[i].jobDistance = this.calculateSingleJobDistance(singleJobObj);
      }

      if (document.getElementById('ruleShortest').checked == true) {
        this.groupJobsPerDistance();
      }
      if (document.getElementById('ruleAlley').checked == true) {
        this.groupJobsPerAlley();
      }

      this.calculateGroupDistance();
      this.printTable();
    }
  }, {
    key: 'calculateGroupDistance',
    value: function calculateGroupDistance() {
      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        var singleJobObj = this.jobObj[i];
        var selectedJobs = this.getJobsWithGroupId(singleJobObj.groupId);
        var groupJob = {};
        groupJob.items = [];

        for (var j = 1; j <= Object.keys(selectedJobs).length; j++) {
          selectedJobs[j].items.forEach(function (singleItem) {
            groupJob.items.push(singleItem);
          });
        }
        singleJobObj.groupDistance = this.calculateSingleJobDistance(groupJob);
      }
    }
  }, {
    key: 'printTable',
    value: function printTable() {
      var jobsPerGroup = document.getElementById('jobsPerGroup').value;
      var groupCount = Math.ceil((Object.keys(this.jobObj).length / jobsPerGroup).toFixed(2));

      var groupsPrinted = [];
      var tableContent = '<table>' + '<tr>' + '<td>Id</td>' + '<td>Group</td>' + '<td>Name</td>' + '<td>Items</td>' + '<td>Alley</td>' + '<td>JDistance</td>' + '<td>GDistance</td>' + '</tr>\n';

      for (var j = 1; j <= groupCount; j++) {
        var jobsWithGroupId = this.getJobsWithGroupId(j);

        for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
          if (typeof jobsWithGroupId[i] != 'undefined') {

            var jobWithGroupId = jobsWithGroupId[i];

            tableContent += '<tr>' + '<td>' + i + '</td>' + '<td>' + jobWithGroupId.groupId + '</td>' + '<td>' + jobWithGroupId.name + '</td>' + '<td>' + jobWithGroupId.items + '</td>' + '<td>' + jobWithGroupId.alley + '</td>' + '<td>' + jobWithGroupId.jobDistance + '</td>';
            if (groupsPrinted.indexOf(jobWithGroupId.groupId) == -1) {
              tableContent += '<td>' + jobWithGroupId.groupDistance + '</td>';
            } else {
              tableContent += '<td></td>';
            }
            if (groupsPrinted.indexOf(jobWithGroupId.groupId) == -1) {
              tableContent += '<td><input type="Button" value="start" onclick="new animations(indexController.getJobsWithGroupId(' + jobsWithGroupId[i].groupId + '))"))"></input></td>';
            }
            tableContent += '</tr>';
            groupsPrinted.push(jobsWithGroupId[i].groupId);
          }
        }
      }
      tableContent += '<tr>' + '<td></td><td></td><td></td><td></td><td></td><td>' + this.sumJobDistance() + '</td><td>' + this.sumGroupDistance() + '</td>' + '</tr>' + '</table>';

      document.getElementById('optimizedJobTable').innerHTML = tableContent;
    }
  }, {
    key: 'sumJobDistance',
    value: function sumJobDistance() {
      var sumDistance = 0;
      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        sumDistance += parseFloat(this.jobObj[i].jobDistance);
      }
      return sumDistance.toFixed(1);
    }
  }, {
    key: 'sumGroupDistance',
    value: function sumGroupDistance() {
      var jobsPerGroup = document.getElementById('jobsPerGroup').value;
      var groupCount = Math.ceil((Object.keys(this.jobObj).length / jobsPerGroup).toFixed(2));
      var sumDistance = 0;

      for (var i = 1; i <= groupCount; i++) {
        for (var j = 1; j <= Object.keys(this.jobObj).length; j++) {
          var selectedObj = this.jobObj[j];

          if (selectedObj.groupId == i) {
            sumDistance += parseFloat(selectedObj.groupDistance);
            break;
          }
        }
      }
      return sumDistance.toFixed(1);
    }
  }, {
    key: 'getJobsWithGroupId',
    value: function getJobsWithGroupId(groupId) {
      var jobsWithSameGroupId = {};
      var j = 0;
      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        if (this.jobObj[i].groupId == groupId) {
          j++;
          jobsWithSameGroupId[j] = this.jobObj[i];
        }
      }
      return jobsWithSameGroupId;
    }
  }, {
    key: 'groupJobsPerDistance',
    value: function groupJobsPerDistance() {
      var jobsPerGroup = document.getElementById('jobsPerGroup').value;
      var groupCount = Math.ceil((Object.keys(this.jobObj).length / jobsPerGroup).toFixed(2));
      var jobsAmount = Object.keys(this.jobObj).length;

      for (var i = 1; i <= groupCount; i++) {
        var currentJob = this.findShortestPathObj(this.jobObj, false);
        currentJob.groupId = i;

        for (var k = 0; k < jobsPerGroup - 1; k++) {
          var possibleJobPartners = this.getAllUngroupedJobs();
          var compoundDistance = 1000;
          var selectedJobPartnerId = void 0;

          for (var j = 1; j <= Object.keys(this.jobObj).length; j++) {
            if (typeof possibleJobPartners[j] != 'undefined') {
              var joinedItems = {};
              joinedItems.items = possibleJobPartners[j].items.concat(currentJob.items);
              joinedItems.items.sort(function (a, b) {
                return a - b;
              });
              if (this.calculateSingleJobDistance(joinedItems) < compoundDistance) {
                compoundDistance = this.calculateSingleJobDistance(joinedItems);
                selectedJobPartnerId = j;
              }
            }
          }
          if (typeof this.jobObj[selectedJobPartnerId] != 'undefined') {
            this.jobObj[selectedJobPartnerId].groupId = i;
          }
        }
      }
    }
  }, {
    key: 'groupJobsPerAlley',
    value: function groupJobsPerAlley() {
      var jobsPerGroup = document.getElementById('jobsPerGroup').value;
      var groupCount = Math.ceil((Object.keys(this.jobObj).length / jobsPerGroup).toFixed(2));
      var jobsAmount = Object.keys(this.jobObj).length;

      this.calculateAlleys();

      for (var i = 1; i <= groupCount; i++) {
        var selectedJob = this.getFirstExistingJob(this.getAllUngroupedJobs());
        selectedJob.groupId = i;

        for (var j = 1; j < jobsPerGroup; j++) {
          var mostSimilarJob = this.findMostSimilarJob(selectedJob);
          if (typeof mostSimilarJob != 'undefined') {
            mostSimilarJob.groupId = i;
          }
        }
      }
    }
  }, {
    key: 'findMostSimilarJob',
    value: function findMostSimilarJob(sourceJob) {
      var ungroupedJobs = this.getAllUngroupedJobs();

      var bestMatchingJob = void 0;
      var lastMatchCount = 0;

      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        if (typeof ungroupedJobs[i] != 'undefined') {

          var ungroupedJob = ungroupedJobs[i];
          var currentMatchCount = 0;

          for (var j = 0; j < ungroupedJob.alley.length; j++) {

            var singleSourceTarget = ungroupedJob.alley[j];
            if (sourceJob.alley.indexOf(singleSourceTarget) != -1) {
              currentMatchCount++;
            }

            if (currentMatchCount > lastMatchCount) {
              bestMatchingJob = ungroupedJob;
              lastMatchCount = currentMatchCount;
            }
          }
        }
      }
      if (typeof bestMatchingJob == 'undefined') {
        bestMatchingJob = this.getFirstExistingJob(this.getAllUngroupedJobs());
      }
      return bestMatchingJob;
    }
  }, {
    key: 'calculateAlleys',
    value: function calculateAlleys() {

      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        var singleJob = this.jobObj[i];
        singleJob.alley = [];
        for (var j = 0; j < singleJob.items.length; j++) {
          var singleItem = singleJob.items[j];

          this.jobObj[i].alley.push(Math.floor(singleItem / grid.getSlotsInLane()) + 1);
        }
      }
    }
  }, {
    key: 'getAllUngroupedJobs',
    value: function getAllUngroupedJobs() {
      var ungroupedJobs = {};
      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        if (typeof this.jobObj[i].groupId == 'undefined') {
          ungroupedJobs[i] = this.jobObj[i];
        }
      }
      return ungroupedJobs;
    }
  }, {
    key: 'getFirstExistingJob',
    value: function getFirstExistingJob(inJobs) {
      for (var i = 1; i <= Object.keys(this.jobObj).length; i++) {
        if (typeof inJobs[i] != 'undefined') {
          return inJobs[i];
        }
      }
    }
  }, {
    key: 'findShortestPathObj',
    value: function findShortestPathObj(jobObj, shortest) {
      var singleJobObj = jobObj[1];

      for (var j = 1; j <= Object.keys(jobObj).length; j++) {
        if (typeof jobObj[j].groupId == 'undefined') {
          singleJobObj = jobObj[j];
          continue;
        }
      }

      for (var i = 1; i <= Object.keys(jobObj).length; i++) {
        if (typeof jobObj[i].groupId == 'undefined') {
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
  }, {
    key: 'calculateSingleJobDistance',
    value: function calculateSingleJobDistance(singleJobObj) {
      var slotsInLane = grid.getSlotsInLane();
      var costTraversing = 0.1;
      var costPerLane = 1;

      var distance = 0;
      var currentLane = 0;

      for (var j = 0; j < singleJobObj.items.length; j++) {
        var singleItem = singleJobObj.items[j];

        var goToLane = Math.floor(singleItem / slotsInLane) + 1;
        distance += (goToLane - currentLane) * costTraversing;

        if (goToLane != currentLane) {
          distance += costPerLane;
        }
        currentLane = goToLane;
      }
      distance = distance + currentLane * costTraversing;

      return distance.toFixed(1);
    }
  }, {
    key: 'processData',
    value: function processData(allText) {
      var allTextLines = allText.split(/\r\n|\n/);
      var headers = allTextLines[0].split(',');
      var obj = {};

      for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        var tarr = {};
        tarr['items'] = [];

        for (var j = 0; j < data.length; j++) {

          if (headers[j].search('item') != -1) {
            tarr['items'].push(data[j]);
            tarr['items'].sort(function (a, b) {
              return a - b;
            });
          } else {
            tarr[headers[j]] = data[j];
          }
        }
        obj[i] = tarr;
      }
      return obj;
    }
  }]);

  return IndexController;
}();

var indexController;

$(document).ready(function ($) {
  indexController = new IndexController($);
});