const projectFilesLib = require('./projectFiles')
const compileCMake = require('./compileCMake');
const APIError = require('../util/APIError');
const compileNormal = require('./compileNormal');

async function compileProject(projectObject){
  const writeProjectResult = await projectFilesLib.writeProject(projectObject);
  const projectPath = writeProjectResult.path;
  /*
  const cmakeResult = await compileCMake.runCMake(projectPath);
  if(!cmakeResult.success){
    throw new Error("Error running CMake!");
  }
  const makeResult = await compileCMake.runMake(projectPath);
  if(!makeResult.success){
    throw new APIError(makeResult.error+"");
  }*/
  const compResult = await compileNormal.runNormalCompile(projectPath, projectObject.name+".cpp", projectObject.name)
  if(!compResult.success){
    throw new APIError(compResult.error+"");
  }
  const files = await projectFilesLib.getProjectResultFiles(projectPath, projectObject.name);
  await projectFilesLib.cleanupFiles(projectPath);


  return files;
}

module.exports = {
  compileProject: compileProject,
}