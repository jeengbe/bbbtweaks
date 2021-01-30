import { addOutListener, addInListener } from "./hijackSocket";

let authPacketID;

export let bbbSocket;
let userID;

export const sendMessage = (...packets) => {
  packets.forEach(packet => (packet.id ||= "-1"));
  bbbSocket.send(JSON.stringify([packets.map(packet => JSON.stringify(packet))]));
};

export default () => {
  addOutListener(msg => {
    if (msg.msg === "method" && msg.method === "validateAuthToken") {
      authPacketID = msg.id;
    }
  });

  addInListener((msg, socket) => {
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
    _send: sendMessage.bind(this),

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
};
