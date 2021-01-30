/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/addEvents.js":
/*!**************************!*\
  !*** ./src/addEvents.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _hijackSocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hijackSocket */ "./src/hijackSocket.js");


const settingsChangeListener = msg => {
  if (msg.method === "userChangedLocalSettings") {
    msg.params[0].application.chatAudioAlerts = true;
    msg.params[0].application.chatPushAlerts = true;
    msg.params[0].application.userJoinPushAlerts = true;
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addOutListener)(msg => {
    console.log("OUT", msg);
  });

  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addInListener)(msg => {
    console.log("IN", msg);
  });

  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addInListener)(msg => {
    if (msg.msg === "added" && msg.collection === "meetings") {
      msg.fields.welcomeProp.welcomeMsg = "";
    }
  });

  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addOutListener)(settingsChangeListener);
});


/***/ }),

/***/ "./src/bbbWrapper.js":
/*!***************************!*\
  !*** ./src/bbbWrapper.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bbbSocket": () => /* binding */ bbbSocket,
/* harmony export */   "sendMessage": () => /* binding */ sendMessage,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _hijackSocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hijackSocket */ "./src/hijackSocket.js");


let authPacketID;

let bbbSocket;
let userID;

const sendMessage = (...packets) => {
  packets.forEach(packet => (packet.id ||= "-1"));
  bbbSocket.send(JSON.stringify([packets.map(packet => JSON.stringify(packet))]));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addOutListener)(msg => {
    if (msg.msg === "method" && msg.method === "validateAuthToken") {
      authPacketID = msg.id;
    }
  });

  (0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.addInListener)((msg, socket) => {
    // ID -1 bypass
    if (msg.msg === "updated" && msg.methods.includes("-1")) {
      return false;
    }
    if (msg.msg === "result" && msg.id === "-1") {
      return false;
    }

    // Bind Socket
    if (msg.msg === "result" && msg.id === authPacketID) {
      bbbSocket = socket;
    }

    // User ID
    if (msg.msg === "added" && msg.collection === "users") {
      userID = msg.fields.userId;
    }
  });

  window.bbb = {
    _send: sendMessage.bind(undefined),

    // Emoji
    EMOJIS: {
      AWAY: "away",
      RAISE_HAND: "raiseHand",
      UNDECIDED: "neutral",
      CONFUSED: "confused",
      SAD: "sad",
      HAPPY: "happy",
      APPLAUD: "applause",
      THUMBS_UP: "thumbsUp",
      THUMBS_DOWN: "thumbsDown"
    },
    setEmojiStatus: (emoji) => {
      sendMessage({
        msg: "method",
        method: "setEmojiStatus",
        params: [
          userID,
          emoji
        ]
      });
    }


  };
});


/***/ }),

/***/ "./src/hijackSocket.js":
/*!*****************************!*\
  !*** ./src/hijackSocket.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addOutListener": () => /* binding */ addOutListener,
/* harmony export */   "addInListener": () => /* binding */ addInListener,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const _WebSocket = window.WebSocket;

const outListeners = [];
const inListeners = [];

const replaceSocket = () => {
  const WebSocket = function (url, protocols) {
    console.log("Open connection: ", url);
    const socket = new _WebSocket(url, protocols);

    const fakeSocket = {};
    for (const p in socket) {
      fakeSocket[p] = socket[p];
    }

    fakeSocket.send = msg => {
      if (typeof msg === "string") {
        let send = true;
        const packets = JSON.parse(msg);
        const packetsOut = [];

        packets.forEach(p => {
          const packet = JSON.parse(p);
          send &&= !outListeners.some(l => l(packet, socket) === false);
          packetsOut.push(JSON.stringify(packet));
        });

        if (send) {
          return socket.send(JSON.stringify(packetsOut));
        }
      } else {
        console.error("Send raw data: ", msg);
        return socket.send(msg);
      }
    };

    socket.onmessage = ev => {
      const data = {};
      for (const k in ev) {
        data[k] = ev[k];
      }

      let send = true;
      if (ev.data.substring(0, 1) === "a") {
        const packets = JSON.parse(ev.data.substring(1));
        const packetsIn = [];

        packets.forEach(p => {
          const packet = JSON.parse(p);
          send &&= !inListeners.some(l => l(packet, socket) === false);
          packetsIn.push(JSON.stringify(packet));
        });

        data.data = "a" + JSON.stringify(packetsIn);
      }
      if (send) {
        fakeSocket.onmessage(data);
      }
    };
    return fakeSocket;
  };

  WebSocket.prototype = _WebSocket.prototype;
  WebSocket.CLOSED = _WebSocket.CLOSED;
  WebSocket.CLOSING = _WebSocket.CLOSING;
  WebSocket.CONNECTING = _WebSocket.CONNECTING;
  WebSocket.OPEN = _WebSocket.OPEN;

  window.WebSocket = WebSocket;
};

const addOutListener = (...listener) => {
  outListeners.push(...listener);
};

const addInListener = (...listener) => {
  inListeners.push(...listener);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  replaceSocket();
});


/***/ }),

/***/ "./src/run.js":
/*!********************!*\
  !*** ./src/run.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hijackSocket__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hijackSocket */ "./src/hijackSocket.js");
/* harmony import */ var _bbbWrapper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bbbWrapper */ "./src/bbbWrapper.js");
/* harmony import */ var _addEvents__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addEvents */ "./src/addEvents.js");




(0,_hijackSocket__WEBPACK_IMPORTED_MODULE_0__.default)();
(0,_bbbWrapper__WEBPACK_IMPORTED_MODULE_1__.default)();
(0,_addEvents__WEBPACK_IMPORTED_MODULE_2__.default)();

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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/run.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYmJ0d2Vha3NfZXh0ZW5zaW9uX2Nocm9tZS8uL3NyYy9hZGRFdmVudHMuanMiLCJ3ZWJwYWNrOi8vYmJidHdlYWtzX2V4dGVuc2lvbl9jaHJvbWUvLi9zcmMvYmJiV3JhcHBlci5qcyIsIndlYnBhY2s6Ly9iYmJ0d2Vha3NfZXh0ZW5zaW9uX2Nocm9tZS8uL3NyYy9oaWphY2tTb2NrZXQuanMiLCJ3ZWJwYWNrOi8vYmJidHdlYWtzX2V4dGVuc2lvbl9jaHJvbWUvLi9zcmMvcnVuLmpzIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYmJ0d2Vha3NfZXh0ZW5zaW9uX2Nocm9tZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JiYnR3ZWFrc19leHRlbnNpb25fY2hyb21lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmJidHdlYWtzX2V4dGVuc2lvbl9jaHJvbWUvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUErRDs7QUFFL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWU7QUFDZixFQUFFLDZEQUFjO0FBQ2hCO0FBQ0EsR0FBRzs7QUFFSCxFQUFFLDREQUFhO0FBQ2Y7QUFDQSxHQUFHOztBQUVILEVBQUUsNERBQWE7QUFDZjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsNkRBQWM7QUFDaEIsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQjZEOztBQUUvRDs7QUFFTztBQUNQOztBQUVPO0FBQ1A7QUFDQTtBQUNBOztBQUVBLGlFQUFlO0FBQ2YsRUFBRSw2REFBYztBQUNoQjtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVILEVBQUUsNERBQWE7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSw0QkFBNEIsU0FBSTs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOzs7QUFHQTtBQUNBLENBQUMsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuRUY7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQSxpRUFBZTtBQUNmO0FBQ0EsQ0FBQyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNqRndDO0FBQ0w7QUFDRDs7QUFFcEMsc0RBQVk7QUFDWixvREFBUztBQUNULG1EQUFTLEc7Ozs7OztVQ05UO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhZGRPdXRMaXN0ZW5lciwgYWRkSW5MaXN0ZW5lciB9IGZyb20gXCIuL2hpamFja1NvY2tldFwiO1xyXG5cclxuY29uc3Qgc2V0dGluZ3NDaGFuZ2VMaXN0ZW5lciA9IG1zZyA9PiB7XHJcbiAgaWYgKG1zZy5tZXRob2QgPT09IFwidXNlckNoYW5nZWRMb2NhbFNldHRpbmdzXCIpIHtcclxuICAgIG1zZy5wYXJhbXNbMF0uYXBwbGljYXRpb24uY2hhdEF1ZGlvQWxlcnRzID0gdHJ1ZTtcclxuICAgIG1zZy5wYXJhbXNbMF0uYXBwbGljYXRpb24uY2hhdFB1c2hBbGVydHMgPSB0cnVlO1xyXG4gICAgbXNnLnBhcmFtc1swXS5hcHBsaWNhdGlvbi51c2VySm9pblB1c2hBbGVydHMgPSB0cnVlO1xyXG4gIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcclxuICBhZGRPdXRMaXN0ZW5lcihtc2cgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJPVVRcIiwgbXNnKTtcclxuICB9KTtcclxuXHJcbiAgYWRkSW5MaXN0ZW5lcihtc2cgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJJTlwiLCBtc2cpO1xyXG4gIH0pO1xyXG5cclxuICBhZGRJbkxpc3RlbmVyKG1zZyA9PiB7XHJcbiAgICBpZiAobXNnLm1zZyA9PT0gXCJhZGRlZFwiICYmIG1zZy5jb2xsZWN0aW9uID09PSBcIm1lZXRpbmdzXCIpIHtcclxuICAgICAgbXNnLmZpZWxkcy53ZWxjb21lUHJvcC53ZWxjb21lTXNnID0gXCJcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYWRkT3V0TGlzdGVuZXIoc2V0dGluZ3NDaGFuZ2VMaXN0ZW5lcik7XHJcbn07XHJcbiIsImltcG9ydCB7IGFkZE91dExpc3RlbmVyLCBhZGRJbkxpc3RlbmVyIH0gZnJvbSBcIi4vaGlqYWNrU29ja2V0XCI7XHJcblxyXG5sZXQgYXV0aFBhY2tldElEO1xyXG5cclxuZXhwb3J0IGxldCBiYmJTb2NrZXQ7XHJcbmxldCB1c2VySUQ7XHJcblxyXG5leHBvcnQgY29uc3Qgc2VuZE1lc3NhZ2UgPSAoLi4ucGFja2V0cykgPT4ge1xyXG4gIHBhY2tldHMuZm9yRWFjaChwYWNrZXQgPT4gKHBhY2tldC5pZCB8fD0gXCItMVwiKSk7XHJcbiAgYmJiU29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoW3BhY2tldHMubWFwKHBhY2tldCA9PiBKU09OLnN0cmluZ2lmeShwYWNrZXQpKV0pKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcclxuICBhZGRPdXRMaXN0ZW5lcihtc2cgPT4ge1xyXG4gICAgaWYgKG1zZy5tc2cgPT09IFwibWV0aG9kXCIgJiYgbXNnLm1ldGhvZCA9PT0gXCJ2YWxpZGF0ZUF1dGhUb2tlblwiKSB7XHJcbiAgICAgIGF1dGhQYWNrZXRJRCA9IG1zZy5pZDtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYWRkSW5MaXN0ZW5lcigobXNnLCBzb2NrZXQpID0+IHtcclxuICAgIC8vIElEIC0xIGJ5cGFzc1xyXG4gICAgaWYgKG1zZy5tc2cgPT09IFwidXBkYXRlZFwiICYmIG1zZy5tZXRob2RzLmluY2x1ZGVzKFwiLTFcIikpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKG1zZy5tc2cgPT09IFwicmVzdWx0XCIgJiYgbXNnLmlkID09PSBcIi0xXCIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEJpbmQgU29ja2V0XHJcbiAgICBpZiAobXNnLm1zZyA9PT0gXCJyZXN1bHRcIiAmJiBtc2cuaWQgPT09IGF1dGhQYWNrZXRJRCkge1xyXG4gICAgICBiYmJTb2NrZXQgPSBzb2NrZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXNlciBJRFxyXG4gICAgaWYgKG1zZy5tc2cgPT09IFwiYWRkZWRcIiAmJiBtc2cuY29sbGVjdGlvbiA9PT0gXCJ1c2Vyc1wiKSB7XHJcbiAgICAgIHVzZXJJRCA9IG1zZy5maWVsZHMudXNlcklkO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB3aW5kb3cuYmJiID0ge1xyXG4gICAgX3NlbmQ6IHNlbmRNZXNzYWdlLmJpbmQodGhpcyksXHJcblxyXG4gICAgLy8gRW1vamlcclxuICAgIEVNT0pJUzoge1xyXG4gICAgICBBV0FZOiBcImF3YXlcIixcclxuICAgICAgUkFJU0VfSEFORDogXCJyYWlzZUhhbmRcIixcclxuICAgICAgVU5ERUNJREVEOiBcIm5ldXRyYWxcIixcclxuICAgICAgQ09ORlVTRUQ6IFwiY29uZnVzZWRcIixcclxuICAgICAgU0FEOiBcInNhZFwiLFxyXG4gICAgICBIQVBQWTogXCJoYXBweVwiLFxyXG4gICAgICBBUFBMQVVEOiBcImFwcGxhdXNlXCIsXHJcbiAgICAgIFRIVU1CU19VUDogXCJ0aHVtYnNVcFwiLFxyXG4gICAgICBUSFVNQlNfRE9XTjogXCJ0aHVtYnNEb3duXCJcclxuICAgIH0sXHJcbiAgICBzZXRFbW9qaVN0YXR1czogKGVtb2ppKSA9PiB7XHJcbiAgICAgIHNlbmRNZXNzYWdlKHtcclxuICAgICAgICBtc2c6IFwibWV0aG9kXCIsXHJcbiAgICAgICAgbWV0aG9kOiBcInNldEVtb2ppU3RhdHVzXCIsXHJcbiAgICAgICAgcGFyYW1zOiBbXHJcbiAgICAgICAgICB1c2VySUQsXHJcbiAgICAgICAgICBlbW9qaVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuICB9O1xyXG59O1xyXG4iLCJjb25zdCBfV2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldDtcclxuXHJcbmNvbnN0IG91dExpc3RlbmVycyA9IFtdO1xyXG5jb25zdCBpbkxpc3RlbmVycyA9IFtdO1xyXG5cclxuY29uc3QgcmVwbGFjZVNvY2tldCA9ICgpID0+IHtcclxuICBjb25zdCBXZWJTb2NrZXQgPSBmdW5jdGlvbiAodXJsLCBwcm90b2NvbHMpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiT3BlbiBjb25uZWN0aW9uOiBcIiwgdXJsKTtcclxuICAgIGNvbnN0IHNvY2tldCA9IG5ldyBfV2ViU29ja2V0KHVybCwgcHJvdG9jb2xzKTtcclxuXHJcbiAgICBjb25zdCBmYWtlU29ja2V0ID0ge307XHJcbiAgICBmb3IgKGNvbnN0IHAgaW4gc29ja2V0KSB7XHJcbiAgICAgIGZha2VTb2NrZXRbcF0gPSBzb2NrZXRbcF07XHJcbiAgICB9XHJcblxyXG4gICAgZmFrZVNvY2tldC5zZW5kID0gbXNnID0+IHtcclxuICAgICAgaWYgKHR5cGVvZiBtc2cgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBsZXQgc2VuZCA9IHRydWU7XHJcbiAgICAgICAgY29uc3QgcGFja2V0cyA9IEpTT04ucGFyc2UobXNnKTtcclxuICAgICAgICBjb25zdCBwYWNrZXRzT3V0ID0gW107XHJcblxyXG4gICAgICAgIHBhY2tldHMuZm9yRWFjaChwID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhY2tldCA9IEpTT04ucGFyc2UocCk7XHJcbiAgICAgICAgICBzZW5kICYmPSAhb3V0TGlzdGVuZXJzLnNvbWUobCA9PiBsKHBhY2tldCwgc29ja2V0KSA9PT0gZmFsc2UpO1xyXG4gICAgICAgICAgcGFja2V0c091dC5wdXNoKEpTT04uc3RyaW5naWZ5KHBhY2tldCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoc2VuZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHBhY2tldHNPdXQpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlNlbmQgcmF3IGRhdGE6IFwiLCBtc2cpO1xyXG4gICAgICAgIHJldHVybiBzb2NrZXQuc2VuZChtc2cpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBldiA9PiB7XHJcbiAgICAgIGNvbnN0IGRhdGEgPSB7fTtcclxuICAgICAgZm9yIChjb25zdCBrIGluIGV2KSB7XHJcbiAgICAgICAgZGF0YVtrXSA9IGV2W2tdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgc2VuZCA9IHRydWU7XHJcbiAgICAgIGlmIChldi5kYXRhLnN1YnN0cmluZygwLCAxKSA9PT0gXCJhXCIpIHtcclxuICAgICAgICBjb25zdCBwYWNrZXRzID0gSlNPTi5wYXJzZShldi5kYXRhLnN1YnN0cmluZygxKSk7XHJcbiAgICAgICAgY29uc3QgcGFja2V0c0luID0gW107XHJcblxyXG4gICAgICAgIHBhY2tldHMuZm9yRWFjaChwID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhY2tldCA9IEpTT04ucGFyc2UocCk7XHJcbiAgICAgICAgICBzZW5kICYmPSAhaW5MaXN0ZW5lcnMuc29tZShsID0+IGwocGFja2V0LCBzb2NrZXQpID09PSBmYWxzZSk7XHJcbiAgICAgICAgICBwYWNrZXRzSW4ucHVzaChKU09OLnN0cmluZ2lmeShwYWNrZXQpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGF0YS5kYXRhID0gXCJhXCIgKyBKU09OLnN0cmluZ2lmeShwYWNrZXRzSW4pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzZW5kKSB7XHJcbiAgICAgICAgZmFrZVNvY2tldC5vbm1lc3NhZ2UoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gZmFrZVNvY2tldDtcclxuICB9O1xyXG5cclxuICBXZWJTb2NrZXQucHJvdG90eXBlID0gX1dlYlNvY2tldC5wcm90b3R5cGU7XHJcbiAgV2ViU29ja2V0LkNMT1NFRCA9IF9XZWJTb2NrZXQuQ0xPU0VEO1xyXG4gIFdlYlNvY2tldC5DTE9TSU5HID0gX1dlYlNvY2tldC5DTE9TSU5HO1xyXG4gIFdlYlNvY2tldC5DT05ORUNUSU5HID0gX1dlYlNvY2tldC5DT05ORUNUSU5HO1xyXG4gIFdlYlNvY2tldC5PUEVOID0gX1dlYlNvY2tldC5PUEVOO1xyXG5cclxuICB3aW5kb3cuV2ViU29ja2V0ID0gV2ViU29ja2V0O1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZE91dExpc3RlbmVyID0gKC4uLmxpc3RlbmVyKSA9PiB7XHJcbiAgb3V0TGlzdGVuZXJzLnB1c2goLi4ubGlzdGVuZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGFkZEluTGlzdGVuZXIgPSAoLi4ubGlzdGVuZXIpID0+IHtcclxuICBpbkxpc3RlbmVycy5wdXNoKC4uLmxpc3RlbmVyKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcclxuICByZXBsYWNlU29ja2V0KCk7XHJcbn07XHJcbiIsImltcG9ydCBoaWphY2tTb2NrZXQgZnJvbSBcIi4vaGlqYWNrU29ja2V0XCI7XHJcbmltcG9ydCBsaXN0ZW5CQkIgZnJvbSBcIi4vYmJiV3JhcHBlclwiO1xyXG5pbXBvcnQgYWRkRXZlbnRzIGZyb20gXCIuL2FkZEV2ZW50c1wiO1xyXG5cclxuaGlqYWNrU29ja2V0KCk7XHJcbmxpc3RlbkJCQigpO1xyXG5hZGRFdmVudHMoKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9ydW4uanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9