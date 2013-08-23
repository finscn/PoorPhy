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

    createRectBody(1, 12, 1, 7.5, 0, BodyType.Static)
    createRectBody(1, 12, 19, 7.5, 0, BodyType.Static)
    createRectBody(20, 1, 10, 14, 0, BodyType.Static)

    // createCircleBody(10, -7, 8, 0, BodyType.Static)
    // createCircleBody(10, 27, 8, 0, BodyType.Static)
    // createCircleBody(8, 10, 20, 0, BodyType.Static)

}

function initBodies() {

    var b1 = createRectBody(2, 5, 9.5, 4, 0, null, false);
    var b2 = createRectBody(3, 1, 12, 2, 0,null, false);
    var cmp = new Composition({
        shapes: [
            b1, b2
        ]
    })
    cmp.init();
    cmp.setAngle(0.5)
    world.addBody(cmp);
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

    function update() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        // cmp.update(1 / 60)
        // drawPoly(context, cmp, "red");
        // drawPoint(context, cmp.x, cmp.y);


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