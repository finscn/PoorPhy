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
var gravity = 9;


function initGround() {

    // createRectBody(1, 12, 1, 7.5, 0, BodyType.Static)
    // createRectBody(1, 12, 19, 7.5, 0, BodyType.Static)
    createRectBody(16, 1, 10, 14, 0, BodyType.Static)

    // createCircleBody(10, -7, 8, 0, BodyType.Static)
    // createCircleBody(10, 27, 8, 0, BodyType.Static)
    // createCircleBody(8, 10, 20, 0, BodyType.Static)

}

function initBodies() {

    // var b1 = createRectBody(2, 5, 9.5, 6, 0, null, false);
    // var b2 = createRectBody(3, 1, 12, 4, 0,null, false);
    // var cmp = new Composition({
    //     shapes: [
    //         b1, b2
    //     ]
    // })
    // cmp.init();
    // cmp.setAngle(0.5);
    // world.addBody(cmp);
    var v=createPoly(3,1);
    var b0 = createPolyBody(v, 11, 0.3, Math.PI/6,null);
    var b1 = createRectBody(1.5, 4, 11, 3, 0,null, false);
    var b2 = createCircleBody( 1, 9.5, 5.5, 4, null, null, false);
    var b3 = createCircleBody( 1, 12.5, 5.5, 4, null, null, false);
    var cmp = new Composition({
        shapes: [
            b1, b2, b3
        ]
    })
    cmp.init();
    // cmp.setAngle(-0.2);
    world.addBody(cmp);
    
    // var b=createPolyBody( 7, 2 , 2,-5);

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

    var frame=0;
    var throwBall=true;
    function update() {
        if (frame===100 && throwBall){
           var ball= createCircleBody( 0.6,0,10.5, 20,null,10);
           // ball.velAng=0.2;
           ball.setForce(11000,-3200);
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