import area from '../core/area';
/**
 * 1.基础配置
 * 2.变换
 * 3.样式
 * 4.交互属性
 * 5.事件
 * 
 */
class Shape {

    constructor() {

    }

    /**
     * 画刷
     * @param ctx       画布句柄
     * @param el         形状实体
     * @param isHighlight   是否为高亮状态
     * @param updateCallback 需要异步加载资源的shape可以通过这个callback(el)
     *                       让painter更新视图，shape.brush没用，需要的话重载brush
     */
    brush(ctx, el, isHighlight) {
        var style = el.style || {};
        var highlightStyle = el.highlightStyle || {};

        if (this.brushTypeOnly) {
            style.brushType = this.brushTypeOnly;
        }

        if (isHighlight) {
            style = this.getHighlightStyle(style, highlightStyle, this.brushTypeOnly);
        }

        if (this.brushTypeOnly == 'stroke') {
            style.strokeColor = style.strokeColor || style.color;
        }

        ctx.save();
        this.setContext(ctx, style);

        if (el.__needTransform) {
            ctx.transform.apply(ctx, this.updateTransform(el));
        }

        ctx.beginPath();
        this.buildPath(ctx, style);
        if (this.brushTypeOnly != 'stroke') {
            ctx.closePath();
        }

        switch (style.brushType) {
            case 'fill':
                ctx.fill();
                break;
            case 'stroke':
                ctx.stroke();
                break;
            case 'both':
                ctx.stroke();
                ctx.fill();
                break;
            default:
                ctx.fill();
        }

        if (style.text) {
            this.drawText(ctx, style, el.style);
        }

        ctx.restore();

        return this;
    }

    /**
     * 画布通用设置
     * @param ctx       画布句柄
     * @param style     通用样式
     */
    setContext(ctx, style) {
        if (style.color) {
            ctx.fillStyle = style.color;
        }
        if (style.strokeColor) {
            ctx.strokeColor = style.strokeColor;
        }
        if (typeof style.opcacity != 'undefined') {
            ctx.globalAlpha = style.opcacity;
        }
        if (style.lineCap) {
            ctx.lineCap = style.lineCap;
        }
        if (style.lineJoin) {
            ctx.lineCap = style.lineJoin;
        }
        if (style.miterLimit) {
            ctx.miterLimit = style.miterLimit;
        }
        if (typeof style.lineWidth != 'undefined') {
            ctx.lineWidth = style.lineWidth;
        }
        if (typeof style.shadowBlur != 'undefined') {
            ctx.shadowBlur = style.shadowBlur;
        }
        if (style.shadowColor) {
            ctx.shadowColor = style.shadowColor;
        }
        if (typeof style.shadowOffsetX != 'undefined') {
            ctx.shadowOffsetX = style.shadowOffsetX;
        }
        if (typeof style.shadowOffsetY != 'undefined') {
            ctx.shadowOffsetY = style.shadowOffsetY;
        }
    }

    /**
     * 附加文本
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     * @param {Object} normalStyle 默认样式，用于定位文字显示
     */
    drawText(ctx, style, normalStyle) {
        console.log('drawText:', style.text);
    }

    getHighlightStyle() {

    }

    getHighlightZoom() {

    }

    drift() {

    }

    /**
     * 默认区域包含判断
     * @param el 图形实体
     * @param x 横坐标
     * @param y 纵坐标
     */
    isCover(el, x, y) {
        var rect;
        if (el.style.__rect) {
            rect = el.style.__rect;
        } else {
            rect = this.getRect(el.style);
            rect = [
                rect.x, rect.x + rect.width,
                rect.y, rect.y + rect.height
            ];
            el.style.__rect = rect;
        }

        if (x >= rect[0] && x <= rect[1] && y >= rect[2] && y <= rect[3]) {
            return area.isInside(this, el.style, x, y);
        } else {
            return false;
        }
    }

    updateTransform() {
        console.log('updateTransform');
    }
}

export default Shape;