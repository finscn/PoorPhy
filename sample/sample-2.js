var world, demo;
var canvas, context;
var FPS = 60;
var timeStep = 1 / 60;
var RENDER_SCALE = 30;
var scale = 1;
var notSolve = false;
var allowSleep = false;

var solveIterations = 10;
var damping = 0.05;
var dampingAng = 0.05;
var friction = 0.3;
var restitution = 0.25;
var gravity = 9.5;

function initGround() {
    var w;
    w=createRectBody(20, 1, 9, 14, 0, BodyType.Static)
    w.isGround=true;
}
var bb1, bb2, bb3;

var throwBall=true;
function initBodies() {
    var w=1.5,h=1.5;
    var space=0.5;
    var idx=0;
    for (var r=0;r<4;r++){
        for (var c=0;c<4;c++){
            // createRectBody(1.5, 1.5, 9+c*2, 7.5+r*1.5-1.5/2, 0)
            if (idx==0){
                var b=createRectBody(w, h, 9+c*(w+space), 13.5-h/2-r*h, 0)
            }else{
                var b=createRectBody(w, h, 9+c*(w+space), 13.5-h/2-r*h, 0)
            }
            idx++
            b.id=idx;
        }
    }

}



function init() {

    world = new World({
        gravityY: gravity,
        allowSleep: allowSleep
    });
    world.init();
    world.solveIterations = solveIterations;
    world.collideManager.notSolve = notSolve;

    initRender();
    initGround();
    initBodies();


    var count=0; var x=0;
    var frame=0;
    function update() {
        if (frame===100 && throwBall){
           var ball= createCircleBody( 1,0,10.5, 0,null,10);
           // ball.velAng=0.2;
           ball.setForce(20000,-2000);
        }
        frame++;

        context.clearRect(0, 0, canvas.width, canvas.height);

        world.step(timeStep);

        var bodies = world.bodies;
        drawBodies(context,bodies);

        // drawArbiter(context,world.collideManager);
        
    };


    window.setInterval(update, 1000 / FPS);

};

function initRender() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")
}

Body.prototype.friction = friction;
Body.prototype.restitution = restitution;
Body.prototype.damping = damping;
Body.prototype.dampingAng = dampingAng;
Circle.prototype.friction = friction;
Circle.prototype.restitution = restitution;
Circle.prototype.damping = damping;
Circle.prototype.dampingAng = dampingAng;
Polygon.prototype.friction = friction;
Polygon.prototype.restitution = restitution;
Polygon.prototype.damping = damping;
Polygon.prototype.dampingAng = dampingAng;
Segment.prototype.friction = friction;
Segment.prototype.restitution = restitution;
Segment.prototype.damping = damping;
Segment.prototype.dampingAng = dampingAng;
Composition.prototype.friction = friction;
Composition.prototype.restitution = restitution;
Composition.prototype.damping = damping;
Composition.prototype.dampingAng = dampingAng;