/**
 * @author ydr.me
 * @ref https://github.com/kujian/simple-flexible/blob/master/flexible.js
 */
;(function (designWidth, maxWidth, baseFontSize) {
    'use strict';

    var doc = document;
    var win = window;
    var htmlEl = doc.documentElement;
    var headEl = doc.head;
    var styleEl = doc.createElement('style');
    var refreshREMTimeid;
    var onChangeListeners = [];
    var change = function () {
        onChangeListeners.forEach(function (fn) {
            fn.call(exports);
        });
    };
    var exports = {
        value: 1,
        onChange: function (fn) {
            if (typeof fn === 'function') {
                onChangeListeners.push(fn);
            }
        },
        px2rem: function (px) {
            return px / exports.value;
        },
        rem2px: function (rem) {
            return rem * exports.value;
        }
    };


    baseFontSize = baseFontSize + 'px';
    headEl.appendChild(styleEl);


    /**
     * 计算 REM
     */
    var computeREM = function computeREM() {
        var width = htmlEl.getBoundingClientRect().width;

        if (!maxWidth) {
            maxWidth = 540;
        }

        if (width > maxWidth) {
            width = maxWidth;
        }

        var rem = width * 100 / designWidth;
        var remStyleText = 'html{font-size:' + rem + 'px !important}';

        if (styleEl.styleSheet) {
            styleEl.styleSheet.cssText = remStyleText;
        } else {
            try {
                styleEl.innerHTML = remStyleText
            } catch (f) {
                styleEl.innerText = remStyleText
            }
        }

        htmlEl.style.fontSize = rem + 'px';
        exports.value = rem;
        change();
    };


    /**
     * 刷新 REM
     */
    var refreshREM = function refreshREM() {
        clearTimeout(refreshREMTimeid);
        refreshREMTimeid = setTimeout(computeREM, 300);
    };

    win.addEventListener('resize', refreshREM);

    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            refreshREM();
        }
    });

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = baseFontSize;
    } else {
        doc.addEventListener('DOMContentLoaded', function () {
            doc.body.style.fontSize = baseFontSize;
        });
    }

    refreshREM();
    win.rem = exports;
}(750, 750, 16));