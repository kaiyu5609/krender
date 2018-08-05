import config from './config';
import EventEmitter from './core/EventEmitter';

class Handler extends EventEmitter {
    /**
     * 控制类 (C)
     * @param {HTMLElement} root 绘图区域
     * @param {storage} storage Storage实例
     * @param {painter} painter Painter实例
     * @param {Object} shape 图形库
     *
     * 分发事件支持详见config.EVENT
     */
    constructor(root, storage, painter, shape) {
        super();
        
        this.root = root;
        this.storage = storage;
        this.painter = painter;
        this.shape = shape;

        this._event;// 原生dom事件
        this._hasfound = false;// 是否找到hover的图形元素
        this._lastHover = null;// 最后一个hover的图形元素
        this._draggingTarget = null;
        this._isMouseDown = false;
        this._isDragging = false;
        this._lastTouchMoment;

        this._lastX = 0;
        this._lastY = 0;
        this._mouseX = 0;
        this._mouseY =0;

        this._domHover = painter.getDomHover();

        this._bindEvents();
    }

    /**
     * 初始化，事件绑定
     */
    _bindEvents() {
        if (window.addEventListener) {
            window.addEventListener('resize', this._resizeHandler.bind(this));
            this.root.addEventListener('click', this._clickHandler.bind(this));
            this.root.addEventListener('mousemove', this._mouseMoveHandler.bind(this));

        } else {
            window.attachEvent('onresize', this._resizeHandler.bind(this));
            this.root.attachEvent('onclick', this._clickHandler.bind(this));
            this.root.attachEvent('onmousemove', this._mouseMoveHandler.bind(this));
        }
    }

    /**
     * 鼠标（手指）移动响应函数
     * @param {event} event dom事件对象
     */
    _mouseMoveHandler(event) {
        console.log('mousemove:', event);
    }

    /**
     * 窗口大小改变响应函数
     * @param {event} event dom事件对象
     */
    _resizeHandler(event) {
        this._event = event || window.event;
        this._lastHover = null;
        this._isMouseDown = false;
        this.fire(config.EVENT.RESIZE, this._event);
    }

    /**
     * 点击事件
     * @param {event} event dom事件对象
     */
    _clickHandler(event) {
        this._event = this._zrenderEventFixed(event);
        if (!this._lastHover) {
            this._dispatchAgency(this._lastHover, config.EVENT.CLICK);
        } else if (this._lastHover && this._lastHover.clickable) {
            this._dispatchAgency(this._lastHover, config.EVENT.CLICK);
        }
        this._mouseMoveHandler(this._event);
    }

    // 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标
    _zrenderEventFixed(event, isTouch) {
        if (!isTouch) {
            this._event = event || window.event;
            var target = this._event.toElement
                      || this._event.relatedTarget
                      || this._event.srcElement
                      || this._event.target;
            if (target && target != this._domHover) {
                this._event.krenderX = (typeof this._event.offsetX != 'undefined' ? this._event.offsetX : this._event.layerX) + target.offsetLeft;
                this._event.krenderY = (typeof this._event.offsetY != 'undefined' ? this._event.offsetY : this._event.layerY) + target.offsetTop;
            }
        } else {
            this._event = event;
            var touch = this._event.type != 'touchend' ? this._event.targetTouches[0] : this._event.changedTouches[0];
            if (touch) {
                this._event.krenderX = touch.clientX - this.root.offsetLeft + document.body.scrollLeft;
                this._event.krenderY = touch.clientY - this.root.offsetTop + document.body.srcollTop;
            }
        }
        return this._event;
    } 

    /**
     * 事件分发代理
     * @param {Object} targetShape 目标图形元素
     * @param {string} eventName 事件名称
     * @param {Object} draggedShape 拖拽事件特有，当前被拖拽图形元素
     */
    _dispatchAgency(targetShape, eventName, draggedShape) {
        var eventHandler = 'on' + eventName, _event = this._event;

        var eventPacket = {
            type: eventName,
            event: _event,
            target: targetShape
        };
        
        if (draggedShape) {
            eventPacket.dragged = draggedShape;
        }
        if (targetShape) {
            // “不存在shape级事件”或“存在shape级事件但事件回调返回非true”
            if (!targetShape[eventHandler] || !targetShape[eventHandler](eventPacket)) {
                this.fire(eventName, _event, eventPacket);
            }
        } else if (!draggedShape) {
            // 无hover目标，无拖拽对象，原生事件分发
            this.fire(eventName, _event);
        }
    }

    /**
     * 释放
     */
    dispose() {
        if (window.removeEventListener) {
            window.removeEventListener('resize', this._resizeHandler);
            this.root.removeEventListener('click', this._clickHandler);
            this.root.removeEventListener('mousemove', this._mouseMoveHandler);
        } else {
            window.detachEvent('onresize', this._resizeHandler);
            this.root.detachEvent('onclick', this._clickHandler);
            this.root.detachEvent('onmousemove', this._mouseMoveHandler);
        }

        this.root = null;
        this._domHover = null;
        this.storage = null;
        this.painter = null;
        this.shape = null;

        this.off();
    }
}

export default Handler;