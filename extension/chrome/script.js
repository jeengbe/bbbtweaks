/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/hijackSocket.ts":
/*!*****************************!*\
  !*** ./src/hijackSocket.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const _WebSocket = window.WebSocket;
const replaceSocket = () => {
    const WebSocket = function (url, protocols) {
        console.log("Open connection: ", url);
        const socket = new _WebSocket(url, protocols);
        const socketSend = socket.send.bind(socket);
        socket.send = msg => {
            console.log("Send: ", msg);
            return socketSend(msg);
        };
        return socket;
    };
    WebSocket.prototype = _WebSocket.prototype;
    WebSocket.CLOSED = _WebSocket.CLOSED;
    WebSocket.CLOSING = _WebSocket.CLOSING;
    WebSocket.CONNECTING = _WebSocket.CONNECTING;
    WebSocket.OPEN = _WebSocket.OPEN;
    // @ts-ignore
    window.WebSocket = WebSocket;
};
exports.default = () => {
    replaceSocket();
};


/***/ }),

/***/ "./src/run.ts":
/*!********************!*\
  !*** ./src/run.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const hijackSocket_1 = __webpack_require__(/*! ./hijackSocket */ "./src/hijackSocket.ts");
hijackSocket_1.default();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/run.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYmJ0d2Vha3NfZXh0ZW5zaW9uX2Nocm9tZS8uL3NyYy9oaWphY2tTb2NrZXQudHMiLCJ3ZWJwYWNrOi8vYmJidHdlYWtzX2V4dGVuc2lvbl9jaHJvbWUvLi9zcmMvcnVuLnRzIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBOzs7Ozs7Ozs7OztBQ3hCYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCx1QkFBdUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDL0M7Ozs7Ozs7VUNIQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7O1VDckJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IF9XZWJTb2NrZXQgPSB3aW5kb3cuV2ViU29ja2V0O1xyXG5jb25zdCByZXBsYWNlU29ja2V0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgV2ViU29ja2V0ID0gZnVuY3Rpb24gKHVybCwgcHJvdG9jb2xzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJPcGVuIGNvbm5lY3Rpb246IFwiLCB1cmwpO1xyXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldyBfV2ViU29ja2V0KHVybCwgcHJvdG9jb2xzKTtcclxuICAgICAgICBjb25zdCBzb2NrZXRTZW5kID0gc29ja2V0LnNlbmQuYmluZChzb2NrZXQpO1xyXG4gICAgICAgIHNvY2tldC5zZW5kID0gbXNnID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kOiBcIiwgbXNnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHNvY2tldFNlbmQobXNnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XHJcbiAgICB9O1xyXG4gICAgV2ViU29ja2V0LnByb3RvdHlwZSA9IF9XZWJTb2NrZXQucHJvdG90eXBlO1xyXG4gICAgV2ViU29ja2V0LkNMT1NFRCA9IF9XZWJTb2NrZXQuQ0xPU0VEO1xyXG4gICAgV2ViU29ja2V0LkNMT1NJTkcgPSBfV2ViU29ja2V0LkNMT1NJTkc7XHJcbiAgICBXZWJTb2NrZXQuQ09OTkVDVElORyA9IF9XZWJTb2NrZXQuQ09OTkVDVElORztcclxuICAgIFdlYlNvY2tldC5PUEVOID0gX1dlYlNvY2tldC5PUEVOO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgd2luZG93LldlYlNvY2tldCA9IFdlYlNvY2tldDtcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKCkgPT4ge1xyXG4gICAgcmVwbGFjZVNvY2tldCgpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBoaWphY2tTb2NrZXRfMSA9IHJlcXVpcmUoXCIuL2hpamFja1NvY2tldFwiKTtcclxuaGlqYWNrU29ja2V0XzEuZGVmYXVsdCgpO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcnVuLnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==