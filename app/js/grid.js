var grid = (function($) {

  var lanes = 7,
      slotsInLane = 12,
      itemsTotal = lanes * slotsInLane,
      itemPixelSize = 20,
      waypoints = new Array(lanes),
      itemPositions = ['Äpfel', 'Birnen', 'Salate', 'Bananen', 'Melonen'];

  this.init = function() {
    generateWaypoints();
    setItemPositions();
    renderGrid();
  };

  function generateWaypoints() {
    for (var lane = 1; lane <= lanes; lane++) {
      waypoints[lane] = new Array(slotsInLane);

      for (var slot = 1; slot <= slotsInLane; slot++) {
        waypoints[lane][slot] = slot;
      }
    }
  }

  function setItemPositions() {
    for(var item in itemPositions) {
      if (itemPositions.hasOwnProperty(item)) {
        itemPositions[item] = getRandomPosition();
      }
    }
  }

  function renderGrid() {
    for (var lane = 1; lane < waypoints.length; lane++) {
      for (var slot = 1; slot < waypoints[lane].length; slot++) {

        var dynamicSelector = lane + "-" + slot;

        // Waypoint
        $('<div id=' + "waypoint-" + dynamicSelector + '/>').css({
          'position': 'absolute',
          'top': (slot * itemPixelSize) + slot * 3,
          'margin-left': (3 * lane * itemPixelSize) + (5 * lane) - (2 * itemPixelSize),
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#fff',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('.grid-container');

        // Left Item Slot
        $('<div id=' + "slot-left-" + dynamicSelector + '/>').css({
          'position': 'absolute',
          'top': 0,
          'right': itemPixelSize,
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#00BFFF',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('#waypoint-' + dynamicSelector);

        // Right Item Slot
        $('<div id=' + "slot-right-" + dynamicSelector + '/>').css({
          'position': 'absolute',
          'top': 0,
          'left': itemPixelSize,
          'width': itemPixelSize,
          'height': itemPixelSize,
          'color': '#00BFFF',
          'border': '1px',
          'border-style': 'solid'
        }).appendTo('#waypoint-' + dynamicSelector);
      }
    }

    for(var item in itemPositions) {
      if (itemPositions.hasOwnProperty(item)) {

        var laneNr = getLaneNr(itemPositions[item]);
        var slotNr = getSlotNr(itemPositions[item]);
        var availableSlots = ['right', 'left'];
        var randomSlot = availableSlots[Math.floor(Math.random() * (1 + 1))];
        var position = laneNr + "-" + slotNr;

        $('<div id=' + "item-" + position + '/>').css({
          'position': 'absolute',
          'top': 2,
          'left': 2,
          'width': itemPixelSize - 6,
          'height': itemPixelSize - 6,
          'color': '#3CB371',
          'background-color': '#3CB371',
          'border': '1px',
          'border-style': 'solid',
          'border-radius': 30
        }).appendTo('#slot-' + randomSlot + '-' + position);
      }
    }
  }

  function getLaneNr(absolutePosition) {
    return Math.ceil(absolutePosition / slotsInLane);
  }

  function getSlotNr(absolutePosition) {
    if (absolutePosition % slotsInLane === 0) {
      return slotsInLane;
    } else {
      return absolutePosition % slotsInLane;
    }
  }

  function getRandomPosition() {
    return Math.floor(Math.random() * (itemsTotal - 1) + 1);
  }

  return this;
}(jQuery));