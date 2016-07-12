$(document).ready(function() {
  var robot = '#robot',
      $robot = $('#robot'),
      waypoint = '#waypoint',
      slot = '#slot',
      item = '#item',
      slotSize = grid.getSlotPixelSize(),
      currentDirection = "up",
      testWaypoints = [73, 65, 20, 19, 3, 10];

  move.defaults = {
    duration: 800
  };

  var initPosition = function() {
    var $lastWaypointInFirstLane = $('#waypoint-' + (grid.getSlotsInLane()/2));

    $robot.css({
      'display': 'block',
      'margin-top': $lastWaypointInFirstLane.position().top + slotSize + 5,
      'margin-left': $lastWaypointInFirstLane.position().left - (2 * slotSize)
    });
  };

  var moveToWaypoint = function(waypointNr, callback) {
    var rowOffsetTop = $('#waypoint-1').offset().top - slotSize - 35;
    var rowOffsetBottom = $('#waypoint-' + (grid.getSlotsInLane()/2)).offset().top + slotSize + 5;
    var $waypoint = $('#waypoint-' + waypointNr);
    var wpOffsetLeft = $waypoint.offset().left;
    var wpOffsetTop = $waypoint.offset().top;
    var movedToLane = false;
    var movedToSlot = false;
    var movedToOffsetRow = false;

    triggerNextAnimation();

    function triggerNextAnimation() {
      var robotOffsetLeft = $robot.offset().left;
      var robotOffsetTop = $robot.offset().top;
      var isInOffsetRow = (rowOffsetTop >= robotOffsetTop) || (rowOffsetBottom <= robotOffsetTop);

      if (!movedToLane && (wpOffsetLeft > robotOffsetLeft)) {
        switchLane();
      } else if (!movedToSlot && (wpOffsetTop < robotOffsetTop)) {
        moveUpBy((robotOffsetTop - wpOffsetTop));
        currentDirection = "up";
        movedToSlot = true;
      } else if (wpOffsetTop > robotOffsetTop) {
        moveDownBy(!movedToSlot && (wpOffsetTop - robotOffsetTop));
        currentDirection = "down";
        movedToSlot = true;
      } else {
        callback(waypointNr);
      }

      function switchLane() {
        if (!movedToOffsetRow && (!isInOffsetRow && currentDirection === "down")) {
          moveDownBy(rowOffsetBottom - robotOffsetTop);
          movedToOffsetRow = true;
        } else if (!movedToOffsetRow && (!isInOffsetRow && currentDirection === "up")) {
          moveUpBy(robotOffsetTop - rowOffsetTop);
          movedToOffsetRow = true;
        } else {
          moveRightBy(wpOffsetLeft - robotOffsetLeft);
          movedToLane = true;
        }
      }
    }

    function moveRightBy(pixels) {
      move(robot)
        .add('margin-left', pixels)
        .end(triggerNextAnimation);
    }

    function moveDownBy(pixels) {
      move(robot)
        .add('margin-top', pixels)
        .end(triggerNextAnimation);
    }

    function moveUpBy(pixels) {
      move(robot)
        .sub('margin-top', pixels)
        .end(triggerNextAnimation);
    }
  };

  function robotTest() {
    var waypoint = testWaypoints.pop();

    if (waypoint !== undefined) {
      moveToWaypoint(waypoint, robotTest);
    } else {
      celebrate();
    }
  }

  function celebrate() {
    move(robot)
      .rotate(720)
      .end();
  }

  window.setTimeout(function() {
    initPosition();
    robotTest();
  }, 1000);
});