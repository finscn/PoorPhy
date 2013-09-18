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
        rotateVertices: function(vertices, ang) {
            var cos = Math.cos(ang),
                sin = Math.sin(ang);
            vertices.forEach(function(p) {
                var x = p[0],
                    y = p[1];
                p[0] = x * cos - y * sin;
                p[1] = x * sin + y * cos;
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
                console.log(s.length)
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
            console.log(shapeList)
            return shapeList;
        },


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