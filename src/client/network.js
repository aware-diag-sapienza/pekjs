import { io } from 'socket.io-client'

/**
 * Connecto to the server using SocketIO.
 * @param {*} url Url of the server.
 * @returns The socket object.
 */
export async function connect (url) {
  const socket = new Promise((resolve, reject) => {
    const s = io(url)
    s.on('connect', () => {
      console.log(`[PekClient] Connected to PekServer at ${url}`)
      resolve(s)
    })
  })
  return socket
}

/**
 * Send an event to the server.
 * @param {*} socket Socket object.
 * @param {*} event Event name to send.
 * @param {*} payload Associated with the event.
 * @returns The response object.
 */
export async function send (socket, event, payload = null) {
  if (typeof payload !== 'string') {
    // If not, convert it to a string using JSON.stringify()
    payload = JSON.stringify(payload)
  }
  // console.log('Sending', event, payload)
  return new Promise((resolve, reject) => {
    socket.emit(event, payload, (response) => {
      resolve(response)
    })
  })
}
