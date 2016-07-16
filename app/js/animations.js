var animations = function(inJobs) {
  var inJobs = inJobs;
  var robot = '#robot',
      $robot = $('#robot'),
      waypoint = '#waypoint',
      slot = '#slot',
      item = '#item',
      slotSize = grid.getSlotPixelSize(),
      currentDirection = "up",
      testJobGroup = {
        groupId: 10,
        items: [2, 87, 89],
        jobDistance: 2.8,
        name: "customer 1"
      },
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
    for(var j=1; j<=Object.keys(jobGroup).length;j++){
      jobGroup[j].items.forEach(function(selected){itemQueue.push(selected)} );

    }
    itemQueue.sort(function(a,b){return a-b});

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

  function showItems(items) {
    for (var i = 0; i < items.length; i++) {
      $('#item-' + items[i]).show();
    }
  }

  function takeItem(itemNr, callback) {
    move('#item-' + itemNr)
      .set('background-color', 'white')
      .duration('1s')
      .end(callback);
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

  function animateNextAction() {
    var nextWaypoint = waypointQueue.shift();
    if (nextWaypoint !== undefined) {
      moveToNextWaypoint(nextWaypoint, takeNextItem);
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
    animateJobGroup(inJobs);
    //robotTest();
  }, 1000);
};