"use strict";

var GeomUtils;
(function(exports) {
    GeomUtils = GeomUtils || {};

    var _utils = {

        ZERO: 0.0002,
        DEG_TO_RAD: Math.PI / 180,
        RAD_TO_DEG: 180 / Math.PI,
        HALF_PI: Math.PI / 2,
        DOUBLE_PI: Math.PI * 2,

        getQuadrant: function(x, y) {
            if (x > 0) {
                return y > 0 ? 1 : 4;
            } else {
                return y > 0 ? 2 : 3;
            }
        },


        dotProduct: function(p1, p2) {
            return p1[0] * p2[0] + p1[1] * p2[1];
        },

        crossProduct: function(p1, p2) {
            return p1[0] * p2[1] - p1[1] * p2[0];
        },

        triangleArea2: function(a, b, c) {
            return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
        },

        unitNormal: function(p) {
            var n = p[0] * p[0] + p[1] * p[1];
            var len = Math.sqrt(n);
            return [p[0] / len, p[1] / len];
        },

        unitNormalLine: function(p1, p2) {

            var nx = p2[1] - p1[1];
            var ny = p1[0] - p2[0];

            var length = Math.sqrt(nx * nx + ny * ny);
            nx /= length;
            ny /= length;

            var np = nx * p1[0] + ny * p1[1];

            return [nx, ny, np];
        },

        normalLine: function(p1, p2) {

            var nx = p2[1] - p1[1];
            var ny = p1[0] - p2[0];

            var np = nx * p1[0] + ny * p1[1];

            return [nx, ny, np];
        },

        unitization: function(p1, p2) {

            var ux = p2[0] - p1[0];
            var uy = p2[1] - p1[1];

            var length = Math.sqrt(ux * ux + uy * uy);
            ux /= length;
            uy /= length;

            var up = ux * p1[0] + uy * p1[1];

            return [ux, uy, up];
        },

        clonePoly: function(poly) {
            var p = [];
            var len = poly.length;
            for (var i = 0; i < len; i++) {
                p.push([poly[i][0], poly[i][1]])
            }
            return p;
        },
        roundPolyVertex: function(poly) {
            var len = poly.length;
            for (var i = 0; i < len; i++) {
                poly[i][0] = Math.round(poly[i][0]);
                poly[i][1] = Math.round(poly[i][1]);
            }
        },
        translatePoly: function(poly, x, y) {
            var len = poly.length;
            for (var i = 0; i < len; i++) {
                poly[i][0] += x;
                poly[i][1] += y;
            }
            return poly;
        },

        rotatePoly: function(poly, deg, cx, cy) {
            if (deg) {
                var rad = deg * GeomUtils.DEG_TO_RAD;
                var cos = Math.cos(rad),
                    sin = Math.sin(rad);
                cx = cx || 0;
                cy = cy || 0;
                var len = poly.length;
                for (var i = 0; i < len; i++) {
                    var p = poly[i];
                    var px = p[0] - cx,
                        py = p[1] - cy;
                    var x = px * cos - py * sin;
                    var y = px * sin + py * cos;
                    p[0] = x + cx;
                    p[1] = y + cy;
                }
            }
            return poly;
        },

        simplifyPoly: function(poly, dis) {
            var len = poly.length;
            var disSq = dis * dis;
            var p = poly[len - 1],
                px = p[0],
                py = p[1];
            for (var i = 0; i < len; i++) {
                var q = poly[i];
                var qx = q[0];
                var qy = q[1];
                var d = (qx - px) * (qx - px) + (qy - py) * (qy - py);
                if (d < disSq) {
                    poly.splice(i, 1);
                    i--;
                    len--;
                } else {
                    px = qx;
                    py = qy;
                }
            }
            return poly;
        },

        calLineAABB: function(p1, p2) {
            var minX, minY, maxX, maxY;
            if (p1[0] <= p2[0]) {
                minX = p1[0];
                maxX = p2[0];
            } else {
                minX = p2[0];
                maxX = p1[0];
            }
            if (p1[1] <= p2[1]) {
                minY = p1[1];
                maxY = p2[1];
            } else {
                minY = p2[1];
                maxY = p1[1];
            }
            return [minX, minY, maxX, maxY];
        },
        calPolyAABB: function(poly) {
            var minX = Infinity,
                minY = Infinity;
            var maxX = -minX,
                maxY = -minY;
            var len = poly.length;
            var left, right;
            for (var i = 0; i < len; i++) {
                var p = poly[i];
                if (p[0] < minX) {
                    minX = p[0];
                    left = p;
                }
                if (p[0] > maxX) {
                    maxX = p[0];
                    right = p;
                }
                if (p[1] < minY) {
                    minY = p[1];
                }
                if (p[1] > maxY) {
                    maxY = p[1];
                }
                if (p[0] == minX) {
                    left = p[1] > left[1] ? p : left;
                }
                if (p[0] == maxX) {
                    right = p[1] > right[1] ? p : right;
                }
            }
            return [minX, minY, maxX, maxY, left, right];
        },
        calPolyCulling: function(poly) {
            var aabb = poly.aabb || GeomUtils.calPolyAABB(poly);
            var culling = [aabb[4], aabb[5]];
            culling.normal = GeomUtils.normalLine(culling[0], culling[1]);
            return culling;
        },
        calPolyNormal: function(poly) {
            var len = poly.length;
            var normals = [],
                normal;
            var point, lastPoint = poly[len - 1];
            for (var i = 0; i < len; i++) {
                point = poly[i];
                var nx = point[1] - lastPoint[1];
                var ny = lastPoint[0] - point[0];
                var np = nx * lastPoint[0] + ny * lastPoint[1];
                normal = [nx, ny, np];
                normals.push(normal);
                lastPoint = point;
            }
            normals.push(normals.shift());
            return normals;
        },
        calPolyUnitNormalLine: function(poly) {
            var len = poly.length;
            var normals = [],
                normal;
            var point, lastPoint = poly[len - 1];
            for (var i = 0; i < len; i++) {
                point = poly[i];
                normal = GeomUtils.unitNormalLine(lastPoint, point);
                normals.push(normal);
                lastPoint = point;
            }
            normals.push(normals.shift());
            return normals;
        },

        polygonOffsetting: function(poly, delta, miterLimit) {

            function _doSquare(mul) {
                var _p1 = [
                    point[0] + lastNormal[0] * delta,
                    point[1] + lastNormal[1] * delta
                ];
                var _p2 = [
                    point[0] + normal[0] * delta,
                    point[1] + normal[1] * delta
                ];
                if ((lastNormal[0] * normal[1] - normal[0] * lastNormal[1]) * delta >= 0) {

                    var a1 = Math.atan2(lastNormal[1], lastNormal[0]);
                    var a2 = Math.atan2(-normal[1], -normal[0]);
                    a1 = Math.abs(a2 - a1);
                    if (a1 > Math.PI) {
                        a1 = Math.PI * 2 - a1;
                    }
                    var dx = Math.tan((Math.PI - a1) / 4) * Math.abs(delta * mul);
                    _p1[0] = _p1[0] - lastNormal[1] * dx;
                    _p1[1] = _p1[1] + lastNormal[0] * dx;

                    _p2[0] = _p2[0] + normal[1] * dx;
                    _p2[1] = _p2[1] - normal[0] * dx;

                    newPoly.push(_p1);
                    newPoly.push(_p2);
                } else {
                    newPoly.push(_p1);
                    newPoly.push(point);
                    newPoly.push(_p2);
                }

            }

            ///////////////////////////////////////////////////////

            var len = poly.length;
            var newPoly = [];
            var normal;
            var normals = poly.normals || GeomUtils.calPolyUnitNormalLine(poly);
            miterLimit = miterLimit || 1;
            var cOffset = 0,
                cOffsetMin = 2 / (miterLimit * miterLimit);


            var lastPoint = poly[len - 1];
            var lastNormal = normals[len - 1];
            for (var i = 0; i < len; i++) {
                var point = poly[i];
                normal = normals[i];

                if (miterLimit <= 1) {
                    _doSquare(1);
                } else {
                    cOffset = 1 + (normal[0] * lastNormal[0] + normal[1] * lastNormal[1]);

                    if (cOffset < cOffsetMin) {
                        _doSquare(miterLimit);

                    } else {
                        if ((lastNormal[0] * normal[1] - normal[0] * lastNormal[1]) * delta >= 0) {
                            var q = delta / cOffset;
                            newPoly.push([
                                point[0] + (lastNormal[0] + normal[0]) * q,
                                point[1] + (lastNormal[1] + normal[1]) * q
                            ]);
                        } else {
                            var _p1 = [
                                point[0] + lastNormal[0] * delta,
                                point[1] + lastNormal[1] * delta
                            ];
                            var _p2 = [
                                point[0] + normal[0] * delta,
                                point[1] + normal[1] * delta
                            ];
                            newPoly.push(_p1);
                            newPoly.push(point);
                            newPoly.push(_p2);
                        }
                    }
                }
                lastPoint = point;
                lastNormal = normal;
            }

            return newPoly;

        },

        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        polylineOffsetting: function(poly, delta, miterLimit) {

            function _doSquare(mul) {
                var maxAng = 100;
                var dot = lastNormal[0] * normal[0] + lastNormal[1] * normal[1];
                var cross = lastNormal[0] * normal[1] - lastNormal[1] * normal[0];
                cross = Math.min(1, Math.max(-1, cross));
                var fixCross = cross * sign;
                var rad = Math.asin(fixCross);
                var deg = rad * GeomUtils.RAD_TO_DEG;
                // if (cross >= 0) {
                if (dot > -GeomUtils.ZERO) {
                    deg = 180 - deg;
                }

                // if (deg > 0) {
                // console.log(i, dot, cross, deg);
                // }
                if (deg > 0 && deg < maxAng) {
                    var _p1 = [
                        point[0] + lastNormal[0] * delta,
                        point[1] + lastNormal[1] * delta
                    ];
                    var _p2 = [
                        point[0] + normal[0] * delta,
                        point[1] + normal[1] * delta
                    ];
                    var a1 = Math.atan2(lastNormal[1], lastNormal[0]);
                    var a2 = Math.atan2(-normal[1], -normal[0]);
                    a1 = Math.abs(a2 - a1);
                    if (a1 > Math.PI) {
                        a1 = Math.PI * 2 - a1;
                    }
                    var dx = Math.tan((Math.PI - a1) / 4) * Math.abs(delta * mul);
                    _p1[0] = _p1[0] - lastNormal[1] * dx;
                    _p1[1] = _p1[1] + lastNormal[0] * dx;

                    _p2[0] = _p2[0] + normal[1] * dx;
                    _p2[1] = _p2[1] - normal[0] * dx;

                    newPoly.push(_p1);
                    newPoly.push(_p2);
                } else {
                    // cOffset = 1 + (lastNormal[0] * normal[0] + lastNormal[1] * normal[1]);
                    cOffset = dot + 1;
                    var q = delta / cOffset;
                    newPoly.push([
                        point[0] + (lastNormal[0] + normal[0]) * q,
                        point[1] + (lastNormal[1] + normal[1]) * q,
                        fixCross < 0
                    ]);
                }
            }


            ////////////////////////////////////////////////////////

            var len = poly.length;
            var sign = delta >= 0 ? 1 : -1;
            miterLimit = miterLimit || 1;

            var newPoly = [];
            var normals = poly.normals || GeomUtils.calPolyUnitNormalLine(poly);
            var cOffset = 0,
                cOffsetMin = 2 / (miterLimit * miterLimit);

            var point, normal;
            var lastPoint = poly[0];
            var lastNormal = normals[0];

            var startPoint = [
                lastPoint[0] + lastNormal[0] * delta,
                lastPoint[1] + lastNormal[1] * delta
            ];
            newPoly.push(startPoint);

            for (var i = 1; i < len - 1; i++) {
                point = poly[i];
                normal = normals[i];

                if (miterLimit <= 1) {
                    _doSquare(1);
                } else {
                    cOffset = 1 + (normal[0] * lastNormal[0] + normal[1] * lastNormal[1]);

                    if (cOffset < cOffsetMin) {
                        _doSquare(miterLimit);
                    } else {
                        var q = delta / cOffset;
                        newPoly.push([
                            point[0] + (lastNormal[0] + normal[0]) * q,
                            point[1] + (lastNormal[1] + normal[1]) * q
                        ]);
                    }
                }
                lastPoint = point;
                lastNormal = normal;
            }

            point = poly[i];
            // normal = normals[i];
            var endPoint = [
                point[0] + lastNormal[0] * delta,
                point[1] + lastNormal[1] * delta
            ];
            newPoly.push(endPoint);
            return newPoly;

        },

        segmentsIntr3: function(a, b, c, d) {

            // 三角形abc 面积的2倍
            var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);

            // 三角形abd 面积的2倍
            var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);

            // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
            if (area_abc * area_abd >= 0) {
                return false;
            }

            // 三角形cda 面积的2倍
            var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
            // 三角形cdb 面积的2倍
            // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
            var area_cdb = area_cda + area_abc - area_abd;
            if (area_cda * area_cdb >= 0) {
                return false;
            }

            //计算交点坐标
            var t = area_cda / (area_abd - area_abc);
            var dx = t * (b.x - a.x),
                dy = t * (b.y - a.y);
            return {
                x: a.x + dx,
                y: a.y + dy
            };

        },


        nearByPoints: function(p1, p2, d) {
            var dx = p1[0] - p2[0],
                dy = p1[1] - p2[1];
            // return dx*dx+dy*dy<=d*d;
            return Math.abs(dx) <= d && Math.abs(dy) <= d;
        },

        getIntersPoint: function(aP1, aP2, aNoraml, bP1, bP2, bNoraml, fix, aIsRay, checkOnly) {

            fix = fix || 0;


            var aX1 = aP1[0],
                aY1 = aP1[1];
            var aX2 = aP2[0],
                aY2 = aP2[1];

            var bX1 = bP1[0],
                bY1 = bP1[1];
            var bX2 = bP2[0],
                bY2 = bP2[1];

            var aNx = aNoraml[0],
                aNy = aNoraml[1],
                aNp = aNoraml[2];
            var bNx = bNoraml[0],
                bNy = bNoraml[1],
                bNp = bNoraml[2];

            //      var aNx=aY2 - aY1, aNy=aX1-aX2;
            //      var aNp=aNx*aX1+aNy*aY1;
            //      var bNx=bY2 - bY1, bNy=bX1-bX2;
            //  var bNp=bNx*bX1+bNy*bY1;

            var denominator = aNx * bNy - aNy * bNx;
            if (denominator == 0) {
                console.log("out1")
                return false;
            }

            var onBN1 = bNx * aX1 + bNy * aY1 - bNp;


            if (aIsRay && onBN1 * denominator >= 0 && (bNx * aX2 + bNy * aY2 - bNp) * denominator >= 0) {
                console.log("out2")
                return false;
            }

            if (!aIsRay && onBN1 * (bNx * aX2 + bNy * aY2 - bNp) >= 0) {
                console.log("out3")
                return false;
            }

            var onAN1 = aNx * bX1 + aNy * bY1 - aNp;
            var onAN2 = aNx * bX2 + aNy * bY2 - aNp;

            if (onAN1 * onAN2 >= 0) {
                console.log("out4")
                return false;
            }
            if (checkOnly) {
                return true;
            }

            var fraction = onBN1 / denominator;
            var dx = fraction * aNy;
            var dy = -fraction * aNx;
            var x = aX1 + dx;
            var y = aY1 + dy;
            var cp = [x, y]
            cp.dd = [dx, dy];
            return cp;
        },


        checkSegmentCross: function(aP1, aP2, aNoraml, bP1, bP2, bNoraml) {

            var aX1 = aP1[0],
                aY1 = aP1[1];
            var aX2 = aP2[0],
                aY2 = aP2[1];
            var bNx = bNoraml[0],
                bNy = bNoraml[1],
                bNp = bNoraml[2];

            var onBN1 = bNx * aX1 + bNy * aY1 - bNp;
            var onBN2 = bNx * aX2 + bNy * aY2 - bNp;
            if (onBN1 * onBN2 >= 0) {
                return false;
            }

            var bX1 = bP1[0],
                bY1 = bP1[1];
            var bX2 = bP2[0],
                bY2 = bP2[1];
            var aNx = aNoraml[0],
                aNy = aNoraml[1],
                aNp = aNoraml[2];
            var onAN1 = aNx * bX1 + aNy * bY1 - aNp;
            var onAN2 = aNx * bX2 + aNy * bY2 - aNp;

            if (onAN1 * onAN2 >= 0) {
                return false;
            }
            return true;
        },


        relativePointLine: function(point, normalLine) {
            var det = point[0] * normalLine[0] + point[1] * normalLine[1] - normalLine[2];
            //  <0 点线 ,  >0 线点
            return det < 0 ? -1 : (det > 0 ? 1 : 0);
        },

        relativeLineLine: function(lineA, lineB, normalLineB) {
            var normalLine = normalLineB;
            var point = lineA[0];
            var det1 = point[0] * normalLine[0] + point[1] * normalLine[1] - normalLine[2];

            point = lineA[1];
            var det2 = point[0] * normalLine[0] + point[1] * normalLine[1] - normalLine[2];

            if (det1 <= 0 && det2 <= 0) {
                // AB
                return 1;
            } else if (det1 >= 0 && det2 >= 0) {
                // BA
                return -1
            } else if (det1 == 0 && det2 == 0) {

                return 0;
            }
            return false;
        },

        movePointInPolys: function(x, y, polys, radius) {
            for (var i = 0; i < polys.length; i++) {
                var p = movePointInPoly(x, y, polys[i], radius);
                if (p) {
                    return p;
                }
            }
            return false;
        },

        movePointInPoly: function(x, y, poly, radius) {
            var len = poly.length;
            //var p=poly[len - 1] , px = p[0] , py = p[1];
            var closed = -Infinity,
                closedN = -1;

            for (var i = 0; i < len; i++) {
                var n = poly.normals[i];

                var nx = n[0],
                    ny = n[1],
                    np = n[2];

                var det = nx * x + ny * y - np;
                // console.log( i, det,"|",nx,ny,np,"|",x,y)
                if (det > 0) {
                    return false;
                }
                if (det > closed) {
                    closed = det;
                    closedN = n;
                }
            }
            var outP = null;
            if (closed >= -(radius + 1)) {
                closed = closed - 1;
                outP = [x - closedN[0] * closed, y - closedN[1] * closed];
            }
            return outP;
        },



        checkPointInPoly: function(x, y, poly) {
            var len = poly.length;
            var p = poly[len - 1],
                px = p[0],
                py = p[1];
            var found = 0;

            for (var i = 0; i < len; i++) {
                var q = poly[i],
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

                // Check whehter x is within interval of upper edge QP or lower edge PQ
                if (x >= minX && x <= maxX) {
                    var det = (qy - py) * (x - px) + (px - qx) * (y - py);
                    if (det >= 0) {
                        return false;
                    }
                    // Previoiusly an edge has been found, so both edges is now  found.
                    if (found == 1) {
                        return true;
                    }
                    found++; // one edge found.
                }

                px = qx;
                py = qy;
            }

            return false;
        },



        // Test whether a convex polygon intersects with a circle
        checkPolyCircleCollide: function(poly, cx, cy, radius) {
            var len = poly.length;
            var rr = radius * radius;

            // Case I: check if normal of PQ forms a separating axis

            var p = poly[len - 1],
                px = p[0],
                py = p[1];
            var closestPoint, minPCdotPC = Infinity;
            for (var i = 0; i < len; i++) {
                var q = poly[i],
                    qx = q[0],
                    qy = q[1];

                // Compute normal vector of the hyperplane for edge PQ
                // Assume winding orders of the polygons are counterclockwise
                var nx = qy - py,
                    ny = px - qx;

                // Project PC to normal, i.e. det = (C - P) dot N
                var pcx = cx - px,
                    pcy = cy - py;
                var PCdotN = pcx * nx + pcy * ny;

                // If the center of circle is outside of PQ
                if (PCdotN >= 0) {
                    // Compare distance between C and PQ with radius.
                    // Need to normalize N to find actual distance between C and PQ 
                    // i.e. det / sqrt(NdotN) >= radius
                    // To prevent taking square root, squaring both sides
                    // It is safe to do so because both LHS and RHS are positive
                    var NdotN = nx * nx + ny * ny;
                    if (PCdotN * PCdotN >= rr * NdotN)
                        return false;
                }

                // Update M (closed vertex to C) for Case II
                var PCdotPC = pcx * pcx + pcy * pcy;

                // If P is inside circle, can confirm it is interested
                if (PCdotPC <= rr)
                    return true;
                else if (PCdotPC <= minPCdotPC) {
                    minPCdotPC = PCdotPC;
                    closestPoint = p;
                }

                px = qx;
                py = qy;
            }

            // Case II: check if M (closed vertex to C) to C forms a separating axis
            var nx = closestPoint[0] - cx,
                ny = closestPoint[1] - cy;

            // Doing square root once here should be better than
            // doing more multiplications and branches inside the loop
            var rhs = Math.sqrt(nx * nx + ny * ny) * radius;

            var CdotN = cx * nx + cy * ny;
            for (var i = 0; i < len; i++) {
                var p = poly[i],
                    px = p[0],
                    py = p[1];
                var CPdotN = px * nx + py * ny - CdotN;
                if (CPdotN < rhs)
                    return true;
            }

            return false;
        },


        checkPolyLineCollide: function(poly, p1, p2, fix) {
            return GeomUtils.checkPolyCollide(poly, [p1, p2], fix);
        },

        checkPolyCollide: function(poly1, poly2, fix) {
            var len1 = poly1.length,
                len2 = poly2.length;

            fix = fix || 0;
            var p, q, v;

            var second = false;
            do {
                p = poly1[len1 - 1];
                var px = p[0];
                var py = p[1];
                for (var i = 0; i < len1; i++) {
                    q = poly1[i];
                    var qx = q[0];
                    var qy = q[1];
                    var nx = qy - py;
                    var ny = px - qx;

                    if (fix) {
                        var dis = Math.sqrt(nx * nx + ny * ny);
                        nx /= dis;
                        ny /= dis;
                    }

                    var NdotP = nx * px + ny * py;
                    var allOutside = true;
                    for (var j = 0; j < len2; j++) {
                        v = poly2[j];
                        var vx = v[0];
                        var vy = v[1];
                        var det = nx * vx + ny * vy - NdotP;
                        if (det + fix < 0 && det - fix < 0) {
                            allOutside = false;
                            break;
                        }
                    }

                    if (allOutside) {
                        return false;
                    }

                    px = qx;
                    py = qy;
                }
                if (len2 < 2) {
                    return true;
                }
                if (second) {
                    break;
                }
                second = true;

                len1 = len1 ^ len2;
                len2 = len1 ^ len2;
                len1 = len1 ^ len2;
                var _t = poly1;
                poly1 = poly2;
                poly2 = _t;
            } while (true);

            return true;
        },



        checkCircleRectCollide: function(cx, cy, radius, x1, y1, w, h) {

            var x2 = x1 + w,
                y2 = y1 + h;
            var rx1 = x1 - radius,
                ry1 = y1 - radius,
                rx2 = x2 + radius,
                ry2 = y2 + radius;

            if (cx < rx1 || cx > rx2 || cy < ry1 || cy > ry2) {
                return false;
            }
            if (cx > x1 && cx < x2 && cy > ry1 && cy < ry2 || cx > rx1 && cx < rx2 && cy > y1 && cy < y2) {
                return true;
            }

            var rSq = radius * radius;
            var dx1 = x1 - cx;
            dx1 = dx1 * dx1;
            var dy1 = y1 - cy;;
            dy1 = dy1 * dy1;
            if (dx1 + dy1 < rSq) {
                return true
            }
            var dx2 = x2 - cx;
            dx2 = dx2 * dx2;
            if (dx2 + dy1 < rSq) {
                return true
            }

            var dy2 = y2 - cy;
            dy2 = dy2 * dy2;
            if (dx2 + dy2 < rSq) {
                return true
            }
            if (dx1 + dy2 < rSq) {
                return true
            }

            return false;

        },


        checkPointInIsoSquare: function(px, py, x, y, h) {
            // return   checkIsoSquareCollide(x,y,h,px,py,0);
            return Math.abs((x - px) + (y - py) * 2) < h && Math.abs((x - px) - (y - py) * 2) < h;
        },

        checkIsoSquareCollide: function(x1, y1, h1, x2, y2, h2) {
            return Math.abs((x1 - x2) + (y1 - y2) * 2) < h1 + h2 && Math.abs((x1 - x2) - (y1 - y2) * 2) < h1 + h2;
        },

        checkRectCollide: function(x1, y1, w1, h1, x2, y2, w2, h2) {
            return x1 - x2 < w2 && y1 - y2 < h2 && x2 - x1 < w1 && y2 - y1 < h1;
        },

        checkAABBCollide: function(aabb1, aabb2) {

            return aabb1[0] < aabb2[2] && aabb1[1] < aabb2[3] && aabb2[0] < aabb1[2] && aabb2[1] < aabb1[3];
        },


        checkPointInRect: function(px, py, x, y, w, h) {
            return px > x && py > y && px - x < w && py - y < h;
        },

        checkCircleRectCollide_: function(cx, cy, radius, x1, y1, w, h) {
            var x2 = x1 + w,
                y2 = y1 + h;

            if (cx > x1 && cx < x2 && cy > y1 && cy < y2) {
                return true;
            }

            var dx1 = Math.abs(x1 - cx);
            var dx2 = Math.abs(x2 - cx);
            if (cy > y1 && cy < y2 && (dx1 < radius || dx2 < radius)) {
                return true;
            }

            var dy1 = Math.abs(y1 - cy);
            var dy2 = Math.abs(y2 - cy);
            if (cx > x1 && cx < x2 && (dy1 < radius || dy2 < radius)) {
                return true;
            }

            if (dx1 < radius) {
                var b = Math.sqrt(radius * radius - dx1 * dx1);
                var b1 = cy - b,
                    b2 = cy + b;
                if (b1 < y1 && y1 < b2 || b1 < y2 && y2 < b2) {
                    return true;
                }
            }

            if (dx2 < radius) {
                var b = Math.sqrt(radius * radius - dx2 * dx2);
                var b1 = cy - b,
                    b2 = cy + b;
                if (cy > y1 && cy < y2 || b1 < y1 && y1 < b2 || b1 < y2 && y2 < b2) {
                    return true;
                }
            }

            if (dy1 < radius) {
                var b = Math.sqrt(radius * radius - dy1 * dy1);
                var b1 = cx - b,
                    b2 = cx + b;
                if (b1 < x1 && x1 < b2 || b1 < x2 && x2 < b2) {
                    return true;
                }
            }
            if (dy2 < radius) {
                var b = Math.sqrt(radius * radius - dy2 * dy2);
                var b1 = cx - b,
                    b2 = cx + b;
                if (b1 < x1 && x1 < b2 || b1 < x2 && x2 < b2) {
                    return true;
                }
            }

            return false;

        },



        mergerAABB: function(bb1, bb2) {
            return {
                left: Math.min(bb1.left, bb2.left),
                right: Math.max(bb1.right, bb2.right),
                top: Math.min(bb1.top, bb2.top),
                bottom: Math.min(bb1.bottom, bb2.bottom)
            }
        },

        /////////////////////////////


        lineInterCircle: function(
            ptStart, // 线段起点
            ptEnd, // 线段终点
            ptCenter, // 圆心坐标
            radius,
            ptInter1,
            ptInter2) {

            ptInter1.x = ptInter2.x = 65536.0;
            ptInter2.y = ptInter2.y = 65536.0;

            // 线段长度
            var fDis = Math.sqrt((ptEnd.x - ptStart.x) * (ptEnd.x - ptStart.x) + (ptEnd.y - ptStart.y) * (ptEnd.y - ptStart.y));


            var r2 = radius * radius;

            var E = {};
            E.x = ptCenter.x - ptStart.x;
            E.y = ptCenter.y - ptStart.y;
            var e2 = E.x * E.x + E.y * E.y;


            var d = {};
            d.x = (ptEnd.x - ptStart.x) / fDis;
            d.y = (ptEnd.y - ptStart.y) / fDis;
            var a = E.x * d.x + E.y * d.y;
            var a2 = a * a;


            if ((r2 - e2 + a2) < 0) {
                return false;
            } else {
                var f = Math.sqrt(r2 - e2 + a2);

                var t = a - f;

                if (((t - 0.0) > -GeomUtils.ZERO) && (t - fDis) < GeomUtils.ZERO) {
                    ptInter1.x = ptStart.x + t * d.x;
                    ptInter1.y = ptStart.y + t * d.y;
                }

                t = a + f;

                if (((t - 0.0) > -GeomUtils.ZERO) && (t - fDis) < GeomUtils.ZERO) {
                    ptInter2.x = ptStart.x + t * d.x;
                    ptInter2.y = ptStart.y + t * d.y;
                }

                return true;
            }
        },

    };

    for (var p in _utils) {
        GeomUtils[p] = _utils[p];
    }

}(this));
