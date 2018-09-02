import Circle from './shape/Circle';
import Rect from './shape/Rect';
import Path from './shape/Path';
import Line from './shape/Line';
import BezierCurve from './shape/BezierCurve';
import BrokenLine from './shape/BrokenLine';


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
shape.define('rect', new Rect());
shape.define('path', new Path());
shape.define('line', new Line());
shape.define('beziercurve', new BezierCurve());
shape.define('brokenline', new BrokenLine());


export default shape;
