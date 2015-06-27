"use strict";

var PP = PP || {};

(function(exports, undefined) {

    var Class = exports.Class;
    var ShapeType = exports.ShapeType;
    var Polygon = exports.Polygon;

    var Triangle = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Triangle.superclass = Polygon;

    var proto = {

        shapeType: ShapeType.Poly,

        mass: 0,
        inertia: 0,

    }



    exports.Triangle = Class.create(Triangle, proto);


}(PP));
