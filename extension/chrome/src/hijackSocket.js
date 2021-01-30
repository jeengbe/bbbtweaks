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

export const addOutListener = (...listener) => {
  outListeners.push(...listener);
};

export const addInListener = (...listener) => {
  inListeners.push(...listener);
};

export default () => {
  replaceSocket();
};
