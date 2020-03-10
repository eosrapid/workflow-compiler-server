const fs = require('fs-extra');
const path = require('path');
const processManager = require('../processManager');

async function runNormalCompile(projectHomePath, srcMainCppName, contractName){
  const buildDir = path.resolve(projectHomePath, "build");
  const includeDir = path.resolve(projectHomePath, "include");
  const srcDir = path.resolve(projectHomePath, "src");
  const ricardianDir = path.resolve(projectHomePath, "ricardian");
  const srcMainCppFullPath = path.resolve(srcDir, srcMainCppName);

  const stdError=[];
  
  await fs.mkdirp(buildDir);

  try {
    const result = await processManager.spawnProc("eosio-cpp",{args: ["-abigen", srcMainCppFullPath, "-o", contractName+".wasm", "-I", includeDir, "-R", ricardianDir], cwd:buildDir},(dType,msg)=>{
      console.log(msg.toString('utf8'));
      if(dType===1){
        stdError.push(msg);
      }
    });
  }catch(e){
    return {success: false, error: stdError.join("\n")};
  }
  return {success: true};
}

module.exports = {
  runNormalCompile: runNormalCompile,
}