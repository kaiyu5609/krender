(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["krender"] = factory();
	else
		root["krender"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "release";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * 对一个object进行深度拷贝
 *
 * @param {Any} source 需要进行拷贝的对象
 * @return {Any} 拷贝后的新对象
 */
function clone(source) {
    // buildInObject, 用于处理无法遍历Date等对象的问题
    var buildInObject = {
        '[object Function]': 1,
        '[object RegExp]': 1,
        '[object Date]': 1,
        '[object Error]': 1,
        '[object CanvasGradient]': 1
    };
    var result = source;
    var i;
    var len;
    if (!source || source instanceof Number || source instanceof String || source instanceof Boolean) {
        return result;
    } else if (source instanceof Array) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = this.clone(source[i]);
        }
    } else if ('object' == (typeof source === 'undefined' ? 'undefined' : _typeof(source))) {
        if (buildInObject[Object.prototype.toString.call(source)] || source.__nonRecursion) {
            return result;
        }
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = this.clone(source[i]);
            }
        }
    }
    return result;
}

/**
 * 合并源对象的属性到目标对象
 * modify from Tangram
 * @param {*} target 目标对象
 * @param {*} source 源对象
 * @param {Object} optOptions 选项
 * @param {boolean} optOptions.overwrite 是否覆盖
 * @param {boolean} optOptions.recursive 是否递归
 * @param {boolean} optOptions.whiteList 白名单，如果定义，则仅处理白名单属性
 */
var merge = function () {
    // buildInObject, 用于处理无法遍历Date等对象的问题
    var buildInObject = {
        '[object Function]': 1,
        '[object RegExp]': 1,
        '[object Date]': 1,
        '[object Error]': 1,
        '[object CanvasGradient]': 1
    };
    function mergeItem(target, source, index, overwrite, recursive) {
        if (source.hasOwnProperty(index)) {
            if (recursive && _typeof(target[index]) == 'object' && buildInObject[Object.prototype.toString.call(target[index])] != 1) {
                // 如果需要递归覆盖，就递归调用merge
                merge(target[index], source[index], {
                    'overwrite': overwrite,
                    'recursive': recursive
                });
            } else if (overwrite || !(index in target)) {
                // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
                target[index] = source[index];
            }
        }
    }

    return function (target, source, optOptions) {
        var i = 0,
            options = optOptions || {},
            overwrite = options['overwrite'],
            whiteList = options['whiteList'],
            recursive = options['recursive'],
            len;

        // 只处理在白名单中的属性
        if (whiteList && whiteList.length) {
            len = whiteList.length;
            for (; i < len; ++i) {
                mergeItem(target, source, whiteList[i], overwrite, recursive);
            }
        } else {
            for (i in source) {
                mergeItem(target, source, i, overwrite, recursive);
            }
        }
        return target;
    };
}();

var _ctx;

function getContext() {
    if (!_ctx) {
        _ctx = document.createElement('canvas').getContext('2d');
    }
    return _ctx;
}

var _canvas;
var _pixelCtx;
var _width;
var _height;
var _offsetX = 0;
var _offsetY = 0;

/**
 * 获取像素拾取专用的上下文
 * @return {Object} 上下文
 */
function getPixelContext() {
    if (!_pixelCtx) {
        _canvas = document.createElement('canvas');
        _width = _canvas.width;
        _height = _canvas.height;
        _pixelCtx = _canvas.getContext('2d');
    }
    return _pixelCtx;
}

/**
 * 如果坐标处在_canvas外部，改变_canvas的大小
 * @param {number} x : 横坐标
 * @param {number} y : 纵坐标
 * 注意 修改canvas的大小 需要重新设置translate
 */
function adjustCanvasSize(x, y) {
    // 每次加的长度
    var _v = 100;
    var _flag = false;

    if (x + _offsetX > _width) {
        _width = x + _offsetX + _v;
        _canvas.width = _width;
        _flag = true;
    }

    if (y + _offsetY > _height) {
        _height = y + _offsetY + _v;
        _canvas.height = _height;
        _flag = true;
    }

    if (x < -_offsetX) {
        _offsetX = Math.ceil(-x / _v) * _v;
        _width += _offsetX;
        _canvas.width = _width;
        _flag = true;
    }

    if (y < -_offsetY) {
        _offsetY = Math.ceil(-y / _v) * _v;
        _height += _offsetY;
        _canvas.height = _height;
        _flag = true;
    }

    if (_flag) {
        _pixelCtx.translate(_offsetX, _offsetY);
    }
}

/**
 * 获取像素canvas的偏移量
 * @return {Object} 偏移量
 */
function getPixelOffset() {
    return {
        x: _offsetX,
        y: _offsetY
    };
}

/**
 * 查询数组中元素的index
 */
function indexOf(array, value) {
    if (array.indexOf) {
        return array.indexOf(value);
    }
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}

exports.default = {
    clone: clone,
    merge: merge,
    getContext: getContext,

    getPixelContext: getPixelContext,
    getPixelOffset: getPixelOffset,
    adjustCanvasSize: adjustCanvasSize,

    indexOf: indexOf
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _krender = __webpack_require__(3);

var _krender2 = _interopRequireDefault(_krender);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _krender2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _guid = __webpack_require__(4);

var _guid2 = _interopRequireDefault(_guid);

var _Storage = __webpack_require__(5);

var _Storage2 = _interopRequireDefault(_Storage);

var _Painter = __webpack_require__(6);

var _Painter2 = _interopRequireDefault(_Painter);

var _Handler = __webpack_require__(7);

var _Handler2 = _interopRequireDefault(_Handler);

var _shape = __webpack_require__(10);

var _shape2 = _interopRequireDefault(_shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instances = {};

var krender = {};

krender.version = '0.0.1';

/**
 * krender初始化
 * 不让外部直接new KRender实例，提供全局可控同时减少全局污染和降低命名冲突的风险
 * @param {HTMLElement} dom dom对象
 * @param {Object} opts 
 * @return {KRender} KRender实例
 */
krender.init = function (dom, opts) {
    var kr = new KRender((0, _guid2.default)(), dom, opts);
    instances[kr.id] = kr;
    return kr;
};

/**
 * kr实例销毁
 * 可以通过zr.dispose(kr)销毁指定KRender实例
 * 当然也可以直接kr.dispose()自己销毁
 * @param {KRender} kr KRender对象，不传则销毁全部
 */
krender.dispose = function (kr) {
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
krender.getInstance = function (id) {
    return instances[id];
};

/**
 * 删除kr实例，KRender实例dispose时会调用
 * @param {string} id KRender对象索引
 */
krender.delInstance = function (id) {
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

var KRender = function () {
    function KRender(id, dom, opts) {
        _classCallCheck(this, KRender);

        opts = opts || {};

        this.dom = dom;

        this.id = id;

        var shapeLibrary;

        if (typeof opts.shape == 'undefined') {
            shapeLibrary = _shape2.default;
        } else {
            shapeLibrary = {};
            for (var s in opts.shape) {
                shapeLibrary[s] = opts.shape[s];
            }
            shapeLibrary.get = function (name) {
                return shapeLibrary[name] || _shape2.default.get(name);
            };
        }

        this.storage = new _Storage2.default(shapeLibrary);
        this.painter = new _Painter2.default(dom, this.storage, shapeLibrary);
        this.handler = new _Handler2.default(dom, this.storage, this.painter, shapeLibrary);
    }

    /**
     * 添加图形形状
     * @param {Object} shape 形状对象，可用属性全集，详见各shape
     */


    _createClass(KRender, [{
        key: 'addShape',
        value: function addShape(shape) {
            this.storage.add(shape);
            return this;
        }

        /**
         * 渲染
         * @param {Function} callback  渲染结束后回调函数
         */

    }, {
        key: 'render',
        value: function render(callback) {
            this.painter.render(callback);
            return this;
        }

        /**
         * 事件绑定
         * @param {string} eventName 事件名称
         * @param {Function} eventListener 响应函数
         */

    }, {
        key: 'on',
        value: function on(eventName, eventListener) {
            this.handler.on(eventName, eventListener);
            return this;
        }
    }, {
        key: 'dispose',


        /**
         * 释放当前KRender实例（删除包括dom，数据、显示和事件绑定），dispose后KRender不可用
         */
        value: function dispose() {
            this.storage.disponse();
            this.storage = null;

            this.painter.dispose();
            this.painter = null;

            this.handler.dispose();
            this.handler = null;

            krender.delInstance(this.id);
        }
    }]);

    return KRender;
}();

exports.default = krender;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return idStart++;
};

var idStart = 0x0907;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
    /**
     * 内容仓库 (M)
     * @param {Object} shape 图形库
     */

    function Storage(shape) {
        _classCallCheck(this, Storage);

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


    _createClass(Storage, [{
        key: 'newShapeId',
        value: function newShapeId(idHead) {
            return (idHead || '') + ++this._isBase;
        }

        /**
         * 快速判断标志~
         * e.__silent 是否需要hover判断
         * e.__needTransform 是否需要进行transform
         * e.style.__rect 区域矩阵缓存，修改后清空，重新计算一次
         */

    }, {
        key: '_mark',
        value: function _mark(el) {
            if (el.hoverable || el.onclick || el.draggable || el.onmousemove || el.onmouseover || el.onmouseout || el.onmousedown || el.onmouseup || el.ondragenter || el.ondragover || el.ondragleave || el.ondrop) {
                el.__silent = false;
            } else {
                el.__silent = true;
            }

            if (Math.abs(el.rotation[0]) > 0.0001 || Math.abs(el.position[0]) > 0.0001 || Math.abs(el.position[1]) > 0.0001 || Math.abs(el.scale[0] - 1) > 0.0001 || Math.abs(el.scale[1] - 1) > 0.0001) {
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

    }, {
        key: 'add',
        value: function add(shape) {
            var self = this;
            var el = {
                'shape': 'circle', // 形状
                'id': self.newShapeId(), // 唯一标识
                'zlevel': 0, // z轴位置
                'draggable': false, // 可拖拽
                'clickable': false, // 可点击
                'hoverable': true, // 可悬浮
                'position': [0, 0],
                'rotation': [0, 0, 0],
                'scale': [1, 1, 0, 0]
            };

            _util2.default.merge(el, shape, {
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
         * 添加高亮层数据
         * @param {Object} params 参数
         */

    }, {
        key: 'addHover',
        value: function addHover(params) {
            this._hoverElements.push(params);
            return this;
        }

        /**
         * 遍历迭代器
         * @param {Function} fn 迭代回调函数，return true终止迭代
         * @param {Object} options 迭代参数，缺省为仅降序遍历常规形状
         *     hover: true 是否迭代高亮层数据
         *     normal: 'down' | 'up' | 'free' 是否迭代常规数据，迭代时是否指定及z轴顺序
         */

    }, {
        key: 'iterShape',
        value: function iterShape(fn, options) {
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
    }, {
        key: 'getMaxZlevel',
        value: function getMaxZlevel() {
            return this._maxZlevel;
        }
    }, {
        key: 'getChangedZlevel',
        value: function getChangedZlevel() {
            return this._changedZlevel;
        }
    }, {
        key: 'clearChangedZlevel',
        value: function clearChangedZlevel() {
            this._changedZlevel = {};
            return this;
        }

        /**
         * 释放
         */

    }, {
        key: 'disponse',
        value: function disponse() {
            this._elements = null;
            this._zElements = null;
            this._hoverElements = null;
        }
    }]);

    return Storage;
}();

exports.default = Storage;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Painter = function () {
    /**
     * 绘图类 (V)
     * @param {HTMLElement} root 绘图区域
     * @param {storage} storage Storage实例
     * @param {Object} shape 图形库
     */

    function Painter(root, storage, shape) {
        _classCallCheck(this, Painter);

        this.root = root;
        this.storage = storage;
        this.shape = shape;

        this._domList = {}; // canvas dom元素
        this._ctxList = {}; // canvas 2D context对象，与domList对应

        this._maxZlevel = 0; // 最大zlevel，缓存记录

        this._domRoot = document.createElement('div');
        this._domRoot.onselectstart = function () {
            return false;
        };

        this._width; // 宽，缓存记录
        this._height; // 高，缓存记录

        this._init();
    }

    _createClass(Painter, [{
        key: '_init',
        value: function _init() {
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
            this._domList['hover'].id = '_zrender_hover_';
            this._domRoot.appendChild(this._domList['hover']);
            this._ctxList['hover'] = this._domList['hover'].getContext('2d');
        }
    }, {
        key: '_getWidth',
        value: function _getWidth() {
            var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
            return this.root.clientWidth - stl.paddingLeft.replace(/\D/g, '') - stl.paddingRight.replace(/\D/g, '');
        }
    }, {
        key: '_getHeight',
        value: function _getHeight() {
            var stl = this.root.currentStyle || document.defaultView.getComputedStyle(this.root);
            return this.root.clientHeight - stl.paddingTop.replace(/\D/g, '') - stl.paddingBottom.replace(/\D/g, '');
        }

        /**
         * 检查_maxZlevel是否变大，如是则同步创建需要的Canvas
         */

    }, {
        key: '_syncMaxZlevelCanvase',
        value: function _syncMaxZlevelCanvase() {
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

    }, {
        key: '_createDom',
        value: function _createDom(id, type) {
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

    }, {
        key: '_brush',
        value: function _brush(changedZlevel) {
            var self = this;

            return function (el) {
                if ((changedZlevel.all || changedZlevel[el.zlevel]) && !el.invisible) {
                    var ctx = self._ctxList[el.zlevel];
                    if (ctx) {
                        if (!el.onbrush || el.onbrush && !el.onbrush(ctx, el, false)) {
                            self.shape.get(el.shape).brush(ctx, el, false, self.update);
                        }
                    } else {
                        throw new Error('can not find the specfic zlevel canvas!');
                    }
                }
            };
        }

        /**
         * 首次绘图，创建各种dom和context
         * @param {Function} callback 绘画结束后的回调函数
         */

    }, {
        key: 'render',
        value: function render(callback) {

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

    }, {
        key: 'refresh',
        value: function refresh(callback) {
            console.log('refresh');

            return this;
        }

        /**
         * 视图更新
         * @param {Array} shapeList 需要更新的图形元素列表
         * @param {Function} callback  视图更新后回调函数
         */

    }, {
        key: 'update',
        value: function update(shapeList, callback) {
            console.log('update');

            return this;
        }
    }, {
        key: 'getDomHover',
        value: function getDomHover() {
            return this._domList['hover'];
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            this.root.innerHTML = '';
            this.root = null;
            this.storage = null;
            this.shape = null;

            this._domList = null;
            this._domRoot = null;
            this._ctxList = null;

            return;
        }
    }]);

    return Painter;
}();

exports.default = Painter;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(8);

var _config2 = _interopRequireDefault(_config);

var _EventEmitter2 = __webpack_require__(9);

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Handler = function (_EventEmitter) {
    _inherits(Handler, _EventEmitter);

    /**
     * 控制类 (C)
     * @param {HTMLElement} root 绘图区域
     * @param {storage} storage Storage实例
     * @param {painter} painter Painter实例
     * @param {Object} shape 图形库
     *
     * 分发事件支持详见config.EVENT
     */

    function Handler(root, storage, painter, shape) {
        _classCallCheck(this, Handler);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Handler).call(this));

        _this.root = root;
        _this.storage = storage;
        _this.painter = painter;
        _this.shape = shape;

        _this._event; // 原生dom事件
        _this._hasfound = false; // 是否找到hover的图形元素
        _this._lastHover = null; // 最后一个hover的图形元素
        _this._draggingTarget = null;
        _this._isMouseDown = false;
        _this._isDragging = false;
        _this._lastTouchMoment;

        _this._lastX = 0;
        _this._lastY = 0;
        _this._mouseX = 0;
        _this._mouseY = 0;

        _this._domHover = painter.getDomHover();

        _this._bindEvents();
        return _this;
    }

    /**
     * 初始化，事件绑定
     */


    _createClass(Handler, [{
        key: '_bindEvents',
        value: function _bindEvents() {
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

    }, {
        key: '_mouseMoveHandler',
        value: function _mouseMoveHandler(event) {
            // console.log('mousemove:', event);

            this._event = this._zrenderEventFixed(event);
            this._lastX = this._mouseX;
            this._lastY = this._mouseY;
            this._mouseX = this.getX(this._event);
            this._mouseY = this.getY(this._event);

            this._hasfound = false;
            this.storage.iterShape(this._findHover.bind(this), { normal: 'down' });

            if (!this._hasfound) {
                this._lastHover = null;
                console.log('hasfound!');
            }

            this._dispatchAgency(this._lastHover, _config2.default.EVENT.MOUSEMOVE);

            if (this._hasfound && this._lastHover.clickable) {
                this.root.style.cursor = 'pointer';
            } else {
                this.root.style.cursor = 'default';
            }
        }

        /**
         * 窗口大小改变响应函数
         * @param {event} event dom事件对象
         */

    }, {
        key: '_resizeHandler',
        value: function _resizeHandler(event) {
            this._event = event || window.event;
            this._lastHover = null;
            this._isMouseDown = false;
            this.fire(_config2.default.EVENT.RESIZE, this._event);
        }

        /**
         * 点击事件
         * @param {event} event dom事件对象
         */

    }, {
        key: '_clickHandler',
        value: function _clickHandler(event) {
            this._event = this._zrenderEventFixed(event);
            if (!this._lastHover) {
                this._dispatchAgency(this._lastHover, _config2.default.EVENT.CLICK);
            } else if (this._lastHover && this._lastHover.clickable) {
                this._dispatchAgency(this._lastHover, _config2.default.EVENT.CLICK);
            }
            this._mouseMoveHandler(this._event);
        }

        /**
         * 鼠标在某个图形元素上移动
         */

    }, {
        key: '_overShapeHandler',
        value: function _overShapeHandler() {
            this._dispatchAgency(this._lastHover, _config2.default.EVENT.MOUSEOVER);
        }

        /**
         * 鼠标离开某个图形元素
         */

    }, {
        key: '_outShapeHandler',
        value: function _outShapeHandler() {
            this._dispatchAgency(this._lastHover, _config2.default.EVENT.MOUSEOUT);
        }

        /**
         * 迭代函数，查找hover到的图形元素并即时做些事件分发
         * @param {Object} el 图形元素
         */

    }, {
        key: '_findHover',
        value: function _findHover(el) {
            if (this._draggingTarget && this._draggingTarget.id == el.id) {
                return false;
            }
            if (el.__silent) {
                return false;
            }
            var shapeInstance = this.shape.get(el.shape);
            if (shapeInstance.isCover(el, this._mouseX, this._mouseY)) {
                if (el.hoverable) {
                    this.storage.addHover(el);
                }
                if (this._lastHover != el) {
                    this._outShapeHandler();
                    this._lastHover = el;
                }
                this._overShapeHandler();
                this._hasfound = true;
                return true;
            }
            return false;
        }

        // 如果存在第三方嵌入的一些dom触发的事件，或touch事件，需要转换一下事件坐标

    }, {
        key: '_zrenderEventFixed',
        value: function _zrenderEventFixed(event, isTouch) {
            if (!isTouch) {
                this._event = event || window.event;
                var target = this._event.toElement || this._event.relatedTarget || this._event.srcElement || this._event.target;
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

    }, {
        key: '_dispatchAgency',
        value: function _dispatchAgency(targetShape, eventName, draggedShape) {
            var eventHandler = 'on' + eventName,
                _event = this._event;

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

    }, {
        key: 'dispose',
        value: function dispose() {
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
    }]);

    return Handler;
}(_EventEmitter3.default);

exports.default = Handler;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * kr: config默认配置项
 */

exports.default = {
    loadingEffect: 'spin', // 默认loading特效
    EVENT: { // 支持事件列表
        RESIZE: 'resize', // 窗口大小变化
        CLICK: 'click', // 鼠标按钮被（手指）按下，事件对象是：目标图形元素或空

        MOUSEWHEEL: 'mousewheel', // 鼠标滚轮变化，事件对象是：目标图形元素或空
        MOUSEMOVE: 'mousemove', // 鼠标（手指）被移动，事件对象是：目标图形元素或空
        MOUSEOVER: 'mouseover', // 鼠标移到某图形元素之上，事件对象是：目标图形元素
        MOUSEOUT: 'mouseout', // 鼠标从某图形元素移开，事件对象是：目标图形元素
        MOUSEDOWN: 'mousedown', // 鼠标按钮（手指）被按下，事件对象是：目标图形元素或空
        MOUSEUP: 'mouseup', // 鼠标按键（手指）被松开，事件对象是：目标图形元素或空

        // 一次成功元素拖拽的行为事件过程是：
        // dragstart > dragenter > dragover [> dragleave] > drop > dragend
        DRAGSTART: 'dragstart', // 开始拖拽时触发，事件对象是：被拖拽图形元素
        DRAGEND: 'dragend', // 拖拽完毕时触发（在drop之后触发），事件对象是：被拖拽图形元素
        DRAGENTER: 'dragenter', // 拖拽图形元素进入目标图形元素时触发，事件对象是：目标图形元素
        DRAGOVER: 'dragover', // 拖拽图形元素在目标图形元素上移动时触发，事件对象是：目标图形元素
        DRAGLEAVE: 'dragleave', // 拖拽图形元素离开目标图形元素时触发，事件对象是：目标图形元素
        DROP: 'drop', // 拖拽图形元素放在目标图形元素内时触发，事件对象是：目标图形元素

        touchClickDelay: 300 // touch end - start < delay is click
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this._listeners = {};
    }

    _createClass(EventEmitter, [{
        key: 'one',
        value: function one(eventName, listener) {
            if (!listener || !eventName) {
                return this;
            }
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push({
                'listener': listener, 'one': true
            });
            return this;
        }
    }, {
        key: 'on',
        value: function on(eventName, listener) {
            if (!listener || !eventName) {
                return this;
            }
            if (!this._listeners[eventName]) {
                this._listeners[eventName] = [];
            }
            this._listeners[eventName].push({
                'listener': listener, 'one': false
            });
            return this;
        }
    }, {
        key: 'off',
        value: function off(eventName, listener) {
            var self = this;
            if (!eventName) {
                this._listeners = {};
                return this;
            }
            if (listener) {
                if (this._listeners[eventName]) {
                    var newListeners = [];
                    this._listeners[eventName].forEach(function (item, index) {
                        if (item['listener'] != listener) {
                            newListeners.push(item);
                        }
                    });
                    this._listeners[eventName] = newListeners;
                }
                if (this._listeners[eventName] && this._listeners[eventName].length === 0) {
                    delete this._listeners[eventName];
                }
            } else {
                delete this._listeners[eventName];
            }
            return this;
        }
    }, {
        key: 'fire',
        value: function fire(eventName, event, attachment) {
            if (this._listeners[eventName]) {
                var newListeners = [];
                var eventPacket = attachment || {};
                eventPacket.type = eventName;
                eventPacket.event = event;

                this._listeners[eventName].forEach(function (item, index) {
                    item['listener'](eventPacket);
                    if (!item['one']) {
                        newListeners.push(item);
                    }
                });

                if (newListeners.length != this._listeners[eventName].length) {
                    this._listeners = newListeners;
                }
            }
            return this;
        }
    }, {
        key: 'getX',
        value: function getX(e) {
            return typeof e.krenderX != 'undefined' && e.krenderX || typeof e.offsetX != 'undefined' && e.offsetX || typeof e.layerX != 'undefined' && e.layerX || typeof e.clientX != 'undefined' && e.clientX;
        }
    }, {
        key: 'getY',
        value: function getY(e) {
            return typeof e.krenderY != 'undefined' && e.krenderY || typeof e.offsetY != 'undefined' && e.offsetY || typeof e.layerY != 'undefined' && e.layerY || typeof e.clientY != 'undefined' && e.clientY;
        }
    }, {
        key: 'getDelta',
        value: function getDelta(e) {
            return typeof e.wheelDelta != 'undefined' && e.wheelDelta || typeof e.detail != 'undefined' && -e.detail;
        }
    }, {
        key: 'stop',
        value: function stop(e) {
            if (e.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                e.returnValue = false;
            }
        }
    }]);

    return EventEmitter;
}();

exports.default = EventEmitter;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Circle = __webpack_require__(11);

var _Circle2 = _interopRequireDefault(_Circle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _shapeLibrary = {};

var shape = {
    /**
     * 定义图形实现
     * @param {Object} name
     * @param {Object} clazz 图形实现
     */

    define: function define(name, shape) {
        _shapeLibrary[name] = shape;
        return this;
    },


    /**
     * 获取图形实现
     * @param {Object} name
     */
    get: function get(name) {
        return _shapeLibrary[name];
    }
};

shape.define('circle', new _Circle2.default());

exports.default = shape;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Shape2 = __webpack_require__(12);

var _Shape3 = _interopRequireDefault(_Shape2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = function (_Shape) {
    _inherits(Circle, _Shape);

    function Circle() {
        _classCallCheck(this, Circle);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this));

        _this.type = 'circle';
        return _this;
    }

    /**
     * 创建圆形路径
     * @param {Context2D} ctx Canvas 2D上下文
     * @param {Object} style 样式
     */


    _createClass(Circle, [{
        key: 'buildPath',
        value: function buildPath(ctx, style) {
            ctx.arc(style.x, style.y, style.r, 0, Math.PI * 2, true);
            return this;
        }

        /**
         * 返回矩形区域，用于局部刷新和文字定位
         * @param {Object} style
         */

    }, {
        key: 'getRect',
        value: function getRect(style) {
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
    }]);

    return Circle;
}(_Shape3.default);

exports.default = Circle;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _area = __webpack_require__(13);

var _area2 = _interopRequireDefault(_area);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 1.基础配置
 * 2.变换
 * 3.样式
 * 4.交互属性
 * 5.事件
 * 
 */

var Shape = function () {
    function Shape() {
        _classCallCheck(this, Shape);
    }

    /**
     * 画刷
     * @param ctx       画布句柄
     * @param el         形状实体
     * @param isHighlight   是否为高亮状态
     * @param updateCallback 需要异步加载资源的shape可以通过这个callback(el)
     *                       让painter更新视图，shape.brush没用，需要的话重载brush
     */


    _createClass(Shape, [{
        key: 'brush',
        value: function brush(ctx, el, isHighlight) {
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

    }, {
        key: 'setContext',
        value: function setContext(ctx, style) {
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

    }, {
        key: 'drawText',
        value: function drawText(ctx, style, normalStyle) {
            console.log('drawText:', style.text);
        }
    }, {
        key: 'getHighlightStyle',
        value: function getHighlightStyle() {}
    }, {
        key: 'getHighlightZoom',
        value: function getHighlightZoom() {}
    }, {
        key: 'drift',
        value: function drift() {}

        /**
         * 默认区域包含判断
         * @param el 图形实体
         * @param x 横坐标
         * @param y 纵坐标
         */

    }, {
        key: 'isCover',
        value: function isCover(el, x, y) {
            var rect;
            if (el.style.__rect) {
                rect = el.style.__rect;
            } else {
                rect = this.getRect(el.style);
                rect = [rect.x, rect.x + rect.width, rect.y, rect.y + rect.height];
                el.style.__rect = rect;
            }

            if (x >= rect[0] && x <= rect[1] && y >= rect[2] && y <= rect[3]) {
                return _area2.default.isInside(this, el.style, x, y);
            } else {
                return false;
            }
        }
    }, {
        key: 'updateTransform',
        value: function updateTransform() {
            console.log('updateTransform');
        }
    }]);

    return Shape;
}();

exports.default = Shape;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _util = __webpack_require__(0);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ctx = void 0;

var zoneComputeMethod = {
    circle: function circle(area, x, y) {
        // 圆形包含判断
        return (x - area.x) * (x - area.x) + (y - area.y) * (y - area.y) < area.r * area.r;
    },
    line: function line(area, x, y) {// 线段包含判断

    }
};

/**
 * 矩形包含判断
 */
var _isInsideRectangle = function _isInsideRectangle(area, x, y) {
    if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
        return true;
    }
    return false;
};

var zoneComputer = function zoneComputer(zoneType, area, x, y) {
    if (typeof zoneComputeMethod[zoneType] === 'function') {
        return zoneComputeMethod[zoneType](area, x, y);
    }
};

/**
 * 包含判断(是否在区域内部)
 * @param {string} shapeClazz : 图形类
 * @param {Object} area ： 目标区域
 * @param {number} x ： 横坐标
 * @param {number} y ： 纵坐标
 */
var isInside = function isInside(shapeClazz, area, x, y) {
    if (!shapeClazz || !area) {
        return false;
    }

    var zoneType = shapeClazz.type;

    if (!_ctx) {
        _ctx = _util2.default.getContext();
    }
    // 不在矩形区域内直接返回false
    if (!_isInsideRectangle(shapeClazz.getRect(area), x, y)) {
        return false;
    }

    var zoneReturn = zoneComputer(zoneType, area, x, y);

    if (typeof zoneReturn != 'undefined') {
        return zoneReturn;
    }
};

exports.default = {
    isInside: isInside
};

/***/ })
/******/ ]);
});
//# sourceMappingURL=krender.js.map