const MAX_FILE_SIZE = 1024*512;
const MAX_FILE_COUNT = 32;

function isValidProjectName(str){
  return typeof str==='string' &&
    str.length < 32 && 
    str.length > 3 &&
    (/^[a-z][a-z|0-9|_]+[a-z]$/.test(str));
}
function isValidIncludeFileName(str) {
  return typeof str==='string' &&
    str.length < 32 && 
    str.length > 3 &&
    /^[a-z][a-z|-|_]+\.hpp$/.test(str)
}
function isValidSrcFileName(str) {
  return typeof str==='string' &&
    str.length < 32 && 
    str.length > 3 &&
    /^[a-z][a-z|-|_]+\.cpp$/.test(str)
}
function isValidRicardianFileName(str) {
  return typeof str==='string' &&
    str.length < 32 && 
    str.length > 3 &&
    (/^[a-z][a-z|-|_]+\.contracts\.md$/.test(str)||/^[a-z][a-z|-|_]+\.clauses\.md$/.test(str))
}


function isValidFileContent(c){
  return typeof c==='string'&&c.length&&c.length<MAX_FILE_SIZE;
}

function isValidFile(f){
  if(!f || typeof f!=='object'||!isValidFileContent(f.content)){
    return false;
  }
  if(f.type==='include'){
    return isValidIncludeFileName(f.name);
  }else if(f.type==='src'){
    return isValidSrcFileName(f.name);
  }else if(f.type==='ricardian'){
    return isValidRicardianFileName(f.name);
  }else{
    return false;
  }
}

function validateProjectFiles(files){
  if(!Array.isArray(files)||files.length===0||files.length>MAX_FILE_COUNT){
    return false;
  }
  return files.filter((f)=>!isValidFile(f)).length === 0;
}

function validateProjectObject(pObj){
  if(!pObj||typeof pObj!=='object'||!isValidProjectName(pObj.name)){
    console.error("Invalid isValidProjectName");

    return false;
  }
  
  if(!validateProjectFiles(pObj.files)){
    console.error("Invalid validateProjectFiles");
    return false;
  }

  return true;
}

module.exports = {
  validateProjectObject: validateProjectObject,
}