var grid = (function($) {

  var lanes = 7,
      itemsOnLane = 12,
      itemPixelSize = 20,
      waypoints = new Array(lanes);

  this.init = function() {
    for (var lane = 1; lane <= lanes; lane++) {
      waypoints[lane] = new Array(itemsOnLane);

      for (var item = 1; item <= itemsOnLane; item++) {
        waypoints[lane][item] = item;
      }
    }

    renderGrid();
  };

  function renderGrid() {
    for (var lane = 1; lane <= lanes; lane++) {
      for (var item = 1; item <= itemsOnLane; item++) {

        // Waypoint
        $('<div id=' + "waypoint-" + lane + item + '/>').css({
          'position': 'absolute',
          'top': (item * itemPixelSize) + item * 3,
          'margin-left': (3 * lane * itemPixelSize) - 2 * itemPixelSize + lane * 5,
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#fff',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('.grid-container');

        // left Item
        $('<div id=' + "item-left-" + lane + item + '/>').css({
          'position': 'absolute',
          'top': 0,
          'right': itemPixelSize,
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#00BFFF',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('#' + 'waypoint-' + lane + item);

        // Right Item
        $('<div id=' + "item-right-" + lane + item + '/>').css({
          'position': 'absolute',
          'top': 0,
          'left': itemPixelSize,
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#00BFFF',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('#' + 'waypoint-' + lane + item);
      }
    }
  }

  return this;
}(jQuery));