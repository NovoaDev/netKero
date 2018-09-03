const nodemailer = require("nodemailer")
const datab = require('../utilidades/mysql')
 
function sendMail (iTipo, sMac) {

  datab.selectMail(function (oEmail) {

    if ((oEmail != "vacia") && (oEmail != "error")) {
      let serviceCFG = oEmail.service
      let userCFG = oEmail.usuario
      let passCFG = oEmail.pass

      let sFrom = oEmail.fromMail
      let sTo = oEmail.toMail
      let sSubject 
      let sText

      let transporter = nodemailer.createTransport({
          service: serviceCFG,
          auth: {
              user: userCFG,
              pass: passCFG
          }
      })

      switch (iTipo) {
          case "1":
              sSubject = "netKero! - Lista blanca"
              sText = "Se agrega "+sMac+ " a permitidos"
              break
          case "2":
              sSubject = "netKero! - Lista negra"
              sText = "Se agrega "+sMac+ " a denegados"
              break
          case "99":
              sSubject = "netKero! - Se ha iniciado netKero"
              sText = "Se ha iniciado netKero"
              break+
      }

      let mailOptions = {
          from: sFrom, to: sTo,
          subject: sSubject,
          text: sText,
      }
   
      transporter.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error)
          }
          console.log("Mensaje enviado: " + info.response)
      })
    }
  })
}

module.exports = sendMail