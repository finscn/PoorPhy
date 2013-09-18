"use strict";

(function(exports, undefined) {


    var Class = function(constructor, proto, superclass) {

        if (typeof constructor == "object" && arguments.length < 3) {
            superclass = proto;
            proto = constructor;
            constructor = function(options) {
                for (var key in options) {
                    this[key] = options[key];
                }
            };
        }

        superclass = constructor.superclass = superclass || constructor.superclass;
        var _proto = constructor.prototype;

        if (superclass) {
            var superProto = superclass.prototype;
            for (var key in superProto) {
                _proto[key] = superProto[key];
            }
        }
        for (var p in proto) {
            _proto[p] = proto[p];
        }
        _proto.constructor = constructor;
        return constructor;
    };

    exports.Class = Class;

}(exports));