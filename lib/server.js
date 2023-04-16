"use strict";
const axios = require("axios");
const fs = require("fs");

// exports serialize
exports.serialize = (conn, msg) => {
msg.isGroup = msg.key.remoteJid.endsWith('@g.us')
try{
const berak = Object.keys(msg.message)[0]
msg.type = berak
} catch {
msg.type = null
}
try{
const context = msg.message[msg.type].contextInfo.quotedMessage
if(context["ephemeralMessage"]){
msg.quotedMsg = context.ephemeralMessage.message
}else{
msg.quotedMsg = context
}
msg.isQuotedMsg = true
msg.quotedMsg.sender = msg.message[msg.type].contextInfo.participant
msg.quotedMsg.fromMe = msg.quotedMsg.sender === conn.user.id.split(':')[0]+'@s.whatsapp.net' ? true : false
msg.quotedMsg.type = Object.keys(msg.quotedMsg)[0]
let ane = msg.quotedMsg
msg.quotedMsg.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : (ane.type == 'buttonsMessage') && ane.buttonsMessage.contentText ? ane.buttonsMessage.contentText : ""
msg.quotedMsg.id = msg.message[msg.type].contextInfo.stanzaId
}catch{
msg.quotedMsg = null
msg.isQuotedMsg = false
}

try{
const mention = msg.message[msg.type].contextInfo.mentionedJid
msg.mentioned = mention
}catch{
msg.mentioned = []
}
    
if (msg.isGroup){
msg.sender = msg.participant
}else{
msg.sender = msg.key.remoteJid
}
if (msg.key.fromMe){
msg.sender = conn.user.id.split(':')[0]+'@s.whatsapp.net'
}

msg.from = msg.key.remoteJid
msg.now = msg.messageTimestamp
msg.fromMe = msg.key.fromMe

return msg
}

// exports getGroupAdmins
exports.getGroupAdmins = function(participants){
let admins = []
for (let i of participants) {
i.admin !== null ? admins.push(i.id) : ''
}
return admins
}