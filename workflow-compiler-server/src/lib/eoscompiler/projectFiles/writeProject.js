const crypto = require('crypto');
const path = require('path');
const fs = require('fs-extra');
const validator = require('../validator');
const writeFiles = require('./writeFiles').writeFiles;
const {EOS_OUTPUT_PATH} = require('../../../../config');

function randomProjectID(){
  return Math.round(Date.now()/(1000*60)).toString(36)+"_"+crypto.randomBytes(8).toString('hex');
}
/*

const p = {
  name: "mycontract",
  files: [
    {
      name: "test.hpp",
      type: "include",
      content: ""
    },
    {
      name: "mycontract.hpp",
      type: "include",
      content: ""
    },
    {
      name: "mycontract.cpp",
      type: "src",
      content: ""
    },
  ],
  schema_version: 1
}

*/
const FILE_TYPE_DIR = {
  "src": "src",
  "include": "include",
  "ricardian": "ricardian"
}
const CMAKELISTS_ROOT=`include(ExternalProject)
# if no cdt root is given use default path
if(EOSIO_CDT_ROOT STREQUAL "" OR NOT EOSIO_CDT_ROOT)
   find_package(eosio.cdt)
endif()

ExternalProject_Add(
   eos_contract_project
   SOURCE_DIR $\{CMAKE_SOURCE_DIR\}/src
   BINARY_DIR $\{CMAKE_BINARY_DIR\}/eos_contract
   CMAKE_ARGS -DCMAKE_TOOLCHAIN_FILE=$\{EOSIO_CDT_ROOT\}/lib/cmake/eosio.cdt/EosioWasmToolchain.cmake
   UPDATE_COMMAND ""
   PATCH_COMMAND ""
   TEST_COMMAND ""
   INSTALL_COMMAND ""
   BUILD_ALWAYS 1
)`
function getCMakeFiles(contractName, projectHomePath, files){
  const contractClassName = contractName;
  const srcFiles = [];
  var hasRicardian = false;
  files.forEach(f=>{
    if(f.type==="src"){
      srcFiles.push(f.name);
    }
    if(f.type==="ricardian"){
      hasRicardian = true;
    }
  })
  if(!srcFiles.length){
    throw new Error("Missing source files!");
  }
  return [
    {
      folder: projectHomePath,
      name: "CMakeLists.txt",
      content: `cmake_minimum_required(VERSION 3.10)
include(ExternalProject)
# if no cdt root is given use default path
if(EOSIO_CDT_ROOT STREQUAL "" OR NOT EOSIO_CDT_ROOT)
    find_package(eosio.cdt)
endif()

ExternalProject_Add(
    eosproject_project
    SOURCE_DIR $\{CMAKE_SOURCE_DIR\}/src
    BINARY_DIR $\{CMAKE_BINARY_DIR\}/eosprojectbin
    CMAKE_ARGS -DCMAKE_TOOLCHAIN_FILE=$\{EOSIO_CDT_ROOT\}/lib/cmake/eosio.cdt/EosioWasmToolchain.cmake
    UPDATE_COMMAND ""
    PATCH_COMMAND ""
    TEST_COMMAND ""
    INSTALL_COMMAND ""
    BUILD_ALWAYS 1
)`
    },
    {
      folder: path.resolve(projectHomePath, "src"),
      name: "CMakeLists.txt",
      content: `project(eosproject)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( ${contractClassName} ${contractClassName} ${srcFiles[0]} )
target_include_directories( ${contractClassName} PUBLIC $\{CMAKE_SOURCE_DIR\}/../include )`
  +(hasRicardian?`\ntarget_ricardian_directory( ${contractClassName} $\{CMAKE_SOURCE_DIR\}/../ricardian )`:"")

    }
  ]
  
}
async function writeProject(projectObject){
  if(!validator.validateProjectObject(projectObject)){
    throw Error("Invalid Project Object!");
  }
  const projectId = randomProjectID();

  const projectHomePath = path.resolve(EOS_OUTPUT_PATH, projectId);
  if(projectHomePath.indexOf(EOS_OUTPUT_PATH)!==0) {
    throw new Error("Invalid path!");
  }
  await fs.mkdirp(path.resolve(projectHomePath, "src"));
  await fs.mkdirp(path.resolve(projectHomePath, "ricardian"));
  await fs.mkdirp(path.resolve(projectHomePath, "include"));
  await fs.mkdirp(path.resolve(projectHomePath, "build"));
  
  const outFiles = projectObject.files.filter(f=>FILE_TYPE_DIR.hasOwnProperty(f.type));
  

  const outWriteFiles = outFiles.map(file=>{
    return {
      folder: path.resolve(projectHomePath, FILE_TYPE_DIR[file.type]),
      name: file.name,
      content: file.content
    }
  }).concat(getCMakeFiles(projectObject.name, projectHomePath, outFiles));
  await writeFiles(outWriteFiles);
  return {path: projectHomePath, id: projectId, name: projectObject.name};
}

module.exports = {
  writeProject: writeProject
}