require('dotenv').config()
const express = require('express');
const chalk = require('chalk');

const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const {PORT, LOG_SERVER_PASS_CODE, SERVER_PASS_CODE} = require('./config');
const apiRouter = require('./src/api');
const processManager = require('./src/lib/processManager');


const corsWhitelist = [
  'http://localhost:'+PORT,
  'http://127.0.0.1:'+PORT,
  'http://localhost:'+3000,
  'http://127.0.0.1:'+3000,
  'http://localhost:'+8000,
  'http://127.0.0.1:'+8000,
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || corsWhitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
};

const app = express()
app.use(compression())

app.use(cors(corsOptions))

function serverPassCode(req, res, next){
  if(req.get('x-wf-server-passcode')===SERVER_PASS_CODE){
    next();
  }else{
    res.status(401).send('');
  }
}


// use body-parser middleware
app.use(bodyParser.json())
app.use('/s', express.static(path.join(__dirname, 'public')))
app.get('/', (req,res)=>res.redirect('/s'));

if(typeof SERVER_PASS_CODE === 'string' && SERVER_PASS_CODE.length && SERVER_PASS_CODE!=='disabled'){
  app.use(serverPassCode)
}
app.use('/api/v1', apiRouter);
process.on('exit', function() {
  processManager.killAllChildProcs();
});
const MESSAGE_NO_PASS = 
`                                                                              
            88888888ba,         db         88888888ba   88888888ba            
            88      \`"8b       d88b        88      "8b  88      "8b    ,d     
            88        \`8b     d8'\`8b       88      ,8P  88      ,8P    88     
,adPPYYba,  88         88    d8'  \`8b      88aaaaaa8P'  88aaaaaa8P'  MM88MMM  
""     \`Y8  88         88   d8YaaaaY8b     88""""""'    88""""""'      88     
,adPPPPP88  88         8P  d8""""""""8b    88           88             88     
88,    ,88  88      .a8P  d8'        \`8b   88           88             88,    
\`"8bbdP"Y8  88888888Y"'  d8'          \`8b  88           88             "Y888
         aDAPPt EOS IDE v1.4.0  | Made with love by EOSRapidPROD

         To get started open http://localhost:${PORT}/ in your browser

`
app.listen(PORT, () =>{

  if(LOG_SERVER_PASS_CODE){
    console.log(chalk.red(MESSAGE_NO_PASS+"When prompted, please enter the server passcode: ",SERVER_PASS_CODE));
  }else{
    console.log(chalk.red(MESSAGE_NO_PASS));
  }
})
