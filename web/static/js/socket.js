import {Socket} from "phoenix"

export function startConnection(store) {
  let socket = new Socket("/socket")

  socket.connect()
  let channel = socket.channel("events", {})

  channel.on("new_event", payload => {
    console.log(payload);
    store.dispatch({type: 'NEW_EVENT', event: payload})
  })

  channel.join()
    .receive("ok", resp => {
      store.dispatch({type: 'JOINED_CHANNEL', channel: channel})
    })
    .receive("error", resp => {
      console.log("Unable to join", resp)
    })
}
