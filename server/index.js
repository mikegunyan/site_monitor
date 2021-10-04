const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const mysql = require('mysql');
const { lookup } = require('geoip-lite');

const resumeConnection = {
  host: process.env.HOST || '54.241.75.143',
  user: 'root',
  password: process.env.PASSWORD || 'crudroot',
  database: 'crud'
};

let resume;

const establishConnection = () => {
  const date = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });

  resume = mysql.createConnection(resumeConnection);

  resume.connect(err => {
    if (err) {
      console.log(`${date} ➡ MySQL ERROR! Re-establishing connection... ↙\n${err}`);
      setTimeout(establishConnection, 2000);
    } else {
      console.log(`${date} ➡ MySQL Database connected...`)
    }
  });

  resume.on('error',(err) => {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log(`${date} ➡ MySQL ERROR! Re-establishing connection... ↙\n${err}`);
      establishConnection();
    } else {
      console.log(`${date} ➡ MySQL ERROR! Unable to connect...`)
    }
  });
}

let server = app.listen(port, () => {
  const date = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
  establishConnection();
  console.log(`${date} ➡ Server started! Listening on port:${port}...`)
});

const resetServer = (signal) => {
  const date = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
  console.log(`--------------\n${date} ➡ ${signal} signal received! Closing server...`)
  server.close(()=>{
    console.log(`${date} ➡ Server closed! Restarting server...`);
    server = app.listen(port, () => {
      establishConnection();
      console.log(`${date} ➡ Server restarted! Listening on port:${port}...`)
    });
  });
}

const closeProcess = (signal) => {
  const date = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
  console.log(`--------------\n${date} ➡ ${signal} signal received: Process Terminating...`)
  server.close(()=>{
    console.log(`${date} ➡ Server closed!`);
    resume.end();
    console.log(`${date} ➡ MySQL closed!`);
    console.log(`${date} ➡ Process Terminated!`);
    process.exit(0)
  });
}

process.on('SIGINT', resetServer)
process.on('SIGTERM', closeProcess)

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/visitors/resume', (req, res) => {
  const date = new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Denver', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
  resume.query('SELECT visitor FROM visitors', (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      let newVisitors = [];
      for (let i = 0; i < results.length; i++) {
        let newIP = results[i].visitor.replace('::ffff:', '');
        let newVisitor = lookup(newIP);
        if (newVisitor) {
          newVisitor.ip = newIP;
        } else {
          newVisitor = {
            country: '',
            region: '',
            timezone: '',
            city: '',
            ll: [ null, null ],
            ip: results[i].visitor.replace('::ffff:', '')
          }
        }
        newVisitors.push(newVisitor);
      }
      res.send(newVisitors);
    }
  });
})