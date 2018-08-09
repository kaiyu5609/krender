import krUtil from './util';

let _ctx;

const zoneComputeMethod = {
    circle: function(area, x, y) {// 圆形包含判断
        return (x - area.x) * (x - area.x) + (y - area.y) * (y - area.y) < area.r * area.r;
    },
    line: function(area, x, y) {// 线段包含判断

    }
};




/**
 * 矩形包含判断
 */
const _isInsideRectangle = (area, x, y) => {
    if (x >= area.x && x <= (area.x + area.width) && y >= area.y && y <= (area.y + area.height)) {
        return true;
    }
    return false;
};

const zoneComputer = (zoneType, area, x, y) => {
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
const isInside = (shapeClazz, area, x, y) => {
    if (!shapeClazz || !area) {
        return false;
    }

    var zoneType = shapeClazz.type;

    if (!_ctx) {
        _ctx = krUtil.getContext();
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







export default {
    isInside: isInside
};