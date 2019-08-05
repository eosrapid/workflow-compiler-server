const fs = require('fs-extra');
const path = require('path');

async function writeFiles(fileList){
  if(!Array.isArray(fileList)||!fileList.length) {
    throw new Error("Invalid or Empty File List!");
  }
  const mkdirpCache = {};
  const length = fileList.length;
  for(let i=0;i<length;i++){
    if(!mkdirpCache.hasOwnProperty(fileList[i].folder)){
      await fs.mkdirp(fileList[i].folder)
      mkdirpCache[fileList[i].folder] = true;
    }
    await fs.writeFile(
      path.resolve(fileList[i].folder, fileList[i].name),
      fileList[i].content,
      'utf8'
    );
  }

}
module.exports = {writeFiles};