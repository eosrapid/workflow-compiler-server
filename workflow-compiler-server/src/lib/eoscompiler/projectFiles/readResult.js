const path = require('path');
const fs = require('fs-extra');
const OUTPUT_BINARY_FOLDER = "eosprojectbin";

async function getProjectResultFiles(projectHomePath, contractName){
  const wasmFilePath = path.resolve(projectHomePath, "build", OUTPUT_BINARY_FOLDER, contractName+".wasm");
  const abiFilePath = path.resolve(projectHomePath, "build", OUTPUT_BINARY_FOLDER, contractName+".abi");
  const wasmBuffer = await fs.readFile(wasmFilePath);
  const abiString = await fs.readFile(abiFilePath, 'utf8');
  return {
    wasm: wasmBuffer.toString('hex'),
    abi: abiString
  };
}
module.exports = {
  getProjectResultFiles: getProjectResultFiles
}