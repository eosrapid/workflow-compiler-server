const { spawn } = require('child_process');
const childProcs = {};
var procCounter = 0;


function spawnProc(procName, options, onData) {
  return new Promise((resolve,reject)=>{
    options = options || {};
    const procId = (procCounter++)+"";
    const spOps = {};
    if(options.cwd) {
      spOps.cwd = options.cwd;
    }
    const args = options.args || [];
    const p = spawn(procName, args, spOps);
    childProcs[procId] = p;
    if(typeof onData==='function'){
      p.stdout.on('data', onData.bind(null, 0));
      p.stderr.on('data', onData.bind(null, 1));
    }
  
    p.on('close', (code) => {
      delete childProcs[procId];
      if(code===0){
        resolve(0);
      }else{
        reject("Process failed with error code "+code);
      }
    });
    if(options.timeout){
      setTimeout(((pid)=>{
        const prc = childProcs[pid];
        if(prc){
          prc.kill();
        }
      }).bind(null, procId), options.timeout);
    }
    
  })

}
function killAllChildProcs(){
  Object.keys(childProcs).forEach(k=>{
    if(childProcs[k]){
      childProcs[k].kill();
    }
  })
}

module.exports = {
  killAllChildProcs,
  spawnProc
}