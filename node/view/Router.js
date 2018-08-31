const express = require('express')
const web = express.Router()
const bparser = require('body-parser')
const cmd=require('node-cmd')
const SerialPort = require('serialport')
const datab = require('../utilidades/mysql')

const ReadLine = SerialPort.parsers.Readline

const port = new SerialPort("/dev/ttyACM0", { baudRate: 9600 })
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }))

web.use(bparser.urlencoded({extended: true}))

web.get('/', function (req, res) {

  cargarMacsTabla()
  res.send("test")
  
})

function cargarMacsTabla () {
  cmd.get("arp -an | awk '{print $4}'", function(err, data, stderr){
    
    let sMacsTabla = data.split("\n")
    let iEquipos = 0

    for (let i = 0; i < data.length;i++) {
      if ((sMacsTabla[i] != undefined) && (sMacsTabla[i].trim() != "")){
        envioArduino(sMacsTabla[i])
        iEquipos++
      } else {
        i = data.length
      }
    }
    port.write("#0#"+iEquipos.toString()+"\n")
  })
}

function envioArduino (sMacTemp) {
  let sMacLCD =""
  let sMacSplit = sMacTemp.split(":")

  for (let i = 0; i < sMacSplit.length;i++) {
    if (sMacSplit[i] != ":"){
      sMacLCD += sMacSplit[i].toUpperCase()
    }
  }
  port.write("#1#"+sMacLCD+"\n")
}

function agregarDB (sMac) {
  
}

function enviarCorreo () {
  
}

module.exports = web
