const fs = require('fs-extra');
const path = require('path');
const processManager = require('../processManager');

async function runCMake(projectHomePath){
  const buildFolderPath = path.resolve(projectHomePath, "build");
  await fs.mkdirp(buildFolderPath);

  try {
    const result = await processManager.spawnProc("cmake",{args: [".."], cwd:buildFolderPath});//(dType,msg)=>console.log(`T[${dType}]: ${msg}`)
  }catch(e){
    return {success: false, error: ""};
  }
  return {success: true};
}
async function runMake(projectHomePath) {
  const buildFolderPath = path.resolve(projectHomePath, "build");
  const stdError=[];
  try {
    const result = await processManager.spawnProc("make",{cwd:buildFolderPath},(dType,msg)=>{
      if(dType===1){
        stdError.push(msg);
      }
    });//(dType,msg)=>console.log(`T[${dType}]: ${msg}`)
  }catch(e){
    return {success: false, error: stdError.join("\n")};
  }
  return {success: true};
}
module.exports = {
  runCMake: runCMake,
  runMake: runMake
}