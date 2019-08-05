const crypto = require('crypto');
function randomServerProtectionKey(){
  return crypto.randomBytes(8).toString('hex');
}
function getUIntString(value, defaultValue){
  if(typeof value!=='string'&&typeof value!=='number'){
    return defaultValue;
  }
  const x = parseInt(value, 10);
  return (isNaN(x)||x<0)?defaultValue:value;
}

const CONFIG={
  PORT: getUIntString(process.env.PORT, 3000),
  /*
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: getUIntString(process.env.REDIS_PORT, 3000),
  REDIS_QUEUE_DB: getUIntString(process.env.REDIS_QUEUE_DB, 0),
  REDIS_DATA_DB: getUIntString(process.env.REDIS_DATA_DB, 1),
  */
  EOS_OUTPUT_PATH: process.env.EOS_OUTPUT_PATH || "/tmp/eosworkflow",
  SERVER_PASS_CODE: process.env.SERVER_PASS_CODE || randomServerProtectionKey(),
  LOG_SERVER_PASS_CODE: (process.env.LOG_SERVER_PASS_CODE||"true")==="true",
}

module.exports = CONFIG;