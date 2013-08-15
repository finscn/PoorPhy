var world, demo;
var canvas, context;
var FPS = 60;
var timeStep = 1 / 60;
var RENDER_SCALE = 30;
var scale = 1;
var allowSleep = true;
var notSolve = false;

var gravity = 10;
var damping = 0;

var linearSlop = 0; //0.005;
var angularSlop = 2.0 / 180.0 * Math.PI;

var friction = 0.3;
var restitution = 0.2;
var solveIterations = 5;


function initGround() {
    var w;

    w=createRectBody(1, 12, 1, 5, 0, BodyType.Static)
    w.velAng=-0.3;
    w=createRectBody(1, 12, 19, 5, 0, BodyType.Static)
    w=createRectBody(20, 1, 10, 14, 0.1, BodyType.Static)

    // createCircleBody(10, -7, 8, 0, BodyType.Static)
    // createCircleBody(10, 27, 8, 0, BodyType.Static)
    // createCircleBody(8, 10, 20, 0, BodyType.Static)

}
var bb1, bb2, bb3;

function initBodies() {



}


function createRandomShape(w,h,x,y){
    var r=(w+h)/2/2;
    var i=randomInt(0,2);
    var shape;
    switch(i){
        case 0:
            shape=createCircleBody( r,x,y, randomInt(100,314)/100 );
            break;
        case 1:
            shape=createRectBody(w,h,x,y, randomInt(100,314)/100 );
            break;
        case 2:
            var v=createRandomPoly( randomInt(3,8),w,h);
            shape=createPolyBody(v,x,y, randomInt(100,314)/100 );
            break;
    }
    return shape;
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


    var count=0; var x=0;
    var frame=0;
    function update() {
        if (frame%100===0){
            if (x>8){
                x=0;
            }
            x=x+randomInt(2,3.5);
            createRandomShape(2.5,2.5, x+2, randomInt(-3,-1));
        }
        frame++;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // console.log(bb1.velY, bb1.velY*timeStep,bb1.y)

        world.step(timeStep);

        var bodies = world.bodies;

        // drawPoint(context, 10, 7)
        for (var i = 0, body; body = bodies[i++];) {
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