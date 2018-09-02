import Shape from './Shape';

class Rect extends Shape {

    constructor() {
        super();
        
        this.type = 'rect';
    }

    /**
     * 创建矩形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */
    buildPath(ctx, style) {
        ctx.moveTo(style.x, style.y);
        ctx.lineTo(style.x + style.width, style.y);
        ctx.lineTo(style.x + style.width, style.y + style.height);
        ctx.lineTo(style.x, style.y + style.height);
        ctx.lineTo(style.x, style.y);
        // ctx.rect(style.x, style.y, style.width, style.height);
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
            x: Math.round(style.x - lineWidth / 2),
            y: Math.round(style.y - lineWidth / 2),
            width: style.width + lineWidth,
            height: style.height + lineWidth
        };
    }
}

export default Rect;