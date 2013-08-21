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
var restitution = 0.25;
var solveIterations = 10;


function initGround() {
    var w;

    w=createRectBody(20, 1, 9, 14, 0, BodyType.Static)
    w.isGround=true;
}
var bb1, bb2, bb3;

function initBodies() {
    var w=3,h=3;
    var idx=0;
    for (var r=0;r<2;r++){
        for (var c=0;c<1;c++){
            // createRectBody(1.5, 1.5, 9+c*2, 7.5+r*1.5-1.5/2, 0)
            if (idx==0){
                var b=createRectBody(w, h-0.5, 9+c*w, 13.5-h/2-r*h, 0)
            }else{
                var b=createRectBody(w, h-0.5, 9+c*w, 13.5-h/2-r*h, 0)
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
        // if (frame===100){
        //    var ball= createCircleBody( 1,0,10.5, 0,null,10);
        //    ball.velAng=0.2;
        //    ball.setForce(20000,-2000);
        // }
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
            var contacts = arbiter.contacts;
            context.strokeStyle = colors[i % 3];
            for (var k = 0; k < contacts.length; k++) {
                var contact = contacts[k];
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