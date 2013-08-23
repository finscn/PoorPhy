"use strict";
(function(exports, undefined) {


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

        updateNormals: function() {

        },
        setAngle: function(angle) {
            this.angle = angle;

            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
        },

    };


    exports.Shape = Class(Shape,proto);


}(exports));