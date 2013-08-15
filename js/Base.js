"use strict";
(function(exports, undefined) {


    var Const = {
        ZERO: 0.0002,
        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        HALF_PI: Math.PI / 2,
        DOUBLE_PI: Math.PI * 2,
    };

    var BodyType = {

        Kinematic: 0,

        Static: 1,

        Dynamic: 2,
    };

    var ShapeType = {

        Circle: 1,

        Poly: 2,

        Edge: 4,

    };

    var Utils = {

        randomInt: function(min, max) {
            return min+(max - min + 1) * Math.random()>>0;
        }
    }

    exports.Const = Const;
    exports.BodyType = BodyType;
    exports.ShapeType = ShapeType;
    exports.Utils = Utils;

}(this));