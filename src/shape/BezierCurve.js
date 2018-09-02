import Shape from './Shape';

class BezierCurve extends Shape {

    constructor() {
        super();
        
        this.type = 'beziercurve';
        this.brushTypeOnly = 'stroke';// 线条只能描边
        this.textPosition = 'end';
    }

    /**
     * 创建曲线路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        ctx.moveTo(style.xStart, style.yStart);
        if (typeof style.cpX2 != 'undefined'
            && typeof style.cpY2 != 'undefined'
        ) {
            ctx.bezierCurveTo(
                style.cpX1, style.cpY1,
                style.cpX2, style.cpY2,
                style.xEnd, style.yEnd
            );
        }
        else {
            ctx.quadraticCurveTo(
                style.cpX1, style.cpY1,
                style.xEnd, style.yEnd
            );
        }
        return this;
    }

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect(style) {
        var _minX = Math.min(style.xStart, style.xEnd, style.cpX1);
        var _minY = Math.min(style.yStart, style.yEnd, style.cpY1);
        var _maxX = Math.max(style.xStart, style.xEnd, style.cpX1);
        var _maxY = Math.max(style.yStart, style.yEnd, style.cpY1);
        var _x2 = style.cpX2;
        var _y2 = style.cpY2;

        if (typeof _x2 != 'undefined'
            && typeof _y2 != 'undefined'
        ) {
            _minX = Math.min(_minX, _x2);
            _minY = Math.min(_minY, _y2);
            _maxX = Math.max(_maxX, _x2);
            _maxY = Math.max(_maxY, _y2);
        }

        var lineWidth = style.lineWidth || 1;

        return {
            x: _minX - lineWidth,
            y: _minY - lineWidth,
            width: _maxX - _minX + lineWidth,
            height: _maxY - _minY + lineWidth
        };
    }
}

export default BezierCurve;