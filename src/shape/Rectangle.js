"use strict";

var PP = PP || {};

(function(exports, undefined) {

    var Class = exports.Class;
    var ShapeType = exports.ShapeType;
    var Polygon = exports.Polygon;

    var Rectangle = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Rectangle.superclass = Polygon;

    var proto = {

        shapeType: ShapeType.Poly,

        mass: 0,
        inertia: 0,

    }



    exports.Rectangle = Class.create(Rectangle, proto);


}(PP));
