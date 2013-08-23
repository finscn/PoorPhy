"use strict";
(function(exports, undefined) {

    // TO BE DONE

    var Composition = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Composition.superclass = Shape;

    var proto = {

        shapes: null, // []

        shapeType: ShapeType.Comp,

        init: function() {
            var Me = this;

            this.shapes = this.shapes || [];
            this.shapes.forEach(function(s) {
                s.init();
            });
            this.initMassData();
            var x = this.originalCentroid[0],
                y = this.originalCentroid[1];

            this.shapes.forEach(function(s) {
                var cx = s.x;
                var cy = s.y;
                s.translateCentroid(x - cx, y - cy);
                s.body = Me;
            });


            this.x = x;
            this.y = y;

            this.last = {};
            this.aabb = [0, 0, 0, 0];
            // this.initLocalData();
        },


        initMassData: function() {

            var mass = 0,
                inertia = 0,
                area =0;

            var shapes = this.shapes;
            var len = shapes.length;


            var ac = [0, 0];
            for (var i = 0; i < len; ++i) {
                var s = shapes[i];
                mass += s.mass;
                inertia += s.inertia;
                area += s.area;
                ac[0] += s.x;
                ac[1] += s.y;
            }
            ac[0] /= len;
            ac[1] /= len;


            var c;
            if (len < 3) {
                c = [(shapes[0].x + shapes[1].x) / 2, (shapes[0].y + shapes[1].y) / 2];
                // return c;
            } else {
                c = [0, 0];

                var area2 = 0;

                var originalInertia = 0;

                var s0 = shapes[len - 1];
                var x1 = s0.x - ac[0],
                    y1 = s0.y - ac[1];

                for (var i = 0; i < len; ++i) {

                    var s1 = shapes[i];
                    var x2 = s1.x - ac[0],
                        y2 = s1.y - ac[1];


                    var triangleArea2 = (x1 * y2 - y1 * x2);
                    area2 += triangleArea2;

                    c[0] += triangleArea2 * (x1 + x2);
                    c[1] += triangleArea2 * (y1 + y2);

                    var inertiaX = (x1 * x1 + x1 * x2 + x2 * x2);
                    var inertiaY = (y1 * y1 + y1 * y2 + y2 * y2);

                    originalInertia += triangleArea2 * (inertiaX + inertiaY);

                    x1 = x2;
                    y1 = y2;
                }


                c[0] = c[0] / (area2 * 3) + ac[0];
                c[1] = c[1] / (area2 * 3) + ac[1];

            }

            this.area=area;
            this.originalCentroid = c;

            this.setMass(mass);
            this.setInertia(inertia);

            return c;

        },

        translateCentroid: function(x, y) {
            this.x += x;
            this.y += y;
            var localVertices = this.localVertices;
            var len = localVertices.length;
            for (var i = 0; i < len; i++) {
                var local = localVertices[i];
                local[0] -= x;
                local[1] -= y;
            }
        },

        updateVertices: function() {

            var minX = Number.MAX_VALUE,
                minY = Number.MAX_VALUE;
            var maxX = -minX,
                maxY = -minY;

            var shapes = this.shapes;
            var len = shapes.length;
            for (var i = 0; i < len; i++) {
                var s = shapes[i];
                s.updateVertices();

                var aabb = s.aabb;

                if (aabb[0] < minX) {
                    minX = aabb[0];
                }

                if (aabb[2] > maxX) {
                    maxX = aabb[2];
                }

                if (aabb[1] < minY) {
                    minY = aabb[1];
                }
                if (aabb[3] > maxY) {
                    maxY = aabb[3];
                }
            }
            this.aabb[0] = minX;
            this.aabb[1] = minY;
            this.aabb[2] = maxX;
            this.aabb[3] = maxY;

        },

        updateNormals: function() {
            this.shapes.forEach(function(s) {
                s.updateNormals();
            })
        },


        update: function(timeStep) {
            this._updatedCount++;

            this.setAngle(this.angle);
            this.updateVertices();
            this.updateNormals();

        },
        setPos: function(x, y) {
            this.x = x;
            this.y = y;

            this.shapes.forEach(function(s) {
                s.setPos(x, y);
            })
        },
        setAngle: function(angle) {
            this.angle = angle;
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);

            this.shapes.forEach(function(s) {
                s.setAngle(angle);
            })
        },

        addShape: function(shape) {
            this.shapes = this.shapes || [];
            this.shapes.push(shape);
            shape.body = this;
        },
        containPoint : function(x, y) {
            for (var i=0,len=this.shapes.length;i<len;i++){
                if (this.shapes[i].containPoint(x,y)){
                    return true;
                }
            }
            return false;
        },
    }

    exports.Composition = Class(Composition, proto);

}(exports));