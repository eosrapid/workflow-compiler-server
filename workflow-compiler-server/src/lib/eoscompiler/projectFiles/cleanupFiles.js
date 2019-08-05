const path = require('path');
const fs = require('fs-extra');

async function cleanupFiles(projectHomePath){
  await fs.remove(projectHomePath)
}
module.exports = {
  cleanupFiles: cleanupFiles
}