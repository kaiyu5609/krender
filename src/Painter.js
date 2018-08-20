
class Painter {
    /**
     * 绘图类 (V)
     * @param {HTMLElement} root 绘图区域
     * @param {storage} storage Storage实例
     * @param {Object} shape 图形库
     */
    constructor(root, storage, shape) {
        this.root = root;
        this.storage = storage;
        this.shape = shape;

        this._domList = {};// canvas dom元素
        this._ctxList = {};// canvas 2D context对象，与domList对应

        this._maxZlevel = 0;// 最大zlevel，缓存记录

        this._domRoot = document.createElement('div');
        this._domRoot.onselectstart = function() {
            return false;
        };

        this._width;// 宽，缓存记录
        this._height;// 高，缓存记录

        this._init();
    }

    _init() {
        this.root.innerHTML = '';
        this._domRoot.innerHTML = '';

        this._width = this._getWidth();
        this._height = this._getHeight();
        
        this._domRoot.style.position = 'relative';
        this._domRoot.style.overflow = 'hidden';
        this._domRoot.style.width = this._width + 'px';
        this._domRoot.style.height = this._height + 'px';

        this.root.appendChild(this._domRoot);

        this._domList = {};
        this._ctxList = {};

        this._maxZlevel = this.storage.getMaxZlevel();

        this._domList['bg'] = this._createDom('bg', 'div');
        this._domRoot.appendChild(this._domList['bg']);

        for (var i = 0; i <= this._maxZlevel; i++) {
            this._domList[i] = this._createDom(i, 'canvas');
            this._domRoot.appendChild(this._domList[i]);
            this._ctxList[i] = this._domList[i].getContext('2d');
        }

        this._domList['hover'] = this._createDom('hover', 'canvas');
        this._domList['hover'].id = '_krender_hover_';
        this._domRoot.appendChild(this._domList['hover']);
        this._ctxList['hover'] = this._domList['hover'].getContext('2d');
    }

    _getWidth() {
        var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
        return this.root.clientWidth - stl.paddingLeft.replace(/\D/g, '') - stl.paddingRight.replace(/\D/g, '');
    }

    _getHeight() {
        var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
        return this.root.clientHeight - stl.paddingTop.replace(/\D/g, '') - stl.paddingBottom.replace(/\D/g, '');
    }

    /**
     * 检查_maxZlevel是否变大，如是则同步创建需要的Canvas
     */
    _syncMaxZlevelCanvase() {
        var curMaxZlevel = this.storage.getMaxZlevel();
        if (this._maxZlevel < curMaxZlevel) {
            for (var i = this._maxZlevel + 1; i <= curMaxZlevel; i++) {
                this._domList[i] = this.createDom(i, 'canvas');
                this._domRoot.insertBefore(this._domList[i], this._domList['hover']);
                this._ctxList[i] = this._domList[i].getContext('2d');
            }
            this._maxZlevel = curMaxZlevel;
        }
    }

    /**
     * 创建dom
     * @param {string} id dom id 待用
     * @param {string} type : dom type， such as canvas, div etc.
     */
    _createDom(id, type) {
        var newDom = document.createElement(type);
        newDom.style.position = 'absolute';
        newDom.style.width = this._width + 'px';
        newDom.style.height = this._height + 'px';
        newDom.setAttribute('width', this._width);
        newDom.setAttribute('height', this._height);
        newDom.setAttribute('data-id', id);
        return newDom;
    }

    /**
     * 刷画图形
     * @param {Object} changedZlevel 需要更新的zlevel索引
     */
    _brush(changedZlevel) {
        var self = this;

        return (el) => {
            if (
                (changedZlevel.all || changedZlevel[el.zlevel]) 
                && !el.invisible
            ) {
                var ctx = self._ctxList[el.zlevel];
                if (ctx) {
                    if (!el.onbrush || (el.onbrush && !el.onbrush(ctx, el, false))) {
                        self.shape.get(el.shape).brush(ctx, el, false, self.update);
                    }
                } else {
                    throw new Error('can not find the specfic zlevel canvas!');
                }
            }
        };
    }

    /**
     * 鼠标悬浮刷画
     */
    _brushHover(el) {
        var ctx = this._ctxList['hover'];

        if (!el.onbrush// 没有onbrush
            // 有onbrush并没有调用执行返回false或undefined则继续粉刷
            || (el.onbrush && !el.onbrush(ctx, el, true))
        ) {
            this.shape.get(el.shape).brush(ctx, el, true, self.update);
        }
    }

    /**
     * 首次绘图，创建各种dom和context
     * @param {Function} callback 绘画结束后的回调函数
     */
    render(callback) {

        this._syncMaxZlevelCanvase();

        this.storage.iterShape(this._brush({ all: true }), { normal: 'up' });

        this.storage.clearChangedZlevel();

        if (typeof callback == 'function') {
            callback();
        }
        return this;
    }

    /**
     * 刷新
     * @param {Function} callback 刷新结束后的回调函数
     */
    refresh(callback) {
        this._syncMaxZlevelCanvase();

        var changedZlevel = this.storage.getChangedZlevel();

        if (changedZlevel.all) {
            this.clear();
        } else {
            for (var k in changedZlevel) {
                if (this._ctxList[k]) {
                    this._ctxList[k].clearRect(0, 0, this._width, this._height);
                }
            }
        }

        this.storage.iterShape(this._brush(changedZlevel).bind(this), { normal: 'up' });
        this.storage.clearChangedZlevel();

        if (typeof callback === 'function') {
            callback();
        }

        return this;
    }

    /**
     * 视图更新
     * @param {Array} shapeList 需要更新的图形元素列表
     * @param {Function} callback  视图更新后回调函数
     */
    update(shapeList, callback) {
        console.log('update');

        return this;
    }

    /**
     * 清除hover层外所有内容
     */
    clear() {
        for (var k in this._ctxList) {
            if (k == 'hover') {
                this._ctxList[k].clearRect(0, 0, this._width, this._height);
            }
        }
        return this;
    }

    /**
     * 刷新hover层
     */
    refreshHover() {
        this.clearHover();

        this.storage.iterShape(this._brushHover.bind(this), { hover: true });
        this.storage.delHover();
        return this;
    }

    /**
     * 清除hover层所有内容
     */
    clearHover() {
        this._ctxList && this._ctxList['hover'] && this._ctxList['hover'].clearRect(0, 0, this._width, this._height);
        return this;
    }

    getDomHover() {
        return this._domList['hover'];
    }

    dispose() {
        this.root.innerHTML = '';
        this.root = null;
        this.storage = null;
        this.shape = null;

        this._domList = null;
        this._domRoot = null;
        this._ctxList = null;

        return;
    }
}

export default Painter;