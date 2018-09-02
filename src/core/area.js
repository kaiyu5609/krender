import krUtil from './util';

let _ctx;

const zoneComputeMethod = {
    circle(area, x, y) {// 圆形包含判断
        return (x - area.x) * (x - area.x) + (y - area.y) * (y - area.y) < area.r * area.r;
    },

    rect(area, x, y) {// 矩形包含判断
        if (x >= area.x
            && x <= (area.x + area.width)
            && y >= area.y
            && y <= (area.y + area.height)
        ) {
            return true;
        }
        return false;
    },

    path(area, x, y) {// 路径包含判断 -> TODO，暂不支持
        console.log('TODO，暂不支持');

        return false;
    },

    line(area, x, y) {// 线段包含判断
        var _x1 = area.xStart;
        var _y1 = area.yStart;
        var _x2 = area.xEnd;
        var _y2 = area.yEnd;
        var _l = area.lineWidth;
        var _a = 0;
        var _b = _x1;

        if (_x1 !== _x2) {
            _a = (_y1 - _y2) / (_x1 - _x2);
            _b = (_x1 * _y2 - _x2 * _y1) / (_x1 - _x2);
        } else {
            return Math.abs(x - _x1) <= _l / 2;
        }

        var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);

        return  _s <= _l / 2 * _l / 2;
    },

    beziercurve(area, x, y) {// 曲线包含判断 -> TODO，暂不支持
        console.log('TODO，暂不支持');

        return false;
    },

    brokenline(area, x, y) {
        var pointList = area.pointList;
        var lineArea;
        var insideCatch = false;

        for (var i = 0, l = pointList.length - 1; i < l; i++) {
            lineArea = {
                xStart : pointList[i][0],
                yStart : pointList[i][1],
                xEnd : pointList[i + 1][0],
                yEnd : pointList[i + 1][1],
                lineWidth : area.lineWidth
            };
            if (!this.rect(
                    {
                        x : Math.min(lineArea.xStart, lineArea.xEnd)
                            - lineArea.lineWidth,
                        y : Math.min(lineArea.yStart, lineArea.yEnd)
                            - lineArea.lineWidth,
                        width : Math.abs(lineArea.xStart - lineArea.xEnd)
                                + lineArea.lineWidth,
                        height : Math.abs(lineArea.yStart - lineArea.yEnd)
                                    + lineArea.lineWidth
                    },
                    x,y
                )
            ) {
                // 不在矩形区内跳过
                continue;
            }

            insideCatch = this.line(lineArea, x, y);
            if (insideCatch) {
                break;
            }
        }
        
        return insideCatch;
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