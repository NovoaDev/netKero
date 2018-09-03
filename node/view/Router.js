const express = require('express')
const web = express.Router()
const bparser = require('body-parser')
const cmd=require('node-cmd')
const SerialPort = require('serialport')
const datab = require('../utilidades/mysql')
const mailer = require('./utilidades/mailer')
const model = require('../modelos/macModel')

const ReadLine = SerialPort.parsers.Readline

const port = new SerialPort("/dev/ttyACM0", { baudRate: 9600 })
const parser = port.pipe(new ReadLine({ delimiter: '\r\n' }))

let bEsperandoRespuesta = false
let bRespondida = false

// datos de modelo por defecto en blanco
model.alias = ""
model.mac = ""
model.permitida = ""   
//

web.use(bparser.urlencoded({extended: true}))

//--------------------------------------------- Escuchar Arduino
parser.on('open', function () {
    console.log('connection is opened')
})

parser.on('data', function (data) {
    readArduino(data.toString())
})
//--------------------------------------------------------------

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
        datab.selectMac(sMacsTabla[i], function (oMac) {
          if (oMac == "vacio") {
            model.mac = sMacsTabla[i]
            preguntarArduino(sMacsTabla[i])
          } else {
            if (oMac.permitida == "S") {
              iEquipos++
            } else {
              //sacar intruso
            }
          }   
        })
      } else {
        i = data.length
      }
    }
    port.write("#0#"+iEquipos.toString()+"\n")
  })
}

function preguntarArduino (sMacTemp) {
  let sMacLCD =""
  let sMacSplit = sMacTemp.split(":")

  for (let i = 0; i < sMacSplit.length;i++) {
    if (sMacSplit[i] != ":"){
      sMacLCD += sMacSplit[i].toUpperCase()
    }
  }
  port.write("#1#"+sMacLCD+"\n")
  esperarRespuesta()
}

function esperarRespuesta () {
  let bIterar = true
  bEsperandoRespuesta = true

  while(bIterar){
    if (bRespondida) {
      bIterar = false
      bRespondida = false
      bEsperandoRespuesta = false
    }
  }
}

function readArduino (sDatosArduino) {
  if (bEsperandoRespuesta) {
    let sDatos = sDatosArduino
    let sDatosPrefijo = sDatos.substring(0, 4)
    let iLargoDatos = sDatos.length
    let sDatosFinal = sDatos.substring(4, iLargoDatos)
    let sRetornoFunciones

    if (sDatosPrefijo == "#01#") { 
      model.permitida = "S" 
      bRespondida = true
      agregarDB()
    }
    if (sDatosPrefijo == "#02#") { 
      model.permitida = "N" 
      bRespondida = true
      agregarDB()
    }        
  }
}  

function agregarDB () {
  crearMac(model.alias, model.mac, model.permitida)
}

function enviarCorreo () {
  
}

module.exports = web
