import guid from './core/guid';
import Storage from './Storage';
import Painter from './Painter';
import Handler from './Handler';
import shape from './shape';

var instances = {};

var zr = {};

zr.version = '0.0.1';

/**
 * zr初始化
 * 不让外部直接new Zr实例，提供全局可控同时减少全局污染和降低命名冲突的风险
 * @param {HTMLElement} dom dom对象
 * @param {Object} opts 
 * @return {Zr} Zr实例
 */
zr.init = (dom, opts) => {
    var zi = new Zr(guid(), dom, opts);
    instances[zi.id] = zi;
    return zi;
};

/**
 * zr实例销毁
 * 可以通过zr.dispose(zi)销毁指定Zr实例
 * 当然也可以直接zi.dispose()自己销毁
 * @param {Zr} zi Zr对象，不传则销毁全部
 */
zr.dispose = (zi) => {
    if (zi) {
        zi.dispose();
    } else {
        for (var key in instances) {
            if (instances.hasOwnProperty(key)) {
                instances[key].dispose();
            }
        }
        instances = {};
    }
    return zr;
};

/**
 * 获取zr实例
 * @param {string} id Zr对象索引
 */
zr.getInstance = (id) => {
    return instances[id];
};

/**
 * 删除zr实例，Zr实例dispose时会调用
 * @param {string} id Zr对象索引
 */
zr.delInstance = (id) => {
    delete instances[id];
};

/**
 * Zr接口类
 * storage（M）、painter（V）、handler（C）为内部私有类，外部接口不可见
 *
 * @param {string} id 唯一标识
 * @param {HTMLElement} dom dom对象
 * @param {Object} params 个性化参数
 */
class Zr {
    constructor(id, dom, opts) {

        opts = opts || {};

        this.dom = dom;

        this.id = id;

        var shapeLibrary;

        if (typeof opts.shape == 'undefined') {
            shapeLibrary = shape;
        } else {
            shapeLibrary = {};
            for (var s in opts.shape) {
                shapeLibrary[s] = opts.shape[s];
            }
            shapeLibrary.get = function(name) {
                return shapeLibrary[name] || shape.get(name);
            };
        }

        this.storage = new Storage(shapeLibrary);
        this.painter = new Painter(dom, this.storage, shapeLibrary);
        this.handler = new Handler(dom, this.storage, this.painter, shapeLibrary);


    }

    /**
     * 添加图形形状
     * @param {Object} shape 形状对象，可用属性全集，详见各shape
     */
    addShape(shape) {
        this.storage.add(shape);
        return this;
    }

    /**
     * 渲染
     * @param {Function} callback  渲染结束后回调函数
     */
    render(callback) {
        this.painter.render(callback);
        return this;
    }

    /**
     * 释放当前Zr实例（删除包括dom，数据、显示和事件绑定），dispose后Zr不可用
     */
    dispose() {
        this.storage.disponse();
        this.storage = null;

        this.painter.dispose();
        this.painter = null;

        this.handler.dispose();
        this.handler = null;

        zr.delInstance(this.id);
    }
}

export default zr;

