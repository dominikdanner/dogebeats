"use strict";
exports.__esModule = true;
var AudioQueue = /** @class */ (function () {
    function AudioQueue() {
        var _this = this;
        this.Queue = [];
        this.add = function (data) {
            return _this.Queue.push(data);
        };
        this.remove = function (pos) {
            return _this.Queue.splice(pos, 1);
        };
        this.getAll = function () {
            return _this.Queue;
        };
        this.get = function (element) {
            return _this.Queue[element];
        };
        this.getLenght = function () {
            return _this.Queue.length;
        };
    }
    return AudioQueue;
}());
exports["default"] = AudioQueue;
