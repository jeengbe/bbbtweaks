import { addOutListener, addInListener } from "./hijackSocket";

const settingsChangeListener = msg => {
  if (msg.method === "userChangedLocalSettings") {
    msg.params[0].application.chatAudioAlerts = true;
    msg.params[0].application.chatPushAlerts = true;
    msg.params[0].application.userJoinPushAlerts = true;
  }
};

export default () => {
  // addOutListener(msg => {
  //   console.log("OUT", msg);
  // });

  // addInListener(msg => {
  //   console.log("IN", msg);
  // });

  addInListener(msg => {
    if (msg.msg === "added" && msg.collection === "meetings") {
      msg.fields.welcomeProp.welcomeMsg = "";
    }
  });

  addOutListener(settingsChangeListener);
};
