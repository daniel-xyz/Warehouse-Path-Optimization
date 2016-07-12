$(document).ready(function() {
  var robot = '#robot',
      waypoint = '#waypoint',
      slot = '#slot',
      item = '#item',
      slotSize = grid.getSlotPixelSize();

  var moveUp = move(robot)
    .sub('margin-top', 50);

  var moveDown = move(robot)
    .add('margin-top', 50);

  var moveRight = move(robot)
    .add('margin-left', 50);

  var moveLeft = move(robot)
    .sub('margin-left', 50);

  var initPosition = function() {
    var startPosition = grid.getStartingPoint();
  };

  var testMove = function(lines) {
    move(robot)
      .add('margin-left', lines * slotSize)
      .then(moveDown)
      .end();
  };

  window.setTimeout(function() {
    initPosition();
    testMove(1);
  }, 1000);

  //setInterval(function() {
  //  testMove();
  //}, 1000);
});