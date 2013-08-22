"use strict";
(function(exports, undefined) {


    var Polygon = function(cfg) {

        for (var key in cfg) {
            this[key] = cfg[key];
        }
    };

    Polygon.superclass = Shape;

    var proto = {

        shapeType: ShapeType.Poly,

        //[]
        vertices: null,
        //[]
        normals: null,
        //[]
        localVertices: null,
        //[]
        localNormals: null,

        vertexCount: 0,

        _updatedCount: 0,


        init: function() {
            this.initMassData();

            if (this.x === null) {
                this.x = this.originalCentroid[0];
            }
            if (this.y === null) {
                this.y = this.originalCentroid[1];
            }
            this.setAngle(this.angle || 0);

            this.vertexCount = this.vertices.length;
            this.normals = Polygon.computeNormals(this.vertices);

            this.last = {};
            this.aabb = [0, 0, 0, 0];
            this.initLocalData();

        },

        initLocalData: function() {

            var minX = Number.MAX_VALUE,
                minY = Number.MAX_VALUE;
            var maxX = -minX,
                maxY = -minY;

            var vc = this.vertexCount;
            this.localVertices = []
            for (var i = 0; i < vc; i++) {
                var v = this.vertices[i];
                var ox = v[0] - this.x,
                    oy = v[1] - this.y;
                var x = ox * this.cos + oy * this.sin;
                var y = -ox * this.sin + oy * this.cos;
                this.localVertices.push([x, y]);

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
            var oc = this.originalCentroid;
            var ox = oc[0] - this.x,
                oy = oc[1] - this.y;
            var x = ox * this.cos + oy * this.sin;
            var y = -ox * this.sin + oy * this.cos;
            this.localOriginalCentroid = [x, y];

            this.localNormals = Polygon.computeNormals(this.localVertices);
            this.aabb[0] = minX - this.aabbExtension;
            this.aabb[1] = minY - this.aabbExtension;
            this.aabb[2] = maxX + this.aabbExtension;
            this.aabb[3] = maxY + this.aabbExtension;
        },


        initMassData: function() {

            var vertices = this.vertices;
            var len = vertices.length;

            var ac = [0, 0];
            for (var i = 0; i < len; ++i) {
                var v = vertices[i];
                ac[0] += v[0];
                ac[1] += v[1];
            }
            ac[0] /= len;
            ac[1] /= len;


            var c = [0, 0];

            var area2 = 0;

            var originalInertia = 0;

            var v0 = vertices[len - 1];
            var x1 = v0[0] - ac[0],
                y1 = v0[1] - ac[1];
            for (var i = 0; i < len; ++i) {

                var v1 = vertices[i];
                var x2 = v1[0] - ac[0],
                    y2 = v1[1] - ac[1];

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
            this.originalCentroid = c;

            this.density = this.density || 1;
            this.area = area2 / 2;

            this.setMass(this.mass);
            this.originalInertia = originalInertia / 12 * this.density;
            this.setInertia(this.inertia !== null ? this.inertia : this.originalInertia);

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

            for (var i = 0; i < this.vertexCount; i++) {
                var ov = this.localVertices[i];
                var ox = ov[0],
                    oy = ov[1];
                var x = ox * this.cos - oy * this.sin;
                var y = ox * this.sin + oy * this.cos;
                var v = this.vertices[i];
                v[0] = x + this.x;
                v[1] = y + this.y;

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
            this.aabb[0] = minX - this.aabbExtension;
            this.aabb[1] = minY - this.aabbExtension;
            this.aabb[2] = maxX + this.aabbExtension;
            this.aabb[3] = maxY + this.aabbExtension;

        },

        updateNormals: function() {
            for (var i = 0; i < this.vertexCount; i++) {
                var on = this.localNormals[i];
                var x = this.cos * on[0] - this.sin * on[1];
                var y = this.sin * on[0] + this.cos * on[1];

                var n = this.normals[i];
                n[0] = x;
                n[1] = y;

                var v = this.vertices[i];
                n[2] = x * v[0] + y * v[1];
            }
        },


        update: function(timeStep) {
            this._updatedCount++;

            this.setAngle(this.angle);
            this.updateVertices();
            this.updateNormals();

        },

        updateAABB: function() {
            var minX = Number.MAX_VALUE,
                minY = Number.MAX_VALUE;
            var maxX = -minX,
                maxY = -minY;

            for (var i = 0; i < this.vertexCount; i++) {
                var v = this.vertices[i];

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
            this.aabb[0] = minX - this.aabbExtension;
            this.aabb[1] = minY - this.aabbExtension;
            this.aabb[2] = maxX + this.aabbExtension;
            this.aabb[3] = maxY + this.aabbExtension;

        },

        containPoint: function(x, y) {
            var vertices = this.vertices;
            var normals = this.normals;
            var len = vertices.length;
            var p = vertices[len - 1],
                px = p[0],
                py = p[1];
            var found = 0;

            var n=normals[len-1];

            for (var i = 0; i < len; i++) {
                var q = vertices[i],
                    qx = q[0],
                    qy = q[1];


                var minX, maxX;
                if (px < qx) {
                    minX = px;
                    maxX = qx;
                } else {
                    minX = qx;
                    maxX = px;
                }

                if (x >= minX && x <= maxX) {
                    var det = n[0] * x + n[1] * y - n[2];
                    if (det > 0) {
                        return false;
                    }
                    if (found == 1) {
                        console.log("containPoint true")
                        return true;
                    }
                    found++; // one edge found.
                }
                n=normals[i];
                px = qx;
                py = qy;
            }

            return false;
        },

    };



    Polygon.projectPointToEdge = function(p, e0, e1) {

        var v = [p[0] - e0[0], p[1] - e0[1]];

        var edge = [e1[0] - e0[0], e1[1] - e0[1]];

        var t = (edge[0] * v[0] + edge[1] * v[1]) / (edge[0] * edge[0] + edge[1] * edge[1]);

        if (t < 0) {
            t = 0;
        } else if (t > 1) {
            t = 1;
        }
        var contact = [e0[0] + edge[0] * t, e0[1] + edge[1] * t];

        return contact;

    }


    Polygon.computeNormal = function(v0, v1) {
        var nx = v1[1] - v0[1],
            ny = v0[0] - v1[0];

        var length = Math.sqrt(nx * nx + ny * ny);
        nx /= length;
        ny /= length;

        var np = nx * v0[0] + ny * v0[1];
        return [nx, ny, np, np];
    };

    Polygon.computeNormals = function(vertices, normals) {
        var len = vertices.length;
        normals = normals || [];
        normals.length = 0;
        var normal, vertex, lastVertex = vertices[len - 1];
        for (var i = 0; i < len; i++) {
            vertex = vertices[i];
            normal = Polygon.computeNormal(lastVertex, vertex);
            normals.push(normal);
            lastVertex = vertex;
        }
        normals.push(normals.shift());
        return normals;
    };



    exports.Polygon = Class(Polygon, proto);


}(exports));