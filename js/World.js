"use strict";
(function(exports, undefined) {


    var World = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    }

    World.prototype = {
        constructor: World,

        bodies: null,

        gravityX: 0,
        gravityY: 0,
        forceX: 0,
        forceY: 0,

        allowSleep: true,

        timeToSleep: 0.5,
        minSleepVelSq: 0.75,
        minSleepVelAng: 0.075,


        bodySN: 1,


        init: function() {
            this.bodies = [];

            var cm = this.collideManager = this.collideManager || new CollideManager();

            cm.onCollided = this.onCollided || cm.onCollided;
            cm.onSeparated = this.onSeparated || cm.onSeparated;
            cm.onCollideSolve = this.onCollideSolve || cm.onCollideSolve;
            cm.init(this);

        },

        addBody: function(body) {
            body._sn = this.bodySN++;

            if (body.bodyType !== BodyType.Static && !body.ignoreG) {
                body.gravityX = this.gravityX;
                body.gravityY = this.gravityY;
            }

            this.bodies.push(body);
            return body;
        },

        removeBody: function(body) {
            body._to_remove_ = true;
        },

        checkSleep: function(body, timeStep) {
            if (Math.abs(body.velAng) <= this.minSleepVelAng && Math.pow(body.velX, 2) + Math.pow(body.velY, 2) <= this.minSleepVelSq) {
                body.sleepTime += timeStep;
                if (body.sleepTime >= this.timeToSleep) {
                    body.sleeping = true;
                    return true;
                }
            } else {
                body.awake();
            }
            return false;
        },


        step: function(timeStep) {
            
            var bodies = this.bodies;
            var i = 0,
                len = bodies.length;
            while (i < len) {
                var body = bodies[i];
                if (body._to_remove_) {
                    len--;
                    bodies.splice(i, 1);
                    continue;
                }
                body.saveStatus();

                if (!body.sleeping) {
                    body.integrateVelAngle(timeStep);
                    body.integrateVel(timeStep);
                }

                i++;
            }

            this.collideManager.collide(timeStep);
            this.collideManager.solve(timeStep);


            i = 0;
            while (i < len) {
                var body = bodies[i];

                if (!body.sleeping) {
                    body.integrateAngle(timeStep);
                    body.integratePos(timeStep);
                    body.update(timeStep);
                }

                if (this.allowSleep && body.autoSleep) {
                    this.checkSleep(body, timeStep);
                }

                body.setForce(0, 0);
                body.forceTorque=0;
                i++;
            }

        }

    }


    exports.World = World;

}(this));