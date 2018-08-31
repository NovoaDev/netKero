var macModel = function () {
  this.alias  = []
  this.mac = [] 
  this.permitida = []
}

macModel.prototype.setAlias = function (sStats, iNumero) {
  this.alias[iNumero] = sStats
}

macModel.prototype.setMac = function (sStats, iNumero) {
  this.mac[iNumero] = sStats
}

macModel.prototype.setPermitida = function (sStats, iNumero) {
  this.permitida[iNumero] = sStats
}

module.exports = macModel