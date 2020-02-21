/* eslint-disable */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebLinkProvider_1 = require("./WebLinkProvider");
var protocolClause = '(https?:\\/\\/)';
var domainCharacterSet = '[\\da-z\\.-]+';
var negatedDomainCharacterSet = '[^\\da-z\\.-]+';
var domainBodyClause = '(' + domainCharacterSet + ')';
var tldClause = '([a-z\\.]{2,6})';
var ipClause = '((\\d{1,3}\\.){3}\\d{1,3})';
var localHostClause = '(localhost)';
var portClause = '(:\\d{1,5})';
var hostClause = '((' + domainBodyClause + '\\.' + tldClause + ')|' + ipClause + '|' + localHostClause + ')' + portClause + '?';
var pathCharacterSet = '(\\/[\\/\\w\\.\\-%~:+]*)*([^:"\'\\s])';
var pathClause = '(' + pathCharacterSet + ')?';
var queryStringHashFragmentCharacterSet = '[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&\'*+,:;~\\=\\.\\-]*';
var queryStringClause = '(\\?' + queryStringHashFragmentCharacterSet + ')?';
var hashFragmentClause = '(#' + queryStringHashFragmentCharacterSet + ')?';
var negatedPathCharacterSet = '[^\\/\\w\\.\\-%]+';
var bodyClause = hostClause + pathClause + queryStringClause + hashFragmentClause;
var start = '(?:^|' + negatedDomainCharacterSet + ')(';
var end = ')($|' + negatedPathCharacterSet + ')';
var strictUrlRegex = new RegExp(start + protocolClause + bodyClause + end);
function handleLink(event, uri) {
    if (undefined !== window.tauri) {
        window.tauri.open(uri);
    }
    else {
        var newWindow = window.open();
        if (newWindow) {
            newWindow.opener = null;
            newWindow.location.href = uri;
        }
        else {
            console.warn('Opening link blocked as opener could not be cleared');
        }
    }
}
var WebLinksAddon = (function () {
    function WebLinksAddon(_handler, _options, _useLinkProvider) {
        if (_handler === void 0) { _handler = handleLink; }
        if (_options === void 0) { _options = {}; }
        if (_useLinkProvider === void 0) { _useLinkProvider = false; }
        this._handler = _handler;
        this._options = _options;
        this._useLinkProvider = _useLinkProvider;
        this._options.matchIndex = 1;
    }
    WebLinksAddon.prototype.activate = function (terminal) {
        this._terminal = terminal;
        if (this._useLinkProvider && 'registerLinkProvider' in this._terminal) {
            this._linkProvider = this._terminal.registerLinkProvider(new WebLinkProvider_1.WebLinkProvider(this._terminal, strictUrlRegex, this._handler));
        }
        else {
            this._linkMatcherId = this._terminal.registerLinkMatcher(strictUrlRegex, this._handler, this._options);
        }
    };
    WebLinksAddon.prototype.dispose = function () {
        var _a;
        if (this._linkMatcherId !== undefined && this._terminal !== undefined) {
            this._terminal.deregisterLinkMatcher(this._linkMatcherId);
        }
        (_a = this._linkProvider) === null || _a === void 0 ? void 0 : _a.dispose();
    };
    return WebLinksAddon;
}());
exports.WebLinksAddon = WebLinksAddon;
//# sourceMappingURL=WebLinksAddon.js.map