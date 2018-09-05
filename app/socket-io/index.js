import io from "socket.io-client";
import store from "../store";
import { API_BASE_URL } from "../api";

// import emits from "./emits";

export default {
  socket: null,

  connect() {
    console.log("trying to connect socket!!");
    this.socket = io(
      API_BASE_URL + "?token=" + store.getState().loggedInUser.authToken
      // {
      //   query: "token=" + store.getState().loggedInUser.authToken,
      //   reconnection: true,
      //   reconnectionDelay: 1000,
      //   reconnectionDelayMax: 5000,
      //   reconnectionAttempts: Infinity,
      //   transports: ["websocket"]
      // }
    );

    // this.socket.connect();

    this.socket.on("connect", function() {
      console.log("socket connected!!");
    });

    this.socket.on("connect_error", function(err) {
      console.log("socket could not be connected!!", err);
    });

    this.socket.on("disconnect", function() {
      console.log("socket disconnect event");
      // store.dispatch('changeServerConnectionStatus', false)
    });
  },

  disconnect() {
    this.socket.disconnect();
  },

  reconnect() {
    let $this = this;

    if (this.socket) {
      this.socket.disconnect(() => {
        $this.connect();
      });
    } else {
      this.connect();
    }
  },

  emit(eventName, payload) {
    let $this = this;
    return new Promise((resolve, reject) => {
      $this.socket.emit(
        "event",
        { route: eventName, payload: payload },
        function(response) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.data);
          }
        }
      );
    });
  },

  // emits: emits,

  //events triggered by server
  events: {
    MESSAGES_UNREAD_MESSAGES_COUNTS: "messages/unread_messages_countS",
    MESSAGES_THREAD_NEW_MESSAGE: "messages/thread/new_message",
    MESSAGES_THREAD_UPDATE_MESSAGES_READ_TIME:
      "messages/thread/update_messages_read_time"
  }
};
