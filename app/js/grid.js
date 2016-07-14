var grid = new Grid(8, 24, 40),
    testJobs = {
      1: [19, 38 , 5],
      2: [130, 60, 40],
      3: [94, 49, 146]
    };

function Grid(lanes, slotsInLane, slotSize) {
  this.lanes = lanes;
  this.slotsInLane = slotsInLane;
  this.slotPixelSize = slotSize;
}

Grid.prototype.getLanes = function() {
  return this.lanes;
};

Grid.prototype.getSlotsInLane = function() {
  return this.slotsInLane;
};

Grid.prototype.getSlotPixelSize = function() {
  return this.slotPixelSize;
};

Grid.prototype.getSlotNr = function(lane, slotPositionInLane) {
  return ((lane  - 1) * this.slotsInLane) + slotPositionInLane;
};

Grid.prototype.getWaypointNr = function(slotNr) {
  return Math.ceil(slotNr / 2);
};

Grid.prototype.render = function() {

  renderGrid();

  function renderGrid() {
    var size = grid.getSlotPixelSize();

    for (var lane = 1; lane <= grid.getLanes(); lane++) {
      for (var slot = 1; slot <= grid.getSlotsInLane(); slot++) {

        var slotNr = grid.getSlotNr(lane, slot);
        var waypointNr = grid.getWaypointNr(slotNr);

        if (slot % 2 != 0) {
          // Waypoint
          $('<div id=' + "waypoint-" + waypointNr + '/>').css({
            'position': 'absolute',
            'top': (slot / 2 * size) + slot * 2,
            'left': (3 * lane * size) + (5 * lane) - (2 * size),
            'width': size,
            'height': size,
            'z-index': -1
          }).appendTo('.grid-container');

          // Left Slot
          $('<div id=' + "slot-" + slotNr + '/>').css({
            'position': 'absolute',
            'top': 0,
            'right': size,
            'width': size,
            'height': size,
            'color': '#00BFFF',
            'border': '1px',
            'border-style': 'solid',
            'z-index': -1
          }).appendTo('#waypoint-' + waypointNr);
        } else {
          // Right Slot
          $('<div id=' + "slot-" + slotNr + '/>').css({
            'position': 'absolute',
            'top': 0,
            'left': size,
            'width': size,
            'height': size,
            'color': '#00BFFF',
            'border': '1px',
            'border-style': 'solid',
            'z-index': -1
          }).appendTo('#waypoint-' + waypointNr);
        }
        // Item
        $('<div id=' + "item-" + slotNr + '/>').css({
          'position': 'absolute',
          'display': 'none',
          'top': 2,
          'left': 2,
          'width': size - 6,
          'height': size - 6,
          'color': '#3CB371',
          'background-color': '#3CB371',
          'border': '1px',
          'border-style': 'solid',
          'border-radius': 30
        }).appendTo('#slot-' + slotNr);
      }
    }
  }
};