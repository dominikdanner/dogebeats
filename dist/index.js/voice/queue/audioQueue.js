"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var AudioQueue = /** @class */ (function (_super) {
    __extends(AudioQueue, _super);
    function AudioQueue() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Queue = [];
        _this.add = function (data) {
            return _this.Queue.push(data);
        };
        _this.remove = function (pos) {
            _this.emit('remove');
            return _this.Queue.splice(pos, 1);
        };
        _this.getAll = function () {
            return _this.Queue;
        };
        _this.get = function (element) {
            return _this.Queue[element];
        };
        _this.getLenght = function () {
            return _this.Queue.length;
        };
        _this.clear = function () {
            return _this.Queue.splice(0, _this.getLenght());
        };
        return _this;
    }
    return AudioQueue;
}(events_1.EventEmitter));
exports["default"] = AudioQueue;
