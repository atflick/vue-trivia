function heartbeat () {
  const t = new Date()
  const utc = t.getTime()
  postMessage(utc)
}

setInterval(function () {
  heartbeat()
}, 200)
