import Circle from './shape/Circle'; 

var _shapeLibrary = {};

var shape = {
    /**
     * 定义图形实现
     * @param {Object} name
     * @param {Object} clazz 图形实现
     */
    define(name, shape) {
        _shapeLibrary[name] = shape;
        return this;
    },

    /**
     * 获取图形实现
     * @param {Object} name
     */
    get(name) {
        return _shapeLibrary[name];
    }
};

shape.define('circle', new Circle());

export default shape;
