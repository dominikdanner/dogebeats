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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.AudioHandler = void 0;
var config_1 = require("../config/config");
var youtube_1 = require("./util/youtube");
var string_1 = require("./util/string");
var error_embed_1 = require("../style/error-embed");
var events_1 = require("events");
var audioQueue_1 = __importDefault(require("./queue/audioQueue"));
var Queue = new audioQueue_1["default"]();
var AudioHandler = /** @class */ (function (_super) {
    __extends(AudioHandler, _super);
    function AudioHandler(client) {
        var _this = _super.call(this) || this;
        _this.SongState = 0;
        _this.start = function () {
            /**
             * All Textbased Commands
             */
            _this.client.on('message', function (msg) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!msg.content.startsWith("" + config_1.bot.PREFIX + config_1.bot.commands.play.name)) return [3 /*break*/, 2];
                            return [4 /*yield*/, youtube_1.getAudio(string_1.getArgsString(msg, "" + config_1.bot.PREFIX + config_1.bot.commands.play.name), function (_err, AudioStream, Song) {
                                    _this.currentSong = Song;
                                    msg.react(config_1.bot.interface["true"]);
                                    if (_err)
                                        throw _err;
                                    //Dynamic Varibales
                                    _this.Channel = msg.member.voice.channel;
                                    if (!_this.Channel)
                                        return msg.channel.send(error_embed_1.errorEmbed('You are not in a Channel.'));
                                    _this.Channel.join().then(function (connection) { return __awaiter(_this, void 0, void 0, function () {
                                        var _a;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    this.channelConnection = connection;
                                                    if (!this.isPlaying) return [3 /*break*/, 1];
                                                    Queue.add(AudioStream);
                                                    return [2 /*return*/, console.log("All Songs: " + Queue.getLenght())];
                                                case 1:
                                                    //Plays the Stream in Discord Channel
                                                    Queue.add(AudioStream);
                                                    _a = this;
                                                    return [4 /*yield*/, connection.play(AudioStream)];
                                                case 2:
                                                    _a.Dispatcher = _b.sent();
                                                    this.isPlaying = true;
                                                    return [2 /*return*/, console.log("Added Lenght: " + Queue.getLenght())];
                                            }
                                        });
                                    }); });
                                })];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            if (msg.content.startsWith(config_1.bot.PREFIX + "skip")) {
                                if (Queue.getLenght() == 1)
                                    return [2 /*return*/, msg.channel.send(error_embed_1.errorEmbed('No Songs to skip'))];
                                else
                                    Queue.remove(0);
                                console.log("Skiped Lenght: " + Queue.getLenght());
                                this.Dispatcher = this.channelConnection.play(Queue.get(0));
                            }
                            // Command for Stopping Dispatcher
                            else if (msg.content.startsWith(config_1.bot.PREFIX + "stop")) {
                                if (this.isPlaying) {
                                    (_a = this.Dispatcher) === null || _a === void 0 ? void 0 : _a.pause();
                                    Queue.getAll().splice(0, Queue.getLenght());
                                    this.isPlaying = false;
                                    this.Dispatcher = null;
                                }
                            }
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        _this.client = client;
        return _this;
    }
    return AudioHandler;
}(events_1.EventEmitter));
exports.AudioHandler = AudioHandler;
