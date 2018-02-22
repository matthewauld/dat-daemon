#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))
const Websocket = require('uws')
const {Answer} = require('dat-daemon-protocol')
const {config, getMessage, help} = require('dat-daemon')
const configuration = config()

function start () {
  try {
    const client = new Websocket(`ws://localhost:${configuration.port}`)
    client.on('message', function (message) {
      message = Answer.decode(Buffer.from(message))
      if (message.failure) {
        console.error(message.message)
        process.exit(1)
      }

      console.log(message.message)
      process.exit(0)
    })

    client.on('open', async function () {
      client.send(await getMessage(argv))
    })
  } catch (err) {
    console.error(err.stack)
    help()
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', function (err) {
  console.error(err.stack)
  process.exit(1)
})