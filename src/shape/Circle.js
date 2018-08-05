import Shape from './Shape';

class Circle extends Shape {

    constructor() {
        super();
        
        this.type = 'circle';
    }

    /**
     * 创建圆形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        ctx.arc(style.x, style.y, style.r, 0, Math.PI * 2, true);
        return this;
    }

    /**
     * 返回矩形区域，用于局部刷新和文字定位
     * @param {Object} style
     */
    getRect(style) {
        var lineWidth;
        if (style.brushType == 'stroke' || style.brushType == 'fill') {
            lineWidth = style.lineWidth || 1;
        } else {
            lineWidth = 0;
        }
        return {
            x: Math.round(style.x - style.r - lineWidth / 2),
            y: Math.round(style.y - style.r - lineWidth / 2),
            width: style.r * 2 + lineWidth,
            height: style.r * 2 + lineWidth
        };
    }
}

export default Circle;