"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by jkoop_000 on 03.07.2016.
 */
//export default FileLoader

var FileLoader = function () {
  function FileLoader(inEvent) {
    _classCallCheck(this, FileLoader);

    this.file = inEvent.target;
    this.loadFile(inEvent.target);
  }

  _createClass(FileLoader, [{
    key: "loadFile",
    value: function loadFile(inFile) {
      /*
      var allText = "";
      var rawFile = new XMLHttpRequest();
      rawFile.open("GET", 'http://localhost/jobfiles/jobs.txt', false);
      rawFile.onreadystatechange = function ()
      {
        if(rawFile.readyState === 4)
        {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
            allText = rawFile.responseText;
          }
        }
      }
      rawFile.send(null);
      alert(JSON.parse(allText) );
      return JSON.parse(allText);
      */
      var reader = new FileReader();
      reader.readAsText(inFile);
      reader.onload = function (e) {
        alert(e.target.res);
      };
    }
  }]);

  return FileLoader;
}();

;