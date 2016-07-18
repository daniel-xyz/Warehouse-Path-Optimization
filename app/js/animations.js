var animations = function(inJobs) {
  var inJobs = inJobs;
  var robot = '#robot',
      $robot = $('#robot'),
      waypoint = '#waypoint',
      slot = '#slot',
      item = '#item',
      slotSize = grid.getSlotPixelSize(),
      lanes = grid.getLanes(),
      currentDirection = "up",
      lastWaypoint = null,
      lastItem = null,
      unsortedItemQueue = [],
      itemQueue = [],
      waypointQueue = [];

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

  var animateJobGroup = function(jobGroup) {
    for(var j=1; j<=Object.keys(jobGroup).length;j++) {
      jobGroup[j].items.forEach(function(selected) {
        unsortedItemQueue.push(parseInt(selected))
      });
    }

    sortItemQueue(unsortedItemQueue);

    console.log(itemQueue);
    console.log("Items in animation queue aufgenommen: " + itemQueue);
  
    for (var i = 0; i < itemQueue.length; i++) {
      waypointQueue[i] = grid.getWaypointNr(itemQueue[i]);
    }

    console.log("Waypoints in animation queue aufgenommen: " + waypointQueue);

    showItems(itemQueue);
    initPosition();
    animateNextAction();
  };

  function sortItemQueue(unsortedItemQueue) {
    var slotsInLane = grid.getSlotsInLane(),
        upMovement = true;

    for (var lane = 1; lane <= lanes; lane++) {
      var laneQueue = [];

      unsortedItemQueue.forEach(function(item){
        if (((lane * slotsInLane) >= item) && (item > ((lane * slotsInLane) - slotsInLane))) {
          laneQueue.push(item);
        }
      });

      if (laneQueue.length > 0) {
        if (upMovement) {
          laneQueue.sort(function(a,b){return b-a});
          upMovement = false;
        } else {
          laneQueue.sort(function(a,b){return a-b});
          upMovement = true;
        }

        laneQueue.forEach(function(item){
          itemQueue.push(item);
        });
      }
    }
  }

  function showItems(items) {
    for (var i = 0; i < items.length; i++) {
      $('#item-' + items[i]).show();
    }
  }

  function takeItem(itemNr, callback) {
    if (lastItem === itemNr) {
      callback();
    } else {
      lastItem = itemNr;
      move('#item-' + itemNr)
        .set('opacity', '0')
        .duration('0.3s')
        .end(callback);
    }
  }

  function takeNextItem() {
    var nextItem = itemQueue.shift();

    if (nextItem !== undefined) {
      takeItem(nextItem, animateNextAction);
    }
  }

  var moveToNextWaypoint = function(waypointNr, callback) {
    var rowOffsetTop = $('#waypoint-1').offset().top - slotSize - 35,
        rowOffsetBottom = $('#waypoint-' + (grid.getSlotsInLane()/2)).offset().top + slotSize + 5,
        $waypoint = $('#waypoint-' + waypointNr),
        wpOffsetLeft = $waypoint.offset().left - 5,
        wpOffsetTop = $waypoint.offset().top,
        movedToLane = false,
        movedToSlot = false,
        movedToOffsetRow = false;

    triggerNextAnimation();

    function triggerNextAnimation() {
      var robotOffsetLeft = $robot.offset().left,
          robotOffsetTop = $robot.offset().top,
          isInOffsetRow = (rowOffsetTop >= robotOffsetTop) || (rowOffsetBottom <= robotOffsetTop);

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
        lastWaypoint = waypointNr;
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

  function moveToEnd(callback) {
    var $lastWaypointInFirstLane = $('#waypoint-' + (grid.getSlotsInLane()/2)),
        offsetBottom = ($lastWaypointInFirstLane.offset().top + slotSize + 5) - $robot.offset().top,
        offsetRight = $robot.offset().left - ($lastWaypointInFirstLane.offset().left - (2 * slotSize)),
        moveLeft = move(robot)
          .sub('margin-left', offsetRight)
          .then(callback);

      move(robot)
        .add('margin-top', offsetBottom)
        .then(moveLeft)
        .end();
  }

  function animateNextAction() {
    var nextWaypoint = waypointQueue.shift();

    if (nextWaypoint !== undefined) {
      if (nextWaypoint === lastWaypoint) {
        takeNextItem();
      } else {
        moveToNextWaypoint(nextWaypoint, takeNextItem);
      }
    } else {
      moveToEnd(celebrate);
    }
  }

  function celebrate() {

    move(robot)
      .rotate(720)
      .end();
  }

  window.setTimeout(function() {
    initPosition();
    animateJobGroup(inJobs);
    //robotTest();
  }, 1000);
};