"use strict";
(function(exports, undefined) {


    var Body = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    }

    Body.prototype = {
        constructor: Body,

        bodyType: BodyType.Dynamic,

        disabled: false,
        sleeping: false,
        sleepTime: 0,
        autoSleep: true,

        x: null,
        y: null,
        angle: 0,

        velX: 0,
        velY: 0,
        velAng: 0,

        forceX: 0,
        forceY: 0,
        forceTorque: 0,

        damping: 0,
        dampingAng: 0,

        mass: null,
        invMass: null,

        inertia: null,
        invInertia: null,

        fixedRotation: false, // true ===> inertia=0 

        ignoreG: false,
        gravityX: 0,
        gravityY: 0,
        friction: 1, //0.5,
        restitution: 0.5,
        density: 1,

        noop: function() {},

        init : function(){

            this.last={};
            this.aabb = [0,0,0,0];
        },

        saveStatus : function(){
            this.last.velX = this.velX;
            this.last.velY = this.velY;
            this.last.velY = this.velY;
            this.last.x = this.x;
            this.last.y = this.y;
        },
        setMass: function(mass) {
            var invMass;
            if (!mass && mass !== 0) {
                mass = this.density * this.area;
            }
            if (mass <= 0 || mass == Infinity) {
                mass = Infinity;
                invMass = 0;
                this.inertia = Infinity;
                this.invInertia = 0;
            } else {
                invMass = 1 / mass;
            }
            this.mass = mass;
            this.invMass = invMass;
        },

        setInertia: function(inertia) {

            var invInertia;
            if (!inertia && inertia !== 0) {
                this.inertiaFactor = this.inertiaFactor || (this.mass * 2) * this.area;
                inertia = this.density * this.inertiaFactor / 12;
                console.log(inertia)
            }
            if (inertia <= 0 || inertia == Infinity || this.mass <= 0 || this.mass == Infinity) {
                inertia = Infinity;
                invInertia = 0;
            } else {
                invInertia = 1 / inertia;
            }
            this.inertia = inertia;
            this.invInertia = invInertia;
        },

        setPos: function(x, y) {
            this.x = x;
            this.y = y;
        },

        setAngle: function(angle) {
            this.angle = angle;
        },


        setForce: function(x, y) {
            this.forceX = x;
            this.forceY = y;
        },

        applyForce: function(x, y, point) {
            if (this.bodyType != BodyType.Dynamic) {
                return;
            }
            this.awake();
            this.forceX += x;
            this.forceY += y;

            this.forceTorque += ((point[0] - this.centroid[0]) * y - (point[1] - this.centroid[1]) * x);

        },


        applyDamping: function(timeStep) {
            var d = 1 - timeStep * this.damping;
            (d < 0) || (d = 0);
            (d > 1) || (d = 1);
            this.velX *= d;
            this.velY *= d;
        },

        applyDampingAng: function(timeStep) {
            var d = 1 - timeStep * this.dampingAng;
            (d < 0) || (d = 0);
            (d > 1) || (d = 1);
            this.velAng *= d;
        },

        applyTorque: function(torque) {
            if (this.bodyType != BodyType.Dynamic) {
                return;
            }
            this.awake();
            this.forceTorque += torque;
        },

        applyImpulse: function(x, y, point) {
            if (this.bodyType != BodyType.Dynamic) {
                return;
            }
            this.awake();
            this.velX += this.invMass * x;
            this.velY += this.invMass * y;

            this.velAng += ((point[0] - this.centroid[0]) * y - (point[1] - this.centroid[1]) * x) * this.invInertia;
        },

        awake: function() {
            this.sleeping = false;
            this.sleepTime = 0;
        },

        getSleepInfo: function() {
            return {
                velAngAbs: Math.abs(this.velAng),
                velX: this.velX,
                velY: this.velY,
                vel: Math.pow(this.velX, 2) + Math.pow(this.velY, 2),
                sleepTime: this.sleepTime,
                sleeping: this.sleeping
            }
        },

        update: function(timeStep) {

        },
        integrate: function(timeStep) {

            this.setAngle(this.angle + this.velAng * timeStep);

            this.velX += (this.forceX * this.invMass) * timeStep;
            this.velY += (this.forceY * this.invMass) * timeStep;

            this.x += this.velX * timeStep;
            this.y += this.velY * timeStep;

        },


        integrateVelAngle: function(timeStep) {
            this.velAng += (this.forceTorque * this.invMass) * timeStep;
            if (this.dampingAng!==0){
                this.velAng *= Math.min(1, Math.max(0, 1-this.dampingAng * timeStep));
            }
        },
        
        integrateVel: function(timeStep) {
            this.velX += (this.gravityX + this.forceX * this.invMass) * timeStep;
            this.velY += (this.gravityY + this.forceY * this.invMass) * timeStep;
            if (this.damping!==0){
                var d=Math.min(1, Math.max(0, 1-this.damping * timeStep));
                this.velX *=d ;
                this.velY *=d ;
            }
        },
        
        integrateAngle: function(timeStep) {
            this.setAngle(this.angle + this.velAng * timeStep);
        },


        integratePos: function(timeStep) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.x += this.velX * timeStep;
            this.y += this.velY * timeStep;
        },


    }


    exports.Body = Body;

}(this));