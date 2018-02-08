'use strict';
var TOKEN_REFRESH_REDUCTION = (60 * 1000 * 5); // 5 minutes
var AUTH_SESSION_STORAGE_KEY = 'mtc-auth2';
var LOGOUT_URL = 'https://auth.mtc.byu.edu/oauth2/logout';
var HTMLDialogElement = (function () {
    function HTMLDialogElement() {
    }
    return HTMLDialogElement;
}());
var MTCAuthService = (function () {
    function MTCAuthService() {
        this.config = {
            clientId: '',
            contentUrls: [],
            scopes: [],
            redirectUri: true,
            options: {
                requestAuths: ''
            },
            newTabRedirectUri: false
        };
        this.currentlyAuthing = false;
        this.windowListeners = [];
    }
    MTCAuthService.prototype.configure = function (_config) {
        this.config = _config;
        var token = this.getToken();
        if (this.isValidToken(token)) {
            this.setEventListeners();
        }
        else {
            this.authenticate(true);
        }
    };
    ;
    MTCAuthService.prototype.isAuthenticated = function () {
        var token = this.getToken();
        if (token != null && this.isValidToken(token)) {
            return true;
        }
        return false;
    };
    MTCAuthService.prototype.authenticate = function (initialAuth) {
        // CHECK IF TOKEN EXISTS IN URL
        if (~window.location.href.indexOf('#access_token')) {
            var token = this.stripToken(window.location.href);
            if (token == null) {
                console.log('NO TOKEN FOR SOME WEIRD REASON, THIS SHOULD NOT HAPPEN!');
            }
            //Remove token from URL
            this.removeHash();
            this.setEventListeners();
            //added error catching just incase someone has session stroage disabled.
            try {
                var hash = window.sessionStorage.getItem('hash');
                if (hash) {
                    window.location.href += hash;
                    window.sessionStorage.removeItem('hash');
                }
            }
            catch (err) { }
        }
        else {
            // IF NO TOKEN, REDIRECT AND AUTHENTICATE
            if (this.config.newTabRedirectUri && !initialAuth) {
                this.currentlyAuthing = true;
                this.iframeRefresh();
            }
            else {
                //added error catching just incase someone has session stroage disabled.
                try {
                    var hash_1;
                    if (this.config.redirectUri === true) {
                        hash_1 = window.location.hash;
                    }
                    else {
                        hash_1 = window.location.href.substr(this.config.redirectUri.length);
                    }
                    window.sessionStorage.setItem('hash', hash_1);
                }
                catch (err) { }
                window.location.href = this.buildUrl(this.config);
            }
        }
    };
    MTCAuthService.prototype.iframeRefresh = function () {
        var _this = this;
        //I don't like this but I don't know how else to do it
        window.onChildClosed = function (token) {
            _this.saveToken({
                accessToken: token.access_token,
                expiresIn: token.expires_in
            });
            _this.currentlyAuthing = false;
            window.onAuthed();
            _this.setEventListeners();
        };
        var mywindow = window.open(this.buildIframeUrl(this.config));
        if (!mywindow) {
            this.createDialog(function (con) {
                if (con) {
                    _this.iframeRefresh();
                }
                else {
                    window.location.href = _this.buildUrl(_this.config);
                }
            });
        }
    };
    MTCAuthService.prototype.createDialog = function (callback) {
        var dialog = document.createElement('Dialog');
        document.querySelector('body').appendChild(dialog);
        var ok = document.createElement('button');
        ok.innerText = 'ok';
        var cancel = document.createElement('button');
        cancel.innerText = 'cancel';
        dialog.appendChild(ok);
        dialog.appendChild(cancel);
        dialog.show();
    };
    MTCAuthService.prototype.buildIframeUrl = function (config) {
        // Take config and build Auth URL from object
        var redirectUri;
        if (typeof config.newTabRedirectUri === 'string') {
            redirectUri = config.newTabRedirectUri.toString();
        }
        else {
            redirectUri = window.location.href.split('#')[0];
            redirectUri += redirectUri.charAt(redirectUri.length - 1) !== '/' ? '/' : '';
            redirectUri += 'iframeRefresh.html';
        }
        var url = ("https://auth.mtc.byu.edu/oauth2/auth?client_id=" + config.clientId + "&scope=" + config.scopes.join(' ').replace(/\s/g, '%20')) +
            ("&state=&response_type=token&redirect_uri=" + redirectUri);
        if (config.options && config.options.requestAuths) {
            url.concat('&request_auths=').concat(config.options.requestAuths);
        }
        return url;
    };
    MTCAuthService.prototype.setEventListeners = function () {
        var _this = this;
        var token = this.getToken();
        var now = new Date().getTime();
        var timeoutDelay = token.expiresAt - now - TOKEN_REFRESH_REDUCTION;
        var that = this;
        if (timeoutDelay > 0) {
            this.listenerTimeout = window.setTimeout(function () {
                var service = new WindowEventListenersService();
                _this.windowListeners.push(service.on('click', function () { return that.refreshToken(); }));
                _this.windowListeners.push(service.on('keypress', function () { return that.refreshToken(); }));
                _this.windowListeners.push(service.on('mousemove', function () { return that.refreshToken(); }));
                _this.listenerTimeout = window.setTimeout(function () {
                    _this.removeEventListeners();
                    _this.windowListeners.push(service.on('click', function () { return that.reauth(); }));
                    _this.windowListeners.push(service.on('keypress', function () { return that.reauth(); }));
                    _this.windowListeners.push(service.on('mousemove', function () { return that.reauth(); }));
                    _this.listenerTimeout = null;
                }, TOKEN_REFRESH_REDUCTION);
            }, timeoutDelay);
        }
        else {
            this.refreshToken();
        }
    };
    MTCAuthService.prototype.refreshToken = function () {
        var tokenString = this.getToken().accessToken;
        var that = this;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var token = JSON.parse(this.responseText);
                that.saveToken({
                    accessToken: token.access_token,
                    expiresIn: token.expires_in
                });
                that.setEventListeners();
            }
            else {
                that.authenticate();
            }
        };
        xhttp.open('GET', this.buildRefreshUrl(this.config, tokenString), true);
        xhttp.setRequestHeader('Accept', 'application/json');
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('Authorization', "Bearer " + tokenString);
        xhttp.send();
        if (this.listenerTimeout) {
            window.clearTimeout(this.listenerTimeout);
        }
        //TODO implement refresh token when it is added to oauth
        //Currently we get a Method Not Allowed error here
        this.removeEventListeners();
    };
    MTCAuthService.prototype.removeEventListeners = function () {
        for (var i in this.windowListeners) {
            this.windowListeners[i]();
        }
        this.windowListeners = [];
    };
    MTCAuthService.prototype.buildRefreshUrl = function (config, tokenString) {
        // Take config and build Auth refresh URL from object
        var redirectUri = (typeof config.redirectUri === 'string') ? config.redirectUri : window.location.href;
        //TODO figure out what url to call to refresh the token
        return ("https://auth.mtc.byu.edu/oauth2/auth?client_id=" + config.clientId + "&scope=" + config.scopes.join(' ').replace(/\s/g, '%20')) +
            ("&response_type=token&redirect_uri=" + redirectUri + "&state=initial&access_token=" + tokenString);
    };
    MTCAuthService.prototype.buildUrl = function (config) {
        // Take config and build Auth URL from object
        var redirectUri = (typeof config.redirectUri === 'string') ? config.redirectUri : window.location.href;
        var url = ("https://auth.mtc.byu.edu/oauth2/auth?client_id=" + config.clientId + "&scope=" + config.scopes.join(' ').replace(/\s/g, '%20')) +
            ("&state=&response_type=token&redirect_uri=" + redirectUri);
        if (config.options && config.options.requestAuths) {
            url.concat('&request_auths=').concat(config.options.requestAuths);
        }
        return url;
    };
    MTCAuthService.prototype.reauth = function () {
        if (!this.currentlyAuthing) {
            this.currentlyAuthing = true;
            this.removeEventListeners();
            this.authenticate();
        }
    };
    MTCAuthService.prototype.stripToken = function (path) {
        var params = {}, queryString = path.substring(path.indexOf('#access_token') + 1), regex = /([^&=]+)=([^&]*)/g, m;
        while (m = regex.exec(queryString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        if (params && params.access_token && params.expires_in) {
            var token = {
                accessToken: params.access_token,
                expiresIn: params.expires_in
            };
            this.saveToken(token);
            return true;
        }
        return false;
    };
    MTCAuthService.prototype.removeHash = function () {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    };
    MTCAuthService.prototype.saveToken = function (token) {
        var now = Date.now();
        token.expiresAt = token.expiresAt || (now + (token.expiresIn * 1000));
        window.sessionStorage[AUTH_SESSION_STORAGE_KEY + '-' + this.config.clientId] = JSON.stringify(token);
    };
    MTCAuthService.prototype.getToken = function () {
        var stringToken = window.sessionStorage[AUTH_SESSION_STORAGE_KEY + '-' + this.config.clientId];
        if (stringToken != null) {
            var token = JSON.parse(stringToken);
            var valid = this.isValidToken(token);
            if (valid) {
                // Make sure token is updated with new "expiresAt"
                this.saveToken(token);
            }
            return token;
        }
        else {
            // No token
            return null;
        }
    };
    MTCAuthService.prototype.isValidToken = function (token) {
        var now = new Date().getTime();
        return (token && token.expiresAt > now);
    };
    MTCAuthService.prototype.isAuthenticating = function () {
        return this.currentlyAuthing;
    };
    MTCAuthService.prototype.logout = function () {
        // TODO: implement this
        delete window.sessionStorage[AUTH_SESSION_STORAGE_KEY + '-' + this.config.clientId];
        window.location.href = LOGOUT_URL;
    };
    return MTCAuthService;
}());
var WindowEventListenersService = (function () {
    function WindowEventListenersService() {
    }
    WindowEventListenersService.prototype.on = function (event, listeners) {
        window.addEventListener(event, listeners);
        return function () {
            window.removeEventListener(event, listeners);
        };
    };
    return WindowEventListenersService;
}());
var MTCAuth = new MTCAuthService();

var createDialog = MTCAuth.createDialog;

window.MTCAuth = MTCAuth;