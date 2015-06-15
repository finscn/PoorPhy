"use strict";

var PP = PP || {};

(function(exports, undefined) {

    var Class = exports.Class;
    var ShapeType = exports.ShapeType;

    var Circle = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Circle.superclass = exports.Shape;

    var proto = {

        shapeType: ShapeType.Circle,

        radius: 0,
        radiusSq: 0,


        init: function() {

            this.radiusSq = this.radius * this.radius;
            this.initMassData();

            if (!this.center) {
                this.center = [this.x || 0, this.y || 0];
            }
            if (this.x === null) {
                this.x = this.center[0];
            }
            if (this.y === null) {
                this.y = this.center[1];
            }
            this.originalX = this.x;
            this.originalY = this.y;

            this.setAngle(this.angle || 0);

            this.last = {};
            this.aabb = [0, 0, 0, 0];
            this.initLocalData();



        },

        initLocalData: function() {
            this.localCenter = [this.center[0] - this.x, this.center[1] - this.y];
        },

        initMassData: function() {

            this.density = this.density || 1;
            this.area = Math.PI * this.radiusSq;

            this.setMass(this.mass);
            this.originalInertia = this.mass * this.radiusSq / 2;
            this.setInertia(this.inertia !== null ? this.inertia : this.originalInertia);

        },

        translateCentroid: function(x, y) {
            this.x += x;
            this.y += y;
            var localCenter = this.localCenter;
            localCenter[0] -= x;
            localCenter[1] -= y;
        },

        updateVertices: function() {
            this.updateCenter();
            this.updateAABB();
        },

        updateCenter: function() {
            var ox = this.localCenter[0],
                oy = this.localCenter[1];
            if (ox !== 0 || oy !== 0) {
                var x = ox * this.cos - oy * this.sin;
                oy = ox * this.sin + oy * this.cos;
                ox = x;
            }
            this.center[0] = ox + this.x;
            this.center[1] = oy + this.y;
        },


        setAngle: function(angle) {
            this.angle = angle;
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
        },


        update: function() {
            this._updatedCount++;

            // this.setPos(this.x,this.y);
            this.setAngle(this.angle);
            this.updateCenter();
            this.updateAABB();

        },

        updateAABB: function() {
            var b = this.radius + this.aabbExtension;
            var x = this.center[0],
                y = this.center[1];
            this.aabb[0] = x - b;
            this.aabb[1] = y - b;
            this.aabb[2] = x + b;
            this.aabb[3] = y + b;
        },

        containPoint: function(x, y) {
            var dx = x - this.center[0],
                dy = y - this.center[1];

            return (dx * dx + dy * dy) < this.radiusSq;
        },
    };




    exports.Circle = Class.create(Circle, proto);

}(PP));
