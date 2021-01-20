const _WebSocket = window.WebSocket;

const replaceSocket = () => {
  const WebSocket = function (url: string, protocols?: string | string[]): WebSocket {
    console.log("Open connection: ", url)
    const socket = new _WebSocket(url, protocols);
    const socketSend = socket.send.bind(socket);
    socket.send = msg => {
      console.log("Send: ", msg);
      return socketSend(msg);
    }
    return socket;
  };

  WebSocket.prototype = _WebSocket.prototype;
  WebSocket.CLOSED = _WebSocket.CLOSED;
  WebSocket.CLOSING = _WebSocket.CLOSING;
  WebSocket.CONNECTING = _WebSocket.CONNECTING;
  WebSocket.OPEN = _WebSocket.OPEN;

  // @ts-ignore
  window.WebSocket = WebSocket;
}

export default () => {
  replaceSocket();
};
