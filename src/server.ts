/* eslint-disable prefer-const */
import express from 'express';
import cors from 'cors';
import path from 'path';

const settings = require('./settings.json');
const uuidv1 = require('uuid/v1');
const favicon = require('serve-favicon');
const url = require('url');
const jwt = require('jwt-simple');

import expressWs from 'express-ws';

const {app} = expressWs(express());

// is a counter for users in one group. See settings for change max count of its
let _counter = 1;

// is a count of opened connections for activity
let connects: WebSocket[] = [];

// id of document. You will see average count of logs on activity page
let specialLogData = '';
settings.key = uuidv1().substr(0, 8);
settings.plugin = JSON.stringify(settings.plugin);

if (!settings.plugin) {
  settings.plugin = JSON.stringify({
    autostart: [
      'asc.{9616f139-6386-4e50-83bb-3dad84938cdd}',
    ],
    pluginsData: [
      settings.hostUrl +':' + settings.hostPort +
       '/public/plugins/background_for_cells/config.json',
    ],
  });
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json({limit: '10mb'}));
app.use('/public', express.static(path.join(__dirname, 'public')));

// for easy getting plugin from test example
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.get('/', (req, res) => {
  res.render('index', settings);
});

app.get('/background_for_cells', (req, res) => {
  updateKey();
  settings.documentname = 'Spreadsheet.xlsx';
  res.render('background_for_cells', settings);
});

app.get('/open', (req, res) => {
  settings.key = req.query.key.toString();
  res.render('open', settings);
});

// default response without file saving. See https://api.onlyoffice.com/editors/callback
app.post('/callback', (req, res) => {
  res.json({error: 0});
});

app.post('/jwt_generate', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (settings.jwt_key) {
    req.body.token = jwt.encode({payload: req.body}, settings.jwt_key);
  }
  res.json({config: req.body});
});

app.post('/activity', (req, res) => {
  console.log(req.body);
  res.json({error: 0});
});

app.get('/activity', (req, res) => {
  res.render('activity', {connectsCount: connects.length, documentServer: settings.documentServer});
});

let cachedData: string[] = [];
// don't know how to set "ws" and req types instead of any
app.ws('/activity', (ws: any, req: any) => {
  try {
    specialLog(url.parse(req.url, true).query, ws);
    connects.push(ws);
    ws.on('close', () => {
      connects = connects.filter((conn) => {
        return (conn !== ws);
      });
    });
  } catch (e) {
    console.log(e);
  }
});

/**
 * metot need for loging every change in special session.
 * @param {any} param The first number.
 * @param {any} ws is a web socket.
 */
function specialLog(param: any, ws: any) {
  if (param) {
    if (param.key) {
      specialLogData = param.key;
      console.log('param: ');
      console.log(param.key);
    }
  }
}

app.ws('/message', (ws: any) => {
  try {
    ws.on('message', (msg: string) => {
      cachedData.push(msg);
      if (specialLogData) {
        if (JSON.parse(msg).key === specialLogData) {
          connects.forEach((socket) => {
            if (cachedData !== []) {
              socket.send('specialLog');
            }
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

setInterval(() => {
  connects.forEach((socket) => {
    if (cachedData !== []) {
      if (socket.readyState === 1) {
        socket.send(JSON.stringify(cachedData));
      }
    }
  });
  cachedData = [];
}, 1000);

/**
 * update document key if current use count is maximised
 */
function updateKey(): void {
  if (_counter > settings.userGroupCount) {
    settings.key = uuidv1().substr(0, 8);
    _counter = 1;
  }
  settings.userName = 'user_' + _counter;
  _counter += 1;
}

app.listen(settings.hostPort);
