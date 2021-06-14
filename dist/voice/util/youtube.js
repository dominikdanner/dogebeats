"use strict";
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
exports.getAudio = exports.getVideoData = void 0;
var axios_1 = __importDefault(require("axios"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var YoutubeToken = "AIzaSyCKq4UQP9iheNAgb4cZRO4AhF4XcUMpYI8";
/**
 * Calls the Youtube Data API and fetches data for the specific element
 * @param query
 * @callback
 * @async
 */
function getVideoData(query, callback) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get("https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=" + YoutubeToken + "&q=" + query + "&maxResults=1")
                        .then(function (response) {
                        callback(null, response.data.items[0]);
                    })["catch"](function (err) { return callback(err, null); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.getVideoData = getVideoData;
/**
 * Returns Audio Stream as an internal.Readable
 * @param data Could be Youtube URL or a Search Query
 * @async
 */
function getAudio(query, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.time('Queue-Time');
                    data = query.trim();
                    if (!ytdl_core_1["default"].validateURL(data)) return [3 /*break*/, 2];
                    return [4 /*yield*/, ytdl_core_1["default"].getBasicInfo(data).then(function (vidData) { return __awaiter(_this, void 0, void 0, function () {
                            var stream, song;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ytdl_core_1["default"](data, { filter: 'audioonly' })];
                                    case 1:
                                        stream = _a.sent();
                                        song = { url: data, title: vidData.videoDetails.title, thumbnail: vidData.videoDetails.thumbnails[0].url };
                                        callback(null, stream, song);
                                        return [2 /*return*/, console.timeEnd('Queue-Time')];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getVideoData(data, function (err, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, stream, song;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err)
                                        throw err;
                                    id = res.id.videoId;
                                    return [4 /*yield*/, ytdl_core_1["default"]("https://www.youtube.com/watch?v=" + id, { filter: 'audioonly' })];
                                case 1:
                                    stream = _a.sent();
                                    song = { title: res.snippet.title, url: "https://www.youtube.com/watch?v=" + id, thumbnail: res.snippet.thumbnails.high.url };
                                    callback(null, stream, song);
                                    return [2 /*return*/, console.timeEnd("Queue-Time")];
                            }
                        });
                    }); })["catch"](function (err) { return callback(err, null, null); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAudio = getAudio;
