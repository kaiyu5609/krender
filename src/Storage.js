import krUtil from './core/util';


class Storage {
    /**
     * 内容仓库 (M)
     * @param {Object} shape 图形库
     */
    constructor(shape) {
        // 图形数据id自增基础
        this._isBase = 0;
        // 所有常规形状，id索引的map
        this._elements = {};
        // 所有形状的z轴方向排列，提高遍历性能，zElements[0]的形状在zElements[1]形状下方
        this._zElements = [];
        // 高亮层形状，不稳定，动态增删，数组位置也是z轴方向，靠前显示在下方
        this._hoverElements = [];
        // 最大zlevel
        this._maxZlevel = 0;
        // 有数据改变的zlevel
        this._changedZlevel = {};
    }

    /**
     * 唯一标识id生成
     * @param {string} idHead 标识前缀
     */
    newShapeId(idHead) {
        return (idHead || '') + (++this._isBase);
    }

    /**
     * 快速判断标志~
     * e.__silent 是否需要hover判断
     * e.__needTransform 是否需要进行transform
     * e.style.__rect 区域矩阵缓存，修改后清空，重新计算一次
     */
    _mark(el) {
        if (
            el.hoverable || el.onclick || el.draggable 
            || el.onmousemove || el.onmouseover || el.onmouseout || el.onmousedown || el.onmouseup 
            || el.ondragenter || el.ondragover || el.ondragleave || el.ondrop
        ) {
            el.__silent = false;
        } else {
            el.__silent = true;
        }

        if (
            Math.abs(el.rotation[0]) > 0.0001
            || Math.abs(el.position[0]) > 0.0001 || Math.abs(el.position[1]) > 0.0001
            || Math.abs(el.scale[0] - 1) > 0.0001 || Math.abs(el.scale[1] - 1) > 0.0001
        ) {
            el.__needTransform = true;
        } else {
            el.__needTransform = false;
        }

        el.style = el.style || {};
        el.style.__rect = null;
    }

    /**
     * 添加
     * @param {Object} shape 参数
     */
    add(shape) {
        var self = this;
        var el = {
            'shape': 'circle',// 形状
            'id': shape.id || self.newShapeId(),// 唯一标识
            'zlevel': 0,// z轴位置
            'draggable': false,// 可拖拽
            'clickable': false,// 可点击
            'hoverable': true,// 可悬浮
            'position': [0, 0],
            'rotation': [0, 0, 0],
            'scale': [1, 1, 0, 0]
        };

        krUtil.merge(el, shape, {
            'overwrite': true, 'recursive': true
        });

        this._mark(el);

        this._elements[el.id] = el;
        this._zElements[el.zlevel] = this._zElements[el.zlevel] || [];
        this._zElements[el.zlevel].push(el);

        this._maxZlevel = Math.max(this._maxZlevel, el.zlevel);
        this._changedZlevel[el.zlevel] = true;
    }

    /**
     * 修改
     * @param {string} idx 唯一标识
     * @param {Object} shape参数
     */
    mod(shapeId, shape) {
        var el = this._elements[shapeId];

        if (el) {
            this._changedZlevel[el.zlevel] = true;

            krUtil.merge(el, shape, {
                'overwrite': true, 'recursive': true
            });

            this._mark(el);
            this._changedZlevel[el.zlevel] = true;
            this._maxZlevel = Math.max(this._maxZlevel, el.zlevel);
        }

        return this;
    }

    /**
     * 添加高亮层数据
     * @param {Object} shape 参数
     */
    addHover(shape) {
        this._hoverElements.push(shape);
        return this;
    }

    /**
     * 删除高亮层数据
     */
    delHover() {
        this._hoverElements = [];
        return this;
    }

    hasHoverShape() {
        return this._hoverElements.length > 0;
    }

    /**
     * 遍历迭代器
     * @param {Function} fn 迭代回调函数，return true终止迭代
     * @param {Object} options 迭代参数，缺省为仅降序遍历常规形状
     *     hover: true 是否迭代高亮层数据
     *     normal: 'down' | 'up' | 'free' 是否迭代常规数据，迭代时是否指定及z轴顺序
     */
    iterShape(fn, options) {
        if (!options) {
            options = {
                hover: false, normal: 'down'
            };
        }
        if (options.hover) {
            // 高亮层数据遍历
            for (var i = 0, l = this._hoverElements.length; i < l; i++) {
                if (fn(this._hoverElements[i])) {
                    return this;
                }
            }
        }
        var zlist, len;

        if (typeof options.normal != 'undefined') {
            // z轴遍历: 'down' | 'up' | 'free'
            switch (options.normal) {
                case 'down':
                    // 降序遍历，高层优先
                    for (var l = this._zElements.length - 1; l >= 0; l--) {
                        zlist = this._zElements[l];
                        if (zlist) {
                            len = zlist.length;
                            while (len--) {
                                if (fn(zlist[len])) {
                                    return this;
                                }
                            }
                        }
                    }
                    break;
                case 'up':
                    // 升序遍历，底层优先
                    for (var i = 0, l = this._zElements.length; i < l; i++) {
                        zlist = this._zElements[i];
                        if (zlist) {
                            len = zlist.length;
                            for (var k = 0; k < len; k++) {
                                if (fn(zlist[k])) {
                                    return this;
                                }
                            }
                        }
                    }
                    break;
                default:
                    // 无序遍历
                    for (var i in this._elements) {
                        if (fn(this._elements[i])) {
                            return this;
                        }
                    }
                    break;
            }
        }
        return this;
    }

    getMaxZlevel() {
        return this._maxZlevel;
    }

    getChangedZlevel() {
        return this._changedZlevel;
    }

    clearChangedZlevel() {
        this._changedZlevel = {};
        return this;
    }

    /**
     * 释放
     */
    disponse() {
        this._elements = null;
        this._zElements = null;
        this._hoverElements = null;
    }
}

export default Storage;