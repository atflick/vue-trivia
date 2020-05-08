function heartbeat () {
  // const t = new Date()
  // const utc = t.getTime()
  postMessage()
}

setInterval(function () {
  heartbeat()
}, 200)
