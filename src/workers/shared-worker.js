let connections = []
console.log('barroo')
onconnect = (e) => {
  const port = e.ports[0]
  connections.push(port)
  port.onmessage = (e) => {
    const { type, payload } = e.data
    switch (type) {
      case 'TOS_ACCEPTED':
        connections.forEach((p) => {
          if (p !== port) {
            p.postMessage({ type, payload })
          }
        })
        break
      default:
        console.error(`Unknown message type in shared worker: ${type}`)
    }
  }

  port.start()
}
