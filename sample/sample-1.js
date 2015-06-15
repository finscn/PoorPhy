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


(function() {


    var Body = PP.Body;
    var BodyType = PP.BodyType;
    var Circle = PP.Circle;
    var Polygon = PP.Polygon;
    var Segment = PP.Segment;
    var Composition = PP.Composition;
    var World = PP.World;

    function initGround() {
        var w;
        w = createRectBody(1, 6, 12, 6, 0, BodyType.Static)
        w.velAng = 0.3;
        w = createSegmentBody(10, 1, 5, 0, BodyType.Static)
        w.velAng = -0.3;
        w = createRectBody(1, 12, 19, 5, 0, BodyType.Static)
        w = createRectBody(20, 1, 10, 14, 0.1, BodyType.Static)

        // createCircleBody(10, -7, 8, 0, BodyType.Static)
        // createCircleBody(10, 27, 8, 0, BodyType.Static)
        // createCircleBody(8, 10, 20, 0, BodyType.Static)

    }
    var bb1, bb2, bb3;

    function initBodies() {



    }



    window.init=function() {

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


        var count = 0;
        var x = 0;
        var frame = 0;

        function update() {
            if (frame % 100 === 0) {
                if (x > 8) {
                    x = 0;
                }
                x = x + randomInt(2, 3.5);
                createRandomShape(2.5, 2.5, x + 2, randomInt(-3, -1));
            }
            frame++;

            context.clearRect(0, 0, canvas.width, canvas.height);

            // console.log(bb1.velY, bb1.velY*timeStep,bb1.y)

            world.step(timeStep);

            var bodies = world.bodies;
            drawBodies(context, bodies);

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


}());
