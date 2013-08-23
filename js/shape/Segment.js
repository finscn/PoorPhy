"use strict";
(function(exports, undefined) {


    var Segment = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Segment.superclass = Polygon;

    var proto = {

        shapeType: ShapeType.Poly,

        mass : 0,
        inertia : 0,
        initMassData: function() {

            var v0=this.vertices[0],
                v1=this.vertices[1];

            this.originalCentroid = [ (v0[0]+v1[0])/2, (v0[1]+v1[1])/2];
            this.density = this.density || 1;
            this.area = 0;

            this.setMass(this.mass);
            this.originalInertia = (this.originalInertia||0) * this.density;
            this.setInertia(this.inertia!==null?this.inertia:this.originalInertia);
        },
    }



    exports.Segment = Class(Segment, proto);


}(exports));