const writeProjectLib = require('./writeProject');
const readResultLib = require('./readResult');
const cleanupFiles = require('./cleanupFiles');

module.exports = {
  writeProject: writeProjectLib.writeProject,
  getProjectResultFiles: readResultLib.getProjectResultFiles,
  cleanupFiles: cleanupFiles.cleanupFiles,
}