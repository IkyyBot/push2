"use strict";
const fs = require("fs");
const ms = require("ms");
const chalk = require('chalk');
const axios = require("axios");
const qs = require("querystring");
const moment = require("moment-timezone");
const { BufferJSON, WA_DEFAULT_EPHEMERAL, proto, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys');
const { downloadContentFromMessage, generateWAMessage, generateWAMessageFromContent, MessageType, buttonsMessage } = require("@adiwajshing/baileys");
const { exec, spawn } = require("child_process");
const { color } = require('./lib/console');
const { getGroupAdmins, sleep } = require("./lib/server");

const setting = JSON.parse(fs.readFileSync('./config.json'))

module.exports = async(conn, msg, setting) => {
try {
const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
if (chats == undefined) { chats = '' }
const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.ownerNumber}`, setting.ownerNumber + "@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'

const quoted = msg.quoted ? msg.quoted : msg
const reply = (teks) => {conn.sendMessage(from, { text: teks }, { quoted: msg })}

const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const participants = isGroup ? await groupMetadata.participants : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)

// waktu Indonesia 
var wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
var wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
var wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')

// console 
if (command) {
console.log(chalk.red(`~`) + `> [ \x1b[1;32mCMD\x1b[1;37m ]`, chalk.white(`${wib} WIB`), chalk.green(`${command}`), chalk.white('from'), chalk.green(`${pushname} => ${sender.split("@")[0]}`),chalk.white('in'), chalk.green(isGroup ? 'Group Chat' : 'Private Chat'))
}

const sleep = async (ms) => {
return new Promise(resolve => setTimeout(resolve, ms));
}

function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = conn.sendMessage(from, { 
text: teks, 
mentions: mems 
})
return res
} else {
let res = conn.sendMessage(from, { 
text: teks, 
mentions: mems 
}, { 
quoted: msg 
})
return res
}
}

switch(command) {

case 'push': case 'pushkontak': 
if (!isOwner) return 
if (!isGroup) return reply("Gunakan Di Group")
if (!q) return reply("Masukkan Teks Nya")
let meki = groupMetadata.participants
for(let i of meki){
conn.sendMessage(i.id, { text: q })
}
reply(`Success Send Message To ${("id", meki).length} Number`)
break
case 'menu':
let teks = `SCRIPT PUSH KONTAK IKYYSTORE 
 
cara pakai :
 
ketik *.pushkontak sv namamu svb?sebut nama* di grup`
reply(teks)
break

default:

}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
}}
