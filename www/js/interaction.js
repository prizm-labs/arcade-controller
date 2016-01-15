function bindHandlers( elementId, socket ) {

  var myElement2 = document.getElementById(elementId);
  var mc2 = new Hammer.Manager(myElement2);

  var pan1 = new Hammer.Pan({
    event: 'pan1',
    pointers: 1,
    direction: Hammer.DIRECTION_ALL
  });

  var rotateA = new Hammer.Rotate({
    event:'rotate',
    pointers: 2
  });

  rotateA.recognizeWith(pan1);
  pan1.requireFailure(rotateA);

  mc2.add([rotateA,pan1]);

  mc2.currentAngle = 0;

  function moveStart(ev) {
    mc2.lastX = ev.center.x;
    mc2.lastY = ev.center.y;
    if (mc2.currentTween) mc2.currentTween.kill();
  }

  function moveUpdate(ev) {
    var deltaX = mc2.lastX-ev.center.x;
    var deltaY = mc2.lastY-ev.center.y;

   var newX = parseInt(ev.target.offsetLeft)-deltaX;
   var newY = parseInt(ev.target.offsetTop)-deltaY;

      $(ev.target).css({
        "left":newX,
        "top":newY
      })

    mc2.lastX = ev.center.x;
    mc2.lastY = ev.center.y;
  }

  mc2.on("pan1start pan2start", function(ev) {
    moveStart(ev);
  });

  mc2.on("pan1move pan2move", function(ev) {
    moveUpdate(ev);

    socket.emit('fromHandheld', {velocity:ev.velocity,angle:ev.angle}, function (data) {
      console.log(data); // data will be 'woot'
    });
  });

  mc2.on("pan1end pan2end", function(ev) {

    var v = ev.velocity;
    var vX = Math.abs(ev.velocityX)<Math.abs(ev.overallVelocityX) ? ev.overallVelocityX : ev.velocityX;
    var vY = Math.abs(ev.velocityY)<Math.abs(ev.overallVelocityY) ? ev.overallVelocityY : ev.velocityY;
    var decel = 1; // distance per second squared
    var time = Math.abs(v) / decel;

    var coefficient = 300;
    // d = v^2 / 2a

    // get time travelled
    // get destination x
    var dX = Math.pow(vX,2) / (2*decel) * coefficient;
    dX = (ev.velocityX>0) ? dX : -dX;
    // get destination y
    var dY = Math.pow(vY,2) / (2*decel) * coefficient;
    dY = (ev.velocityY>0) ? dY : -dY;

    var finalX = ev.target.offsetLeft+dX, finalY = ev.target.offsetTop+dY;

    // get animation handler to cancel on new event start
    mc2.currentTween = TweenLite.to(ev.target, time, {left:finalX+"px",top:finalY+"px",
      onUpdate: function(){
        // prevent object from leaving bounds
        if ((ev.target.offsetLeft<=0) || (ev.target.offsetTop<=0)) {
           mc2.currentTween.kill();
        }
      }
    });
  });

  mc2.on("rotatestart",function(ev){
    mc2.rotationLast = ev.rotation;
    moveStart(ev);
  });

  mc2.on("rotatemove",function(ev){

    var isCW = ev.rotation > mc2.rotationLast;

    var delta = Math.abs(ev.rotation-mc2.rotationLast);

    // depending on the order of touches
    // ev.rotation jumps from ~-50 to ~300
    if (delta>100) delta=5; // handle ev.rotation jump

    if (!isCW) {
      mc2.currentAngle-=delta;
    } else {
      mc2.currentAngle+=delta;
    }

    performRotation(ev.target,mc2.currentAngle,ev);

    mc2.rotationLast = ev.rotation;
  });

  mc2.on("rotateend",function(ev){

  });


  function performRotation(target,angle,ev) {

    this.options = {

      rotationCenterX: 50,
      rotationCenterY: 50
    };

    this.element = $(target);

    moveUpdate(ev);

    this.element.css('transform-origin', this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%');
    this.element.css('-ms-transform-origin', this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%'); /* IE 9 */
    this.element.css(
      '-webkit-transform-origin',
      this.options.rotationCenterX + '% ' + this.options.rotationCenterY + '%'); /* Chrome, Safari, Opera */

    this.element.css('transform','rotate(' + angle + 'deg)');
    this.element.css('-moz-transform','rotate(' + angle + 'deg)');
    this.element.css('-webkit-transform','rotate(' + angle + 'deg)');
    this.element.css('-o-transform','rotate(' + angle + 'deg)');
  }

}
