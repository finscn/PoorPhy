"use strict";

(function(exports, undefined) {


    var World = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    }

    var proto = {

        bodies: null,

        gravityX: 0,
        gravityY: 0,
        forceX: 0,
        forceY: 0,

        allowSleep: true,

        timeToSleep: 0.5,
        minSleepVelSq: 0.01, //*0.01,
        minSleepVelAng: 0.2,

        solveIterations: 10,

        BODY_SN_SEED: 1,


        init: function(parent) {
            this.parent=parent;

            this.bodies = [];

            this.initCollideManager();
        },

        initCollideManager : function(){
            var cm = this.collideManager = this.collideManager || new CollideManager();

            cm.onCollided = this.onCollided || cm.onCollided;
            cm.onSeparated = this.onSeparated || cm.onSeparated;
            cm.onCollideSolve = this.onCollideSolve || cm.onCollideSolve;
            cm.init(this);

        },

        addBody: function(body) {
            body._sn = this.BODY_SN_SEED++;
            body.id = body.id || body._sn;

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
            if (Math.abs(body.velAng) <= this.minSleepVelAng && body.getVelSq() <= this.minSleepVelSq) {
                body.sleepTime += timeStep;
                if (body.sleepTime >= this.timeToSleep) {
                    body.sleeping = true;
                    return true;
                }
            } else {
                // console.log(Math.abs(body.velAng), body.getVelSq())
                body.awake();
            }
            return false;
        },

        preSolve: function(timeStep) {
            
            // var iterations = this.solveIterations;
            var collideManager = this.collideManager;
            // for (var i = 0; i < iterations; i++) {
                collideManager.preSolve(timeStep)
            // }
        },

        solve: function(timeStep) {
            var iterations = this.solveIterations;
            var collideManager = this.collideManager;
            for (var i = 0; i < iterations; i++) {
                collideManager.solve(timeStep, iterations, i)
            }
        },


        step: function(timeStep) {

            var bodies = this.bodies;
            var i = 0,
                len = bodies.length;
            while (i < len) {
                var body = bodies[i];
                if (body.body) {
                    i++;
                    continue;
                }
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

                // if (this.allowSleep && body.autoSleep) {
                //     this.checkSleep(body, timeStep);
                // }

                i++;
            }

            this.collideManager.update(timeStep);
            // this.jointManager.update(timeStep);
            // this.preSolve(timeStep);
            this.solve(timeStep);


            i = 0;
            while (i < len) {
                var body = bodies[i];
                if (body.body) {
                    i++;
                    continue;
                }
                if (!body.sleeping) {
                    body.integrateAngle(timeStep);
                    body.integratePos(timeStep);
                    body.update(timeStep);
                }

                if (this.allowSleep && body.autoSleep) {
                    this.checkSleep(body, timeStep);
                }

                body.setForce(0, 0);
                body.forceTorque = 0;
                i++;
            }

        }

    }

    exports.World = Class.create(World, proto);


}(exports));