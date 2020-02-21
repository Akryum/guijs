/* eslint-disable */

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
var chai_1 = require("chai");
var TestUtils_1 = require("../../../out-test/api/TestUtils");
var APP = 'http://127.0.0.1:3000/test';
var browser;
var page;
var width = 800;
var height = 600;
describe('WebLinksAddon', function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var browserType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        browserType = TestUtils_1.getBrowserType();
                        return [4, browserType.launch({
                                headless: process.argv.indexOf('--headless') !== -1,
                                args: ["--window-size=" + width + "," + height, "--no-sandbox"]
                            })];
                    case 1:
                        browser = _a.sent();
                        return [4, browser.newContext()];
                    case 2: return [4, (_a.sent()).newPage()];
                    case 3:
                        page = _a.sent();
                        return [4, page.setViewportSize({ width: width, height: height })];
                    case 4:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    after(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, browser.close()];
            case 1: return [2, _a.sent()];
        }
    }); }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, page.goto(APP)];
            case 1: return [2, _a.sent()];
        }
    }); }); });
    it('.com', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, testHostName('foo.com')];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it('.com.au', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, testHostName('foo.com.au')];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
    it('.io', function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, testHostName('foo.io')];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    });
});
function testHostName(hostname) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, TestUtils_1.openTerminal(page, { rendererType: 'dom', cols: 40 })];
                case 1:
                    _a.sent();
                    return [4, page.evaluate("window.term.loadAddon(new window.WebLinksAddon())")];
                case 2:
                    _a.sent();
                    data = "  http://" + hostname + "  \\r\\n" +
                        ("  http://" + hostname + "/a~b#c~d?e~f  \\r\\n") +
                        ("  http://" + hostname + "/colon:test  \\r\\n") +
                        ("  http://" + hostname + "/colon:test:  \\r\\n") +
                        ("\"http://" + hostname + "/\"\\r\\n") +
                        ("\\'http://" + hostname + "/\\'\\r\\n") +
                        ("http://" + hostname + "/subpath/+/id");
                    return [4, TestUtils_1.writeSync(page, data)];
                case 3:
                    _a.sent();
                    return [4, pollForLinkAtCell(3, 1, "http://" + hostname)];
                case 4:
                    _a.sent();
                    return [4, pollForLinkAtCell(3, 2, "http://" + hostname + "/a~b#c~d?e~f")];
                case 5:
                    _a.sent();
                    return [4, pollForLinkAtCell(3, 3, "http://" + hostname + "/colon:test")];
                case 6:
                    _a.sent();
                    return [4, pollForLinkAtCell(3, 4, "http://" + hostname + "/colon:test")];
                case 7:
                    _a.sent();
                    return [4, pollForLinkAtCell(2, 5, "http://" + hostname + "/")];
                case 8:
                    _a.sent();
                    return [4, pollForLinkAtCell(2, 6, "http://" + hostname + "/")];
                case 9:
                    _a.sent();
                    return [4, pollForLinkAtCell(1, 7, "http://" + hostname + "/subpath/+/id")];
                case 10:
                    _a.sent();
                    return [2];
            }
        });
    });
}
function pollForLinkAtCell(col, row, value) {
    return __awaiter(this, void 0, void 0, function () {
        var rowSelector, _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rowSelector = ".xterm-rows > :nth-child(" + row + ")";
                    return [4, TestUtils_1.pollFor(page, "!!document.querySelector('" + rowSelector + " > :nth-child(" + col + ")')", true)];
                case 1:
                    _c.sent();
                    return [4, TestUtils_1.pollFor(page, "document.querySelectorAll('" + rowSelector + " > span[style]').length >= " + value.length, true, function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2, page.hover(rowSelector + " > :nth-child(" + col + ")")];
                        }); }); })];
                case 2:
                    _c.sent();
                    _b = (_a = chai_1.assert).equal;
                    return [4, page.evaluate("Array.prototype.reduce.call(document.querySelectorAll('" + rowSelector + " > span[style]'), (a, b) => a + b.textContent, '');")];
                case 3:
                    _b.apply(_a, [_c.sent(), value]);
                    return [2];
            }
        });
    });
}
//# sourceMappingURL=WebLinksAddon.api.js.map