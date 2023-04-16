"use strict";
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState, makeInMemoryStore, downloadContentFromMessage, jidDecode, generateForwardMessageContent, generateWAMessageFromContent } = require("@adiwajshing/baileys")
const fs = require("fs");
const chalk = require('chalk')
const logg = require('pino')
const clui = require('clui')
const { Spinner } = clui
const { serialize } = require("./lib/server");
const Memory_Store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(session)

const status_Connection = async (conn, update, connectToWhatsApp) => {
console.log('Connection update:', update)
if (update.connection === 'close')
connectToWhatsApp()
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const connectToWhatsApp = async () => {
const conn = makeWASocket({
printQRInTerminal: true,
logger: logg({ level: 'fatal' }),
browser: ['Arul','Safari','1.0.0'],
auth: state
})
Memory_Store.bind(conn.ev)

conn.ev.on('messages.upsert', async m => {
var msg = m.messages[0]
if (!m.messages) return;
if (msg.key && msg.key.remoteJid == "status@broadcast") return
msg = serialize(conn, msg)
msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
require('./command')(conn, msg, setting, Memory_Store)
})

function uncache(module = '.') {
return new Promise((resolve, reject) => {
try {
delete require.cache[require.resolve(module)]
resolve()
} catch (e) {
reject(e)
}
})
}

function nocache(module, cb = () => { }) {
fs.watchFile(require.resolve(module), async () => {
await uncache(require.resolve(module))
cb(module)
})
}

conn.ev.on('creds.update', () => saveState)

conn.ev.on('connection.update', (update) => {
status_Connection(conn, update, connectToWhatsApp)
})

return conn
}
connectToWhatsApp()
.catch(err => console.log(err))
