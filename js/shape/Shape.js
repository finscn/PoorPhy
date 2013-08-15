"use strict";
(function(exports, undefined) {
	//TODO

    var Shape = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Shape.superclass = Body;

    var proto = {

        shapeType : null,

        aabbExtension: 5,
        aabb: null, // []

        _updatedCount: 0,

        setAngle: function(angle) {
            this.angle = angle;

            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
        },

    };


    if (Shape.superclass) {
        var superProto = Shape.superclass.prototype;
        for (var key in superProto) {
            Shape.prototype[key] = superProto[key];
        }
    }

    for (var key in proto) {
        Shape.prototype[key] = proto[key];
    }

    exports.Shape = Shape;

}(this));