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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperProvider = void 0;
// import {WebSocket}  from "ws";
var event_1 = require("./event");
var NextId = 1;
var HyperProvider = /** @class */ (function () {
    function HyperProvider(url, wallet) {
        this.requests = {};
        this.events = {};
        this.url = url;
        this.wallet = wallet;
        this.address = null;
    }
    HyperProvider.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.ws == undefined) {
                _this.ws = new WebSocket(_this.url);
                _this.ws.onopen = function (e) {
                    console.log('open successed');
                    resolve(e);
                };
                _this.ws.onerror = function (e) {
                    console.log('open failed');
                    reject(e);
                };
                _this.ws.onclose = function (e) {
                    // console.log('close');
                    reject(e);
                };
                _this.ws.onmessage = function (messageEvent) {
                    var data = messageEvent.data;
                    var result = JSON.parse(data);
                    console.log(data);
                    if (result.id != null) {
                        var id = String(result.id);
                        var request = _this.requests[id];
                        delete _this.requests[id];
                        if (result.result !== undefined) {
                            request.callback(null, result.result);
                        }
                        else {
                            //code message
                            if ((result === null || result === void 0 ? void 0 : result.code) != 0) {
                                if ((result === null || result === void 0 ? void 0 : result.code) == -32009) {
                                    return request.callback(null, 0);
                                }
                            }
                            var error = null;
                            if (result.error) {
                                error = new Error(result.error.message || 'unknown error');
                            }
                            else {
                                error = new Error('unknown error');
                            }
                            request.callback(error, undefined);
                        }
                    }
                };
            }
        });
    };
    HyperProvider.prototype.send = function (method, params) {
        var _this = this;
        var rid = NextId++;
        return new Promise(function (resolve, reject) {
            function callback(error, result) {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            }
            var payload = JSON.stringify({
                method: method,
                params: params,
                id: rid,
                namespace: 'global',
                jsonrpc: '2.0',
            });
            _this.requests[String(rid)] = { callback: callback, payload: payload };
            if (_this.ws) {
                _this.ws.send(payload);
            }
        });
    };
    HyperProvider.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var publicKey;
            return __generator(this, function (_a) {
                if (this.address)
                    return [2 /*return*/, this.address];
                publicKey = this.wallet.getPublicKey();
                return [2 /*return*/, this.send('account_getSm2Address', [publicKey])];
            });
        });
    };
    HyperProvider.prototype.getBalance = function (address) {
        return this.send('account_getBalance', address);
    };
    //此接口需要组织各式各样的交易，待细化
    HyperProvider.prototype.buildUnsignedTx = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //需要调用RPC接口组织待签名交易
                return [2 /*return*/, "aabbccdd"];
            });
        });
    };
    HyperProvider.prototype.signTx = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var sig;
            return __generator(this, function (_a) {
                sig = this.wallet.sign(msg);
                //需要调用RPC接口组织Raw交易
                return [2 /*return*/, sig + "11223344"];
            });
        });
    };
    HyperProvider.prototype.broadcastTx = function (raw) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //需要调用RPC接口广播交易
                return [2 /*return*/, "11223344"]; //txid
            });
        });
    };
    HyperProvider.prototype.subscribe = function (type, tag, listener, once) {
        var args = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            args[_i - 4] = arguments[_i];
        }
        var event = new event_1.HyperEvent(type, tag, listener, once, this);
        event.on(args);
        this.events[tag] = event;
        return;
    };
    HyperProvider.prototype.unsubscribe = function (tag) {
        var event = this.events[tag];
        event.clear();
        delete this.events[tag];
    };
    HyperProvider.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.ws) return [3 /*break*/, 3];
                        if (!(this.ws.readyState === WebSocket.CONNECTING)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                if (_this.ws) {
                                    _this.ws.onopen = function () {
                                        resolve(true);
                                    };
                                    _this.ws.onerror = function () {
                                        resolve(false);
                                    };
                                }
                            })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // Hangup
                        // See: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
                        this.ws.close(1000);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return HyperProvider;
}());
exports.HyperProvider = HyperProvider;
//# sourceMappingURL=provider.js.map