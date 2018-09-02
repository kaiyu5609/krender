import Shape from './Shape';

class Line extends Shape {

    constructor() {
        super();
        
        this.type = 'line';
        this.brushTypeOnly = 'stroke';// 线条只能描边
        this.textPosition = 'end';
    }

    /**
     * 创建直线路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        if (!style.lineType || style.lineType == 'solid') {
            //默认为实线
            ctx.moveTo(style.xStart, style.yStart);
            ctx.lineTo(style.xEnd, style.yEnd);
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
            var fromX = style.xStart;
            var toX = style.xEnd;
            var fromY = style.yStart;
            var toY = style.yEnd;
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

            ctx.moveTo(fromX, fromY);
            while (!((dx < 0 ? x <= toX : x >= toX)
                      && (dy < 0 ? y <= toY : y >= toY))
            ) {
                dashLength = dashPattern[idx++ % dashPattern.length];
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
        
        return this;
    }

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect(style) {
        var lineWidth = style.lineWidth || 1;

        return {
            x : Math.min(style.xStart, style.xEnd) - lineWidth,
            y : Math.min(style.yStart, style.yEnd) - lineWidth,
            width : Math.abs(style.xStart - style.xEnd) + lineWidth,
            height : Math.abs(style.yStart - style.yEnd) + lineWidth
        };
    }
}

export default Line;