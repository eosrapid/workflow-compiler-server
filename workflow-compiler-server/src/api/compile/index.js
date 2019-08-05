const express = require('express');
const eosCompilerLib = require('../../lib/eoscompiler');
const APIError = require('../../lib/util/APIError');

const router = express.Router()
router.get('/ping', function(req, res) {
  res.send('pong')
})
router.post('/start_compile', (req, res)=>{
  if(!req.body||!req.body.project||typeof req.body.project!=='object'||!req.body.project.schema_version){
    return res.status(400).json({error: "Invalid project!"});
  }
  eosCompilerLib.compileProject(req.body.project)
  .then((result)=>{
    res.json(result);
  })
  .catch(err=>{
    if(err instanceof APIError){
      res.status(400).json({error: err+""})
    }else{
      console.error("ERROR: ", err);
      res.status(400).json({error: "ERROR!"})
    }
  })
})
module.exports = router