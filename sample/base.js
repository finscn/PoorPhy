var METER_TO_PX = 1;
var RENDER_SCALE = 30;
var DEFAULT_COLOR = "#ff6600";
var scale = 1;

function randomInt(min, max) {
    return min + (max - min + 1) * Math.random() >> 0;
}

function rotatePoints(points, ang) {
    var cos = Math.cos(ang),
        sin = Math.sin(ang);
    points.forEach(function(p) {
        var x = p[0],
            y = p[1];
        p[0] = x * cos - y * sin;
        p[1] = x * sin + y * cos;
    })
    return points;
}

function translatePoints(points, x, y) {
    x *= METER_TO_PX;
    y *= METER_TO_PX;
    points.forEach(function(p) {
        p[0] += x;
        p[1] += y;
    })
    return points;
}


function createRandomShape(w, h, x, y) {
    var r = (w + h) / 2 / 2;
    var i = randomInt(0, 2);
    var shape;
    switch (i) {
        case 0:
            shape = createCircleBody(r, x, y, randomInt(100, 314) / 100);
            break;
        case 1:
            shape = createRectBody(w, h, x, y, randomInt(100, 314) / 100);
            break;
        case 2:
            var v = createRandomPoly(randomInt(3, 8), w, h);
            shape = createPolyBody(v, x, y, randomInt(100, 314) / 100);
            break;
    }
    return shape;
}


function createPoly(n, radius) {
    radius *= METER_TO_PX;
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
}

function createRandomPoly(n, w, h) {

    w = w || 1;
    h = h || 1;
    w *= METER_TO_PX;
    h *= METER_TO_PX;

    n = n || 4;
    var radius = w / 2;
    var scaleX = scaleX || 1;
    var scaleY = scaleY || scaleX * h / w;

    var skew = Math.PI / 10;

    var skewX = w > h ? Math.tan(skew) : 0;
    var skewY = h > w ? Math.tan(skew) : 0;

    // console.log(skewX,skewY)
    var vertices = [];
    var perAng = Math.PI * 2 / n;
    var fix = perAng * 100 >> 2;
    for (var i = 0; i < n; i++) {
        var ang = perAng * i + randomInt(-fix, fix) / 100;
        var _x = radius * Math.cos(ang);
        var _y = radius * Math.sin(ang);

        var px = _x * scaleX + _y * scaleY * skewX;
        var py = _y * scaleY + _x * scaleX * skewY;
        vertices.push([px, py]);
    }
    return vertices;
}


function createRect(w, h) {

    w = w || 1;
    h = h || 1;
    w *= METER_TO_PX;
    h *= METER_TO_PX;

    var vertices = [
        [-w / 2, -h / 2],
        [w / 2, -h / 2],
        [w / 2, h / 2],
        [-w / 2, h / 2]
    ];

    return vertices;
}

function createSegment(len) {
    len = len || 1;
    var vertices = [
        [-len / 2, 0],
        [len / 2, 0]
    ];

    return vertices;
}


function createPolyBody(n, r, x, y, angle, type, addToWorld) {
    // function createPolyBody(vertices,x,y,angle,type){
    var vertices;
    if (Array.isArray(n)) {
        vertices = n;
        addToWorld = type;
        type = angle;
        angle = y;
        y = x;
        x = r;
    } else {
        vertices = createPoly(n, r);
    }
    vertices = rotatePoints(vertices, angle || 0);
    vertices = translatePoints(vertices, x * scale, y * scale);

    var body = new PP.Polygon({
            vertices: vertices,
            friction: friction,
            restitution: restitution
        })
        // PP.BodyType.Static;
    if (type !== undefined && type !== null) {
        body.bodyType = type;
    }
    if (body.bodyType === PP.BodyType.Static) {
        body.mass = Infinity;
    }
    if (addToWorld !== false) {
        body.init();
        world.addBody(body);
    }
    return body;
}

function createRectBody(w, h, x, y, angle, type, addToWorld) {
    var vertices = createRect(w * scale, h * scale);
    vertices = rotatePoints(vertices, angle || 0);
    vertices = translatePoints(vertices, x * scale, y * scale);

    var body = new PP.Polygon({
            vertices: vertices,
            friction: friction,
            restitution: restitution
        })
        // PP.BodyType.Static;
    if (type !== undefined && type !== null) {
        body.bodyType = type;
    }
    if (body.bodyType === PP.BodyType.Static) {
        body.mass = Infinity;
    }
    if (addToWorld !== false) {
        body.init();
        world.addBody(body);
    }
    return body;

}


function createPolylineBody(vertices, type, addToWorld) {
    var body = new PP.Polyline({
        vertices: vertices,
        friction: friction,
        restitution: restitution
    });
    if (type !== undefined && type !== null) {
        body.bodyType = type;
    }
    if (body.bodyType === PP.BodyType.Static) {
        body.mass = Infinity;
    }
    if (addToWorld !== false) {
        body.init();
        world.addBody(body);
    }
    return body;
}

function createSegmentBody(len, x, y, angle, type, addToWorld) {

    var vertices = createSegment(len * scale);
    vertices = rotatePoints(vertices, angle || 0);
    vertices = translatePoints(vertices, x * scale, y * scale);

    var body = new PP.Segment({
        vertices: vertices,
        friction: friction,
        restitution: restitution
    })
    if (type !== undefined && type !== null) {
        body.bodyType = type;
    }
    if (body.bodyType === PP.BodyType.Static) {
        body.mass = Infinity;
    }
    if (addToWorld !== false) {
        body.init();
        world.addBody(body);
    }
    return body;

}

function createCircleBody(r, x, y, angle, type, mass, addToWorld) {
    var body = new PP.Circle({
        radius: r * scale,
        x: x * scale,
        y: y * scale,
        angle: angle || 0,
        friction: friction,
        mass: mass || mass === 0 ? mass : null,
        restitution: restitution
    })

    if (type !== undefined && type !== null) {
        body.bodyType = type;
    }
    if (body.bodyType === PP.BodyType.Static) {
        body.mass = Infinity;
    }
    if (addToWorld !== false) {
        body.init();
        world.addBody(body);
    }
    return body;

}


function createCompositionBody(shapes, type, addToWorld) {
    var comp = new PP.Composition({
        shapes: shapes,
        bodyType: type,
    });
    if (comp.bodyType === PP.BodyType.Static) {
        comp.mass = Infinity;
    }
    if (addToWorld !== false) {
        comp.init();
        world.addBody(comp);
    }
    return comp;
}

function drawBody(context, body, color) {
    if (body.shapes) {
        drawComp(context, body, color)
    } else {
        if (body.center) {
            drawCircle(context, body, color)
        } else {
            drawPoly(context, body, color);
        }
    }
}

function drawBodies(context, bodies, color) {
    color = color || DEFAULT_COLOR;
    var oa = context.globalAlpha;
    for (var i = 0, len = bodies.length; i < len; i++) {
        var body = bodies[i];
        var _color = body.sleeping ? "#e3e3e3" : color;
        var alpha = ("alpha" in body) ? (body.alpha || 0) : 1;
        context.globalAlpha = alpha;
        drawBody(context, body, _color);
    }
    context.globalAlpha = oa || 1;

}

function drawComp(context, comp, color) {
    comp.shapes.forEach(function(p) {
        if (p.center) {
            drawCircle(context, p, color)
        } else {
            drawPoly(context, p, color);
        }
    });
    drawPoint(context, comp.x, comp.y, color)
}

function drawPoly(context, poly, color) {

    var drawNormal = false;

    context.strokeStyle = color || DEFAULT_COLOR;
    context.fillStyle = color || DEFAULT_COLOR;
    if (!poly.vertices) {
        return;
    }
    var a = poly.vertices[0];
    var first = a;
    context.beginPath();
    context.moveTo(a[0] * RENDER_SCALE, a[1] * RENDER_SCALE);
    for (var j = 1; j < poly.vertexCount; j++) {
        var a = poly.vertices[j];
        context.lineTo(a[0] * RENDER_SCALE, a[1] * RENDER_SCALE);
        if (drawNormal) {
            var n = poly.normals[j];
            var _v0 = a[0] * RENDER_SCALE,
                _v1 = a[1] * RENDER_SCALE;
            context.moveTo(_v0, _v1);
            context.lineTo(_v0 + n[0] * 50, _v1 + n[1] * 50);
            context.moveTo(_v0, _v1);
        }
    }
    context.lineTo(first[0] * RENDER_SCALE, first[1] * RENDER_SCALE);

    if (drawNormal) {
        var n = poly.normals[0];
        var _v0 = first[0] * RENDER_SCALE,
            _v1 = first[1] * RENDER_SCALE;
        context.moveTo(_v0, _v1);
        context.lineTo(_v0 + n[0] * 50, _v1 + n[1] * 50);
    }

    context.stroke()
    context.closePath();

    context.strokeRect(poly.x * RENDER_SCALE - 2, poly.y * RENDER_SCALE - 2, 4, 4)

}

function drawPolyline(context, polyline, color) {
    var bak = context.strokeStyle;
    context.strokeStyle = color || bak;
    context.beginPath();
    context.moveTo(polyline[0][0], polyline[0][1]);
    for (var i = 1, len = polyline.length; i < len; i++) {
        context.lineTo(polyline[i][0], polyline[i][1]);
    }
    context.stroke();
    context.closePath();
    context.strokeStyle = bak;
}


function drawPoint(context, x, y, color) {
    if (Array.isArray(x)) {
        color = y;
        y = x[1]
        x = x[0]
    }
    context.strokeStyle = color || DEFAULT_COLOR;
    context.strokeRect(x * RENDER_SCALE - 2, y * RENDER_SCALE - 2, 4, 4);
}

function drawCircle(context, circle, color) {
    context.strokeStyle = color || DEFAULT_COLOR;
    context.fillStyle = color || DEFAULT_COLOR;

    var x = circle.x;
    var y = circle.y;

    var r = circle.radius * RENDER_SCALE;
    var c = circle.center;

    // in the context.arc path , if draw other things will trigger one chrome's bug.
    context.beginPath();
    context.arc(c[0] * RENDER_SCALE, c[1] * RENDER_SCALE, r, 0, Math.PI * 2, false);
    context.stroke()
        // context.fill();
    context.closePath();
    // console.log(circle.cos,circle.sin)
    // drawLine(context, x, y, x + circle.radius * circle.cos, y + circle.radius * circle.sin, color);
    drawLine(context, c[0], c[1], c[0] + circle.radius * circle.cos, c[1] + circle.radius * circle.sin, color);
    context.fillRect(c[0] * RENDER_SCALE - 3, c[1] * RENDER_SCALE - 3, 6, 6)
    context.strokeRect(x * RENDER_SCALE - 1, y * RENDER_SCALE - 1, 2, 2)

}

function drawLine(context, x1, y1, x2, y2, color) {
    context.strokeStyle = color || DEFAULT_COLOR;
    context.beginPath();
    context.moveTo(x1 * RENDER_SCALE, y1 * RENDER_SCALE);
    context.lineTo(x2 * RENDER_SCALE, y2 * RENDER_SCALE);
    context.stroke();
    context.closePath();
}


function drawArbiter(context, collideManager) {
    var colors = ["#66ff66", "#ff66ff", "#6666ff"];
    var colors = ["#33ff66"];

    var arbiters = collideManager.arbiters;
    var arbiterCount = collideManager.arbiterCount;

    for (var i = 0; i < arbiterCount; i++) {
        var arbiter = arbiters[i];
        var contacts = arbiter.contacts;
        context.strokeStyle = colors[i % 3];
        for (var k = 0; k < contacts.length; k++) {
            var contact = contacts[k];
            var p1 = contact.contactOnA,
                p2 = contact.contactOnB;
            context.strokeRect(p1[0] * RENDER_SCALE - 2, p1[1] * RENDER_SCALE - 2, 4, 4);
            context.strokeRect(p2[0] * RENDER_SCALE - 2, p2[1] * RENDER_SCALE - 2, 4, 4);
        }

    }
}

function getElementPosition(element) {
    var elem = element,
        tagname = "",
        x = 0,
        y = 0;

    while ((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
        y += elem.offsetTop;
        x += elem.offsetLeft;
        tagname = elem.tagName.toUpperCase();

        if (tagname == "BODY")
            elem = 0;

        if (typeof(elem) == "object") {
            if (typeof(elem.offsetParent) == "object")
                elem = elem.offsetParent;
        }
    }

    return {
        x: x,
        y: y
    };
}
