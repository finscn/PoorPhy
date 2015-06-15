"use strict";

var PP = PP || {};

(function(exports, undefined) {

    var Class = exports.Class;
    var Body = exports.Body;

    var Shape = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Shape.superclass = Body;

    var proto = {

        shapeType: null,

        aabbExtension: 5,
        aabb: null, // []

        _updatedCount: 0,

        updateNormals: function() {

        },
        setAngle: function(angle) {
            this.angle = angle;

            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
        },
        inAABB: function(x, y) {
            return this.aabb[0] < x && x < this.aabb[2] && this.aabb[1] < y && y < this.aabb[3]
        }

    };


    exports.Shape = Class.create(Shape, proto);


}(PP));
