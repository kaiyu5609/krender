import Shape from './Shape';

class Path extends Shape {

    constructor() {
        super();
        
        this.type = 'path';
    }

    _parsePathData(data) {
        // data = "M 0 0 L -100 100 L 100 100 Z";
        if (!data) {
            return [];
        }

        var cs = data;

        var cc = [
            'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
            'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
        ];

        cs = cs.replace(/  /g, ' ');
        cs = cs.replace(/ /g, ',');
        cs = cs.replace(/,,/g, ',');
        // cs = "M,0,0,L,-100,100,L,100,100,Z";

        var n;
        for (n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // cs = "|M,0,0,|L,-100,100,|L,100,100,|Z";

        var arr = cs.split('|');
        // arr = ["", "M,0,0,", "L,-100,100,", "L,100,100,", "Z"];

        var ca = [];
        var cpx = 0;
        var cpy = 0;
        
        for (n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            str = str.replace(new RegExp('e,-', 'g'), 'e-');

            var p = str.split(',');
            if (p.length > 0 && p[0] === '') {
                p.shift();
            }

            for (var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }

            while (p.length > 0) {
                if (isNaN(p[0])) {
                    break;
                }
                var cmd = null;
                var points = [];

                var ctlPtx;
                var ctlPty;
                var prevCmd;

                var rx;
                var ry;
                var psi;
                var fa;
                var fs;

                var x1 = cpx;
                var y1 = cpy;

                // convert l, H, h, V, and v to L
                switch (c) {
                case 'l':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'L':
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'm':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'l';
                    break;
                case 'M':
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'L';
                    break;

                case 'h':
                    cpx += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'H':
                    cpx = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'v':
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'V':
                    cpy = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'C':
                    points.push(p.shift(), p.shift(), p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'c':
                    points.push(
                        cpx + p.shift(), cpy + p.shift(),
                        cpx + p.shift(), cpy + p.shift()
                    );
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 'S':
                    ctlPtx = cpx;
                    ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 's':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(
                        ctlPtx, ctlPty,
                        cpx + p.shift(), cpy + p.shift()
                    );
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 'Q':
                    points.push(p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'q':
                    points.push(cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q';
                    points.push(cpx, cpy);
                    break;
                case 'T':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 't':
                    ctlPtx = cpx, ctlPty = cpy;
                    prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 'A':
                    rx = p.shift();
                    ry = p.shift();
                    psi = p.shift();
                    fa = p.shift();
                    fs = p.shift();

                    x1 = cpx, y1 = cpy;
                    cpx = p.shift(), cpy = p.shift();
                    cmd = 'A';
                    points = this._convertPoint(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                    );
                    break;
                case 'a':
                    rx = p.shift();
                    ry = p.shift();
                    psi = p.shift();
                    fa = p.shift();
                    fs = p.shift();

                    x1 = cpx, y1 = cpy;
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'A';
                    points = this._convertPoint(
                        x1, y1, cpx, cpy, fa, fs, rx, ry, psi
                    );
                    break;

                }

                ca.push({
                    command : cmd || c,
                    points : points
                });
            }

            if (c === 'z' || c === 'Z') {
                ca.push({
                    command : 'z',
                    points : []
                });
            }
        }

        return ca;
    }

    _convertPoint(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0
                 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0
                 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry))
                - ((rx * rx) * (yp * yp))
                - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp)
                + (ry * ry) * (xp * xp))
            );

        if (fa === fs) {
            f *= -1;
        }
        if (isNaN(f)) {
            f = 0;
        }

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0
                 + Math.cos(psi) * cxp
                 - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0
                + Math.sin(psi) * cxp
                + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1)
                    * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([ 1, 0 ], [ (xp - cxp) / rx, (yp - cyp) / ry ]);
        var u = [ (xp - cxp) / rx, (yp - cyp) / ry ];
        var v = [ (-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry ];
        var dTheta = vAngle(u, v);

        if (vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if (vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if (fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if (fs === 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [ cx, cy, rx, ry, theta, dTheta, psi, fs ];
    }

    /**
     * 创建路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        var path = style.path;
        var pathArray = this._parsePathData(path);

        for (var i = 0; i < pathArray.length; i++) {
            var c = pathArray[i].command;
            var p = pathArray[i].points;
            // 平移变换
            for (var j = 0; j < p.length; j++) {
                if (j % 2 === 0) {
                    p[j] += style.x;
                } else {
                    p[j] += style.y;
                }
            }
            switch (c) {
                case 'L':
                    ctx.lineTo(p[0], p[1]);
                    break;
                case 'M':
                    ctx.moveTo(p[0], p[1]);
                    break;
                case 'C':
                    ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                    break;
                case 'Q':
                    ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                    break;
                case 'A':
                    var cx = p[0];
                    var cy = p[1];
                    var rx = p[2];
                    var ry = p[3];
                    var theta = p[4];
                    var dTheta = p[5];
                    var psi = p[6];
                    var fs = p[7];
                    var r = (rx > ry) ? rx : ry;
                    var scaleX = (rx > ry) ? 1 : rx / ry;
                    var scaleY = (rx > ry) ? ry / rx : 1;

                    ctx.translate(cx, cy);
                    ctx.rotate(psi);
                    ctx.scale(scaleX, scaleY);
                    ctx.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                    ctx.scale(1 / scaleX, 1 / scaleY);
                    ctx.rotate(-psi);
                    ctx.translate(-cx, -cy);
                    break;
                case 'z':
                    ctx.closePath();
                    break;
            }
        }

        return this;
    }

    /**
     * 返回矩形区域，用于局部刷新和文字定位。(不准确有问题，TODO)
     * @param {Object} style
     */
    getRect(style) {
        var lineWidth;
        if (style.brushType == 'stroke' || style.brushType == 'fill') {
            lineWidth = style.lineWidth || 1;
        }
        else {
            lineWidth = 0;
        }
        var rect = {
            x : Math.round(style.x - lineWidth / 2),
            y : Math.round(style.y - lineWidth / 2)
        };

        var minX = Number.MAX_VALUE;
        var maxX = Number.MIN_VALUE;

        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;

        var pathArray = this._parsePathData(style.path);
        for (var i = 0; i < pathArray.length; i++) {
            var p = pathArray[i].points;

            for (var j = 0; j < p.length; j++) {
                if (j % 2 === 0) {
                    if (p[j] < minX) {
                        minX = p[j];
                    }
                    if (p[j] > maxX) {
                        maxX = p[j];
                    }
                } else {
                    if (p[j] < minY) {
                        minY = p[j];
                    }
                    if (p[j] > maxY) {
                        maxY = p[j];
                    }
                }
            }
        }
        if (minX === Number.MAX_VALUE
            || maxX === Number.MIN_VALUE
            || minY === Number.MAX_VALUE
            || maxY === Number.MIN_VALUE
        ) {
            rect.width = 0;
            rect.height = 0;
        }
        else {
            rect.width = maxX - minX + lineWidth;
            rect.height = maxY - minY + lineWidth;
        }

        return rect;
    }
}

export default Path;