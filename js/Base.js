"use strict";

(function(_this){
    if (typeof exports=="undefined"){
        var _scope=window||_this;
        _scope.exports=_scope;
    }
}(this));


(function(exports, undefined) {


    var Const = {
        ZERO: 0.0002,
        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        HALF_PI: Math.PI / 2,
        DOUBLE_PI: Math.PI * 2,
    };


    var Utils = {

        randomInt: function(min, max) {
            return min+(max - min + 1) * Math.random()>>0;
        }
    }

    var Class = function(constructor, proto, superclass){

        superclass=superclass||constructor.superclass;
        var _proto=constructor.prototype;

        if (superclass) {
            var superProto = superclass.prototype;
            for (var key in superProto) {
                _proto[key] = superProto[key];
            }
        }
        for (var p in proto) {
            _proto[p] = proto[p];
        }
        _proto.constructor=constructor;
        return constructor;
    };


    var BodyType = {

        Kinematic: 0,

        Static: 1,

        Dynamic: 2,
    };


    var ShapeType = {

        Circle: 1,

        Poly: 2,

        Segment: 4,

        Comp : 8

    };

    exports.Const = Const;
    exports.Utils = Utils;
    exports.Class = Class;
    exports.BodyType = BodyType;
    exports.ShapeType = ShapeType;

}(exports));