import Shape from './Shape';

class BrokenLine extends Shape {

    constructor() {
        super();
        
        this.type = 'brokenline';
        this.brushTypeOnly = 'stroke';// 线条只能描边
        this.textPosition = 'end';
    }

    /**
     * 创建折线路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        var pointList = style.pointList;
        if (pointList.length < 2) {
            // 少于2个点就不画了~
            return;
        }
        if (!style.lineType || style.lineType == 'solid') {
            //默认为实线
            ctx.moveTo(pointList[0][0],pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                ctx.lineTo(pointList[i][0],pointList[i][1]);
            }
        }
        else if (style.lineType == 'dashed'
                || style.lineType == 'dotted'
        ) {
            //画虚线的方法  by loutongbing@baidu.com
            var lineWidth = style.lineWidth || 1;
            var dashPattern = [
                lineWidth * (style.lineType == 'dashed' ? 6 : 1),
                lineWidth * 4
            ];
            ctx.moveTo(pointList[0][0],pointList[0][1]);
            for (var i = 1, l = pointList.length; i < l; i++) {
                var fromX = pointList[i - 1][0];
                var toX = pointList[i][0];
                var fromY = pointList[i - 1][1];
                var toY = pointList[i][1];
                var dx = toX - fromX;
                var dy = toY - fromY;
                var angle = Math.atan2(dy, dx);
                var x = fromX;
                var y = fromY;
                var idx = 0;
                var draw = true;
                var dashLength;
                var nx;
                var ny;

                while (!((dx < 0 ? x <= toX : x >= toX)
                        && (dy < 0 ? y <= toY : y >= toY))
                ) {
                    dashLength = dashPattern[
                        idx++ % dashPattern.length
                    ];
                    nx = x + (Math.cos(angle) * dashLength);
                    x = dx < 0 ? Math.max(toX, nx) : Math.min(toX, nx);
                    ny = y + (Math.sin(angle) * dashLength);
                    y = dy < 0 ? Math.max(toY, ny) : Math.min(toY, ny);
                    if (draw) {
                        ctx.lineTo(x, y);
                    }
                    else {
                        ctx.moveTo(x, y);
                    }
                    draw = !draw;
                }
            }
        }
        return this;
    }

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect(style) {
        var minX =  Number.MAX_VALUE;
        var maxX =  Number.MIN_VALUE;
        var minY = Number.MAX_VALUE;
        var maxY = Number.MIN_VALUE;

        var pointList = style.pointList;
        for(var i = 0, l = pointList.length; i < l; i++) {
            if (pointList[i][0] < minX) {
                minX = pointList[i][0];
            }
            if (pointList[i][0] > maxX) {
                maxX = pointList[i][0];
            }
            if (pointList[i][1] < minY) {
                minY = pointList[i][1];
            }
            if (pointList[i][1] > maxY) {
                maxY = pointList[i][1];
            }
        }

        var lineWidth;
        if (style.brushType == 'stroke' || style.brushType == 'fill') {
            lineWidth = style.lineWidth || 1;
        }
        else {
            lineWidth = 0;
        }
        return {
            x: Math.round(minX - lineWidth / 2),
            y: Math.round(minY - lineWidth / 2),
            width: maxX - minX + lineWidth,
            height: maxY - minY + lineWidth
        };
    }
}

export default BrokenLine;