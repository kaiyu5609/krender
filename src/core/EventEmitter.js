
class EventEmitter {
    constructor() {
        this._listeners = {};
    }

    one(eventName, listener) {
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

    on(eventName, listener) {
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

    off(eventName, listener) {
        var self = this;
        if (!eventName) {
            this._listeners = {};
            return this;
        }
        if (listener) {
            if (this._listeners[eventName]) {
                var newListeners = [];
                this._listeners[eventName].forEach((item, index) => {
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

    fire(eventName, event, attachment) {
        if (this._listeners[eventName]) {
            var newListeners = [];
            var eventPacket = attachment || {};
            eventPacket.type = eventName;
            eventPacket.event = event;

            this._listeners[eventName].forEach(function(item, index) {
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

    getX(e) {
        return typeof e.zrX != 'undefined' && e.zrX
            || typeof e.offsetX != 'undefined' && e.offsetX
            || typeof e.layerX != 'undefined' && e.layerX
            || typeof e.clientX != 'undefined' && e.clientX;
    }

    getY(e) {
        return typeof e.zrY != 'undefined' && e.zrY
            || typeof e.offsetY != 'undefined' && e.offsetY
            || typeof e.layerY != 'undefined' && e.layerY
            || typeof e.clientY != 'undefined' && e.clientY;
    }

    getDelta(e) {
        return typeof e.wheelDelta != 'undefined' && e.wheelDelta
            || typeof e.detail != 'undefined' && -e.detail;
    }

    stop(e) {
        if (e.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.returnValue = false;
        }
    }
}

export default EventEmitter;