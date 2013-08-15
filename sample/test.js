var world, demo;
var canvas, context;
var FPS = 60;
var timeStep = 1 / 60;
var RENDER_SCALE = 30;
var scale = 1;
var allowSleep = false;
var notSolve = false;

var gravity = 10;
var friction = 0.5;
var damping = 0;

var linearSlop= 0;//0.005;
var angularSlop = 2.0 / 180.0 * Math.PI;

var restitution = 0;//0.3;
var solveIterations=1//6;


function initGround() {

    // createRectBody(1,12,1,7.5,0,BodyType.Static)
    // createRectBody(1,12,19,7.5,0,BodyType.Static)
    createRectBody(20,1,10,14,0,BodyType.Static)

    // createCircleBody(10, -7, 8, 0, BodyType.Static)
    // createCircleBody(10, 27, 8, 0, BodyType.Static)
    // createCircleBody(8, 10, 20, 0, BodyType.Static)

}
var bb1, bb2, bb3;

function initBodies() {

    // bb1=createRectBody(3,1,5,9,0);
    bb2=createRectBody(4,2,7,4.5,0);

    // bb3 = createCircleBody(1.5, 5, 9)
    // bb3 = createCircleBody(1, 6, 5)
    // bb3 = createCircleBody(1, 10, 7)
    // bb3 = createCircleBody(1.5, 15, 6)

}


function init() {

    world = new World({
        gravityY: gravity,
        allowSleep: allowSleep
    });
    world.init();
    world.collideManager.notSolve = notSolve;
    world.collideManager.solveIterations = solveIterations;

    initRender();
    initGround();
    initBodies();


    function update() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        // console.log(bb1.velY, bb1.velY*timeStep,bb1.y)

        world.step(timeStep);

        var bodies = world.bodies;

        for (var i = 0, body; body = bodies[i++];) {
            drawPoint(context, 10, 7)
            var color = body.sleeping ? "#dddddd" : "#ff3300";
            if (body.shapeType == ShapeType.Poly) {
                drawPoly(context, body, color);
            } else if (body.shapeType == ShapeType.Circle) {
                drawCircle(context, body, color);
            }
        }

        renderContacts();
    };

    function renderContacts() {
        var colors = ["#66ff66", "#ff66ff", "#6666ff"];
        var colors = ["#33ff66"];
        var coll = world.collideManager;

        var arbiters = coll.arbiters;

        var arbiterCount = coll.arbiterCount;
        for (var i = 0; i < arbiterCount; i++) {
            var arbiter = arbiters[i];
            var contactPairs = arbiter.contactPairs;
            context.strokeStyle = colors[i % 3];
            for (var k = 0; k < contactPairs.length; k++) {
                var contact = contactPairs[k];
                var p1 = contact.contactOnA,
                    p2 = contact.contactOnB;
                context.strokeRect(p1[0] * RENDER_SCALE - 2, p1[1] * RENDER_SCALE - 2, 4, 4);
                context.strokeRect(p2[0] * RENDER_SCALE - 2, p2[1] * RENDER_SCALE - 2, 4, 4);
            }

        }
    }
    window.setInterval(update, 1000 / FPS);

};

function initRender() {
    canvas = document.getElementById("canvas")
    context = canvas.getContext("2d")
}

Body.prototype.friction = friction;
Body.prototype.restitution = restitution;
Body.prototype.damping = damping;
Circle.prototype.friction = friction;
Circle.prototype.restitution = restitution;
Circle.prototype.damping = damping;
Polygon.prototype.friction = friction;
Polygon.prototype.restitution = restitution;
Polygon.prototype.damping = damping;