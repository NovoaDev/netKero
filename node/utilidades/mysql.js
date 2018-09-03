const mysql = require('mysql')
const cfg = require('./cfg')
const crypto = require('./crypto')

const macModel = require('../modelos/macModel')
const emailModel = require('../modelos/emailModel')

let usuario = cfg.key.sqlUser
let pass = cfg.key.sqlPassword
let servidor = cfg.key.sqlServer
let dab = cfg.key.sqlDatabase

let oMac = new macModel()

// CONFIGURACION -------------------------------------------------------------------------------------
let connection = mysql.createConnection({
  host: servidor,
  user: usuario,
  password: pass,
  database: dab
})
// FIN CONFIGURACION ---------------------------------------------------------------------------------

let db = {}

// CREAR / ELIMINAR TABLAS ---------------------------------------------------------------------------
db.crearTabla = function crearTabla (sTabla) {

  if (sTabla == "usuarios") {
    connection.query('CREATE TABLE IF NOT EXISTS usuarios (id INT AUTO_INCREMENT PRIMARY KEY, usuario varchar(20) UNIQUE, password varchar(80))')
    console.log('Tabla de mysql(usuarios) Creada!')
  }
  if (sTabla == "mac") {
    connection.query('CREATE TABLE IF NOT EXISTS mac (id INT AUTO_INCREMENT PRIMARY KEY, alias varchar(40), mac varchar(40), permitida varchar(1))') 
    console.log('Tabla de mysql(mac) Creada!')
  }
  if (sTabla == "mail") {
    connection.query('CREATE TABLE IF NOT EXISTS mail (id INT AUTO_INCREMENT PRIMARY KEY, service varchar(40), usuario varchar(40), pass varchar(40), fromMail varchar(40), toMail varchar(120))')  
    console.log('Tabla de mysql(mail) Creada!')
  }
}

db.eliminarTabla = function eliminarTabla (sTabla) {

  if (sTabla == "usuarios") {
    connection.query('DROP TABLE usuarios')
    console.log('Tabla de mysql(usuarios) Borrada!')
  }
  if (sTabla == "mac") {
    connection.query('DROP TABLE mac')
    console.log('Tabla de mysql(mac) Borrada!')
  }
  if (sTabla == "mail") {
    connection.query('DROP TABLE mail')
    console.log('Tabla de mysql(mail) Borrada!')
  }
}
// FIN CREAR / ELIMINAR TABLAS -----------------------------------------------------------------------

// CREAR / ELIMINAR / VALIDAR / ACTUALIZAR USUARIO ----------------------------------------------------------------
db.crearUsuario = function crearUsuario (sUsu, sPass) {
  
  let passcrypt = crypto(sPass)
  database = { usuario: sUsu, password: passcrypt }

  connection.query('INSERT INTO usuarios SET ?', database, function (err, res) {
    if (err) {
      throw err
    } else {
      console.log('usuarios last insert id:' + res.insertId)
      console.log('--------------------')  
    }
  })
}

db.eliminarUsu = function eliminarUsu (sUsu) {
  
  let usuario = sUsu

  connection.query("SELECT * FROM usuarios WHERE usuario = '" + usuario +"'",
  function (err, rows) {
    let resultado = rows
    if (err) {
      console.log('error sql')
      throw err
    }else {
      if (resultado.length > 0) {
        connection.query("DELETE FROM usuarios WHERE usuario = '" + usuario +"'",
        function (err, rows) {
          let resultado = rows
          if (err) {
            console.log('error sql')
            throw err
          }else {
          console.log('Se elimina el usuario: ' + usuario + '...')
          }
        })
      }else {
      console.log('usuario ' + usuario + ' no encontrado...')
      }
    }
  })
}

db.validarUsu = function validarUsu (sUsu, sPass, callback) {
  
  let passcrypt = crypto(sPass)
  let usuario = sUsu

  connection.query("SELECT * FROM usuarios WHERE usuario = '" + usuario +"' && password = '" + passcrypt + "'",
  function (err, rows) {
    let resultado = rows
    if (err) {
      console.log('error sql')
      throw err
      callback(false)
    }else {
      if (resultado.length > 0) {
        console.log('Logeado el usuario: ' + resultado[0].usuario + '...')
        callback(true)
      }else {
        console.log('FALLO de log usuario: ' + sUsu + '...')
        callback(false) 
      }
    }
  })
}

db.updateUsuario = function updateUsuario (sUsu, sPass) {
  console.log(sUsu)
  console.log(sPass)
  let passcrypt = crypto(sPass)

  connection.query("UPDATE usuarios SET usuario= '"+sUsu+"', password= '"+passcrypt+"' WHERE id LIKE 1",
  function (err, res) {
    if (err) {
      console.log('error sql')
      throw err
    }else {
      console.log('Configuracion de usuario actualizada')
    }
  })
}
// FIN CREAR / ELIMINAR / VALIDAR / ACTUALIZAR USUARIO ------------------------------------------------------------

// CREAR / ELIMINAR / ACTUALIZAR / SELECT MAC ----------------------------------------------------------------
db.crearMac = function crearMac (sAlias, sMac, sPermitida) {
  
  database = { alias: sAlias, mac: sMac, permitida: sPermitida }

  connection.query('INSERT INTO mac SET ?', database, function (err, res) {
    if (err) {
      throw err
    } else {
      console.log('mac last insert id:' + res.insertId)
      console.log('--------------------')  
    }
  })
}

db.eliminarMac = function eliminarMac (sMac) {
  
  let mac = sMac

  connection.query("SELECT * FROM mac WHERE mac = '" + mac +"'",
  function (err, rows) {
    let resultado = rows
    if (err) {
      console.log('error sql')
      throw err
    }else {
      if (resultado.length > 0) {
        connection.query("DELETE FROM mac WHERE mac = '" + mac +"'",
        function (err, rows) {
          let resultado = rows
          if (err) {
            console.log('error sql')
            throw err
          }else {
          console.log('Se elimina la mac : ' + mac + '...')
          }
        })
      }else {
      console.log('Mac ' + mac + ' no encontrada...')
      }
    }
  })
}

/*db.updateMac = function updateMac (sAlias, sMac, sPermitida, sMacAntigua) {

  connection.query("UPDATE mac SET alias= '"+sAlias+"', mac= '"+sMac+"', permitida= '"+sPermitida+"' WHERE mac = '" +sMacAntigua+"'"
  function (err, res) {
    if (err) {
      console.log('error sql')
      throw err
    }else {
      console.log('Configuracion de usuario actualizada')
    }
  })
}
*/

db.selectMac = function selectMac (sMac, callback) {
  if ((sMac != "") && (sMac != undefined)) {
    connection.query("SELECT * FROM mac WHERE mac = '" + sMac +"'",
    function (err, rows) {
      let resultado = rows
      if (err) {
        console.log('error sql')
        callback("error")
        throw err
      } else {
        if (resultado.length > 0) {

          oMac.setAlias(resultado[0].alias, 0)
          oMac.setMac(resultado[0].mac, 0)
          oMac.setPermitida(resultado[0].permitida, 0)

          callback(oMac)
          console.log('Tabla mac ' + resultado[0].mac + ' CARGADA')
        } else {
          callback("vacio")
          console.log('tabla mac vacia...')
        }
      }
    })
  } else {
    connection.query("SELECT * FROM mac",
    function (err, rows) {
      let resultado = rows
      if (err) {
        console.log('error sql')
        callback("error")
        throw err
      } else {
        if (resultado.length > 0) {
          let iIte, iIteFinal

          iIteFinal = resultado.length
          for (iIte = 0; iIte < iIteFinal; iIte++) {
            oMac.setAlias(resultado[iIte].alias, iIte)
            oMac.setMac(resultado[iIte].mac, iIte)
            oMac.setPermitida(resultado[iIte].permitida, iIte)
          }

          callback(tPlantaTot)
          console.log('Tabla mac CARGADA ' + iIteFinal + ' registros...')
        } else {
          callback("vacia")
          console.log('tabla mac vacia...')
        }
      }
    })
  }
}

// FIN CREAR / ELIMINAR / ACTUALIZAR / SELECT MAC ------------------------------------------------------------

// CREAR / ELIMINAR / SELECT / ACTUALIZAR MAIL --------------------------------------------------------------------
db.crearCFGMail = function crearCFGMail (sService, sUsuario, sPass, sFromMail, sToMail) {
  
  database = { service: sService, usuario: sUsuario, pass: sPass, fromMail: sFromMail, toMail: sToMail }

  connection.query('INSERT INTO mail SET ?', database, function (err, res) {
    if (err) {
      throw err
    } else {
      console.log('mail last insert id:' + res.insertId)
      console.log('--------------------')  
    }
  })
}

db.eliminarCFGMail = function eliminarCFGMail () {

  connection.query("DELETE FROM mail",
  function (err, res) {
    if (err) {
      console.log('error sql')
      throw err
    } else {
    console.log('Se elimina el cfg de correo: ' + usuario + '...')
    }
  })
}

db.selectMail = function selectMail (callback) {

  connection.query("SELECT * FROM mail",
  function (err, rows) {
    let resultado = rows
    if (err) {
      console.log('error sql')
      callback("error")
      throw err
    } else {
      if (resultado.length > 0) {
        mail.setService(resultado[0].service)     
        mail.setUsuario(resultado[0].usuario)
        mail.setPass(resultado[0].pass)
        mail.setFromMail(resultado[0].fromMail)
        mail.setToMail(resultado[0].toMail)

        callback(mail)
        console.log('CFG MAIL CARGADA ' + resultado[0].usuario + '...')
      } else {
        callback("vacia")
        console.log('tabla vacia mail...') 
      }
    }
  })
}

db.updateMail = function updateMail (sService, sUsuario, sNuevaPass, sNuevaFromMail, sNuevaToMail) {

  connection.query("UPDATE mail SET service= '"+sService+"', usuario= '"+sUsuario+"', pass= '"+sNuevaPass+"', fromMail= '"+sNuevaFromMail+"', toMail= '"+sNuevaToMail+"' WHERE id LIKE 1",
  function (err, res) {
    if (err) {
      console.log('error sql')
      throw err
    } else {
      console.log('Configuracion de correo actualizada')
    }
  })
}
// FIN CREAR / ELIMINAR / SELECT / ACTUALIZAR MAIL ----------------------------------------------------------------


module.exports = db
