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
    // const _WebSocket = window.WebSocket;
    // window.WebSocket = function WebSocket(url, protocols) {
    //   console.log("Open Connection:" + url);
    //   const socket = new _WebSocket(url, protocols);
    //   const socketSend = socket.send.bind(socket);
    //   socket.send = text => {
    //     const json = JSON.parse(JSON.parse(text)[0]);
    //     console.log("Send message: " + text, json);
    //     if (json["method"] === "validateAuthToken") {
    //       // Sub happened
    //       window.ID = json["params"][3];
    //     }
    //     return socketSend(text);
    //   };
    //   window.socket = socket;
    //   window.send = msg => {
    //     window.socket.send(JSON.stringify([JSON.stringify(msg)]));
    //   };
    //   return socket;
    // };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYmJ0d2Vha3NfZXh0ZW5zaW9uX2Nocm9tZS8uL3NyYy9oaWphY2tTb2NrZXQudHMiLCJ3ZWJwYWNrOi8vYmJidHdlYWtzX2V4dGVuc2lvbl9jaHJvbWUvLi9zcmMvcnVuLnRzIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDM0NhO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELHVCQUF1QixtQkFBTyxDQUFDLDZDQUFnQjtBQUMvQzs7Ozs7OztVQ0hBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7VUNyQkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgX1dlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQ7XHJcbmNvbnN0IHJlcGxhY2VTb2NrZXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBXZWJTb2NrZXQgPSBmdW5jdGlvbiAodXJsLCBwcm90b2NvbHMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIk9wZW4gY29ubmVjdGlvbjogXCIsIHVybCk7XHJcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbmV3IF9XZWJTb2NrZXQodXJsLCBwcm90b2NvbHMpO1xyXG4gICAgICAgIGNvbnN0IHNvY2tldFNlbmQgPSBzb2NrZXQuc2VuZC5iaW5kKHNvY2tldCk7XHJcbiAgICAgICAgc29ja2V0LnNlbmQgPSBtc2cgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc29ja2V0U2VuZChtc2cpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHNvY2tldDtcclxuICAgIH07XHJcbiAgICBXZWJTb2NrZXQucHJvdG90eXBlID0gX1dlYlNvY2tldC5wcm90b3R5cGU7XHJcbiAgICBXZWJTb2NrZXQuQ0xPU0VEID0gX1dlYlNvY2tldC5DTE9TRUQ7XHJcbiAgICBXZWJTb2NrZXQuQ0xPU0lORyA9IF9XZWJTb2NrZXQuQ0xPU0lORztcclxuICAgIFdlYlNvY2tldC5DT05ORUNUSU5HID0gX1dlYlNvY2tldC5DT05ORUNUSU5HO1xyXG4gICAgV2ViU29ja2V0Lk9QRU4gPSBfV2ViU29ja2V0Lk9QRU47XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB3aW5kb3cuV2ViU29ja2V0ID0gV2ViU29ja2V0O1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoKSA9PiB7XHJcbiAgICByZXBsYWNlU29ja2V0KCk7XHJcbiAgICAvLyBjb25zdCBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcclxuICAgIC8vIHdpbmRvdy5XZWJTb2NrZXQgPSBmdW5jdGlvbiBXZWJTb2NrZXQodXJsLCBwcm90b2NvbHMpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coXCJPcGVuIENvbm5lY3Rpb246XCIgKyB1cmwpO1xyXG4gICAgLy8gICBjb25zdCBzb2NrZXQgPSBuZXcgX1dlYlNvY2tldCh1cmwsIHByb3RvY29scyk7XHJcbiAgICAvLyAgIGNvbnN0IHNvY2tldFNlbmQgPSBzb2NrZXQuc2VuZC5iaW5kKHNvY2tldCk7XHJcbiAgICAvLyAgIHNvY2tldC5zZW5kID0gdGV4dCA9PiB7XHJcbiAgICAvLyAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoSlNPTi5wYXJzZSh0ZXh0KVswXSk7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJTZW5kIG1lc3NhZ2U6IFwiICsgdGV4dCwganNvbik7XHJcbiAgICAvLyAgICAgaWYgKGpzb25bXCJtZXRob2RcIl0gPT09IFwidmFsaWRhdGVBdXRoVG9rZW5cIikge1xyXG4gICAgLy8gICAgICAgLy8gU3ViIGhhcHBlbmVkXHJcbiAgICAvLyAgICAgICB3aW5kb3cuSUQgPSBqc29uW1wicGFyYW1zXCJdWzNdO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICByZXR1cm4gc29ja2V0U2VuZCh0ZXh0KTtcclxuICAgIC8vICAgfTtcclxuICAgIC8vICAgd2luZG93LnNvY2tldCA9IHNvY2tldDtcclxuICAgIC8vICAgd2luZG93LnNlbmQgPSBtc2cgPT4ge1xyXG4gICAgLy8gICAgIHdpbmRvdy5zb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShbSlNPTi5zdHJpbmdpZnkobXNnKV0pKTtcclxuICAgIC8vICAgfTtcclxuICAgIC8vICAgcmV0dXJuIHNvY2tldDtcclxuICAgIC8vIH07XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGhpamFja1NvY2tldF8xID0gcmVxdWlyZShcIi4vaGlqYWNrU29ja2V0XCIpO1xyXG5oaWphY2tTb2NrZXRfMS5kZWZhdWx0KCk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9ydW4udHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9