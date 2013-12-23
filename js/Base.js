"use strict";

(function(_this) {

    if (typeof exports == "undefined") {
        var _exports = window || _this;
        _exports.exports = _exports;
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
            return min + (max - min + 1) * Math.random() >> 0;
        },
        createRectVertices: function(w, h) {
            var vertices = [
                [-w / 2, -h / 2],
                [w / 2, -h / 2],
                [w / 2, h / 2],
                [-w / 2, h / 2]
            ];
            return vertices;
        },
        createPolyVertices: function(n, radius) {
            radius = radius || 1;
            n = n || 3;
            var perAng = Math.PI * 2 / n;
            var vertices = [];
            for (var i = 0; i < n; i++) {
                var ang = perAng * i;
                var x = radius * Math.cos(ang);
                var y = radius * Math.sin(ang);
                vertices.push([x, y]);
            }
            return vertices;
        },
        translateVertices: function(vertices, x, y) {
            vertices.forEach(function(p) {
                p[0] += x;
                p[1] += y;
            })
            return vertices;
        },
        rotateVertices: function(vertices, ang,cx,cy) {
            var cos = Math.cos(ang),
                sin = Math.sin(ang);
            cx=cx||0;
            cy=cy||0;
            vertices.forEach(function(p) {
                var x = p[0]-cx,
                    y = p[1]-cy;
                p[0] = x * cos - y * sin+cx;
                p[1] = x * sin + y * cos+cy;
            })
            return vertices;
        },


        createShapesByMapData: function(data, scale) {
            scale=scale||1;

            var shapes = {};
            var nameSeed = 1;
            data.forEach(function(shapeData) {
                if (!shapeData.name) {
                    shapeData.name = "_tmp_" + nameSeed++;
                }
                var name = shapeData.name;
                if (shapes[name]) {
                    shapes[name].push(shapeData)
                } else {
                    shapes[name] = [shapeData];
                }
            })
            var shapeList = [];
            for (var name in shapes) {
                var s = shapes[name];
                var shape=null;
                // console.log(s.length)
                if (s.length === 1) {
                    var _s=s[0];
                    if (_s.polygon) {
                        var vs=_s.polygon;
                        vs.forEach(function(v){
                            v[0]*=scale;
                            v[1]*=scale;
                        });
                        shape = new Polygon({
                            vertices: vs,
                        })
                    } else if (_s.polyline) {
                        var vs=_s.polyline;
                        vs.forEach(function(v){
                            v[0]*=scale;
                            v[1]*=scale;
                        });
                        shape = new Segment({
                            vertices: vs,
                        })
                    } else if (_s.ellipse) {
                        shape = new Circle({
                            radius: _s.ellipse.r*scale,
                            x: _s.ellipse.x*scale,
                            y: _s.ellipse.y*scale
                        });
                    }
                } else {
                    var _shapes = [];
                    s.forEach(function(_s) {
                        var vs=_s.polygon;
                        vs.forEach(function(v){
                            v[0]*=scale;
                            v[1]*=scale;
                        });
                        // _shapes.push(_s.polygon || _s.polyline);
                        _shapes.push(new Polygon({
                            vertices: vs,
                        }) );
                    })
                    shape = new Composition({
                        shapes: _shapes
                    })
                }
                if (shape) {
                    shapeList.push(shape);
                }
            }
            // console.log(shapeList)
            return shapeList;
        },

        cloneObject : function(obj){
            return JSON.parse(JSON.stringify(obj));
        },
        createAABB: function(vertices,aabb) {
            aabb=aabb||[];

            var minX = Number.MAX_VALUE,
                minY = Number.MAX_VALUE;
            var maxX = -minX,
                maxY = -minY;

            for (var i = 0,len=vertices.length; i < len; i++) {
                var v = vertices[i];

                if (v[0] < minX) {
                    minX = v[0];
                }

                if (v[0] > maxX) {
                    maxX = v[0];
                }

                if (v[1] < minY) {
                    minY = v[1];
                }
                if (v[1] > maxY) {
                    maxY = v[1];
                }
            }
            aabb[0] = minX;
            aabb[1] = minY;
            aabb[2] = maxX;
            aabb[3] = maxY;

            return aabb;

        },

        checkInAABB : function(x,y,aabb){
            return aabb[0]<x && x<aabb[2]
                && aabb[1]<y && y<aabb[3];
        },

        checkAABBCollide : function( aabb1, aabb2){
            return aabb1[0]<aabb2[2]
                && aabb1[2]>aabb2[0]
                && aabb1[1]<aabb2[3]
                && aabb1[3]>aabb2[1];
        },

        mergeAABB : function(aabb1,aabb2){
            return [
                Math.min(aabb1[0],aabb2[0]),
                Math.min(aabb1[1],aabb2[1]),
                Math.max(aabb1[2],aabb2[2]),
                Math.max(aabb1[3],aabb2[3])
            ];
        },

        extendAABB : function(aabb, ext){
            return [
                aabb[0]-ext,
                aabb[1]-ext,
                aabb[2]+ext,
                aabb[3]+ext
            ];
        }

    }


    var BodyType = {

        Kinematic: 0,

        Static: 1,

        Dynamic: 2,
    };


    var ShapeType = {

        Circle: 1,

        Poly: 2,

        Segment: 4,

        Comp: 8

    };

    exports.Const = Const;
    exports.Utils = Utils;
    exports.BodyType = BodyType;
    exports.ShapeType = ShapeType;

}(exports));