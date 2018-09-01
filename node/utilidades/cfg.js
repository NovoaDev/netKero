let config = {
  key: {
    sqlServer: process.env.NETKERO_SERVER_SQL,
    sqlUser: process.env.NETKERO_USER_SQL,
    sqlPassword: process.env.NETKERO_PASS_SQL,
    sqlDatabase: process.env.NETKERO_DB_SQL,
    keyVal1: process.env.NETKERO_DB_VAL1,
    keyVal2: process.env.NETKERO_DB_VAL2,
    keyVal3: process.env.NETKERO_DB_VAL13
  }
}

module.exports = config