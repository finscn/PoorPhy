;
(function(exports, undefined) {


    var Class = {};

    Class.create = function(constructor, proto, superclass) {

        if (typeof constructor == "object" && arguments.length < 3) {
            superclass = proto;
            proto = constructor;
            constructor = function(options) {
                for (var key in options) {
                    this[key] = options[key];
                }
            };
        }

        var _proto = constructor.prototype;
        for (var p in proto) {
            _proto[p] = proto[p];
        }

        Class.inherit(constructor,superclass);

        return constructor;
    };

    Class.inherit = function(subclass, superclass) {
        var constructor=subclass;
        var proto = constructor.prototype;

        superclass = constructor.superclass = superclass || constructor.superclass || proto.superclass;

        var superProto;
        if ( typeof superclass=="function"){
            superProto = superclass.prototype;
        }else{
            superProto = superclass;
        }

        for (var key in superProto) {
            if (!(key in proto)) {
                proto[key] = superProto[key];
            }
        }

        constructor.$super=superProto;
        constructor.superclass=superclass;
        proto.$super=superProto;
        proto.superclass=superclass;
        proto.constructor = constructor;

        return subclass;
    };

    exports.Class = Class;

}(exports));


// var Class=exports.Class;
// var A=Class.create(function(){
//     console.log("A init ");
// },{
//     classname : "A",
//     test : function(){
//         console.log("A test in "+this.classname);
//     }
// })


// var B=Class.create(function(){
//     console.log("B init");
// },{
//     classname : "B",
//     test : function(){
//         console.log("B test in "+this.classname);
//         this.$super.test.call(this);
//     }
// },A)

// var t=new B();
// t.test();
