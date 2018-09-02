import guid from './core/guid';
import Storage from './Storage';
import Painter from './Painter';
import Handler from './Handler';
import shape from './shape';

var instances = {};

var krender = {};

krender.version = '0.0.4';

/**
 * krender初始化
 * 不让外部直接new KRender实例，提供全局可控同时减少全局污染和降低命名冲突的风险
 * @param {HTMLElement} dom dom对象
 * @param {Object} opts 
 * @return {KRender} KRender实例
 */
krender.init = (dom, opts) => {
    var kr = new KRender(guid(), dom, opts);
    instances[kr.id] = kr;
    return kr;
};

/**
 * kr实例销毁
 * 可以通过zr.dispose(kr)销毁指定KRender实例
 * 当然也可以直接kr.dispose()自己销毁
 * @param {KRender} kr KRender对象，不传则销毁全部
 */
krender.dispose = (kr) => {
    if (kr) {
        kr.dispose();
    } else {
        for (var key in instances) {
            if (instances.hasOwnProperty(key)) {
                instances[key].dispose();
            }
        }
        instances = {};
    }
    return krender;
};

/**
 * 获取kr实例
 * @param {string} id KRender对象索引
 */
krender.getInstance = (id) => {
    return instances[id];
};

/**
 * 删除kr实例，KRender实例dispose时会调用
 * @param {string} id KRender对象索引
 */
krender.delInstance = (id) => {
    delete instances[id];
};

/**
 * KRender接口类
 * storage（M）、painter（V）、handler（C）为内部私有类，外部接口不可见
 *
 * @param {string} id 唯一标识
 * @param {HTMLElement} dom dom对象
 * @param {Object} params 个性化参数
 */
class KRender {
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
     * 添加额外高亮层显示，仅提供添加方法，每次刷新后高亮层图形均被清空
     * @param {Object} shape 形状对象
     */
    addHoverShape(shape) {
        this.storage.addHover(shape);
        return this;
    }

    /**
     * 修改图形形状
     * @param {string} shapeId 形状对象唯一标识
     * @param {Object} shape 形状对象
     */
    modShape(shapeId, shape) {
        this.storage.mod(shapeId, shape);
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
     * 视图更新
     * @param {Function} callback  视图更新后回调函数
     */
    refresh(callback) {
        this.painter.refresh(callback);
        return this;
    }

    resize() {
        this.painter.resize();
        return this;
    }

    /**
     * 生成形状唯一ID
     * @param {string} [idPrefix] id前缀
     * @return {string} 不重复ID
     */
    newShapeId(idPrefix) {
        return this.storage.newShapeId(idPrefix);
    }

    /**
     * 释放当前KRender实例（删除包括dom，数据、显示和事件绑定），dispose后KRender不可用
     */
    dispose() {
        this.storage.disponse();
        this.storage = null;

        this.painter.dispose();
        this.painter = null;

        this.handler.dispose();
        this.handler = null;

        krender.delInstance(this.id);
    }
}

export default krender;

