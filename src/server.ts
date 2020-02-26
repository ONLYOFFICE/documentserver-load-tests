import express from 'express';
import cors from 'cors';
import bodyParser = require("body-parser");
import path from "path";

const settings = require("./settings.json");
const uuidv1 = require('uuid/v1');
const favicon = require('serve-favicon');
const url = require('url');

import expressWs from 'express-ws';

const {app} = expressWs(express());

let _counter = 1;
let connects: WebSocket[] = [];
let specialLog= '';
settings.key = uuidv1().substr(0, 8);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: '10mb'}));
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

app.get('/background_for_paragraphs', (req, res) => {
    if (_counter > settings.userGroupCount) {
        settings.key = uuidv1().substr(0, 8);
        _counter = 1;
    }
    settings.plugin = 'background_for_paragraphs';
    settings.documentname = 'Document1.docx';
    settings.userName = "user_" + _counter;
    _counter += 1;
    res.render('background_for_paragraphs', settings);
});

app.get('/background_for_cells', (req, res) => {
    if (_counter > settings.userGroupCount) {
        settings.key = uuidv1().substr(0, 8);
        _counter = 1;
    }
    settings.userName = "user_" + _counter;
    _counter += 1;

    settings.plugin = 'background_for_cells';
    settings.documentname = 'Spreadsheet.xlsx';
    res.render('background_for_cells', settings);
});

app.get('/text_in_cells', (req, res) => {
    if (_counter > settings.userGroupCount) {
        settings.key = uuidv1().substr(0, 8);
        _counter = 1;
    }
    settings.userName = "user_" + _counter;
    _counter += 1;

    settings.plugin = 'text_in_cells';
    settings.documentname = 'Spreadsheet.xlsx';
    res.render('background_for_cells', settings);
});

app.get('/open', (req, res) => {
    settings.key = req.query.key;
    res.render('open', settings);
});

// default response without file saving. See https://api.onlyoffice.com/editors/callback
app.post('/callback', (req, res) => {
    res.json({error: 0});
});

app.post('/activity', (req, res) => {
    console.log(req.body);
    res.json({error: 0});
});

app.get('/activity', (req, res) => {
    res.render('activity', {connectsCount: connects.length, documentServer: settings.documentServer});
});

let cachedData: string[] = [];
// don't know how to set type instead of any
app.ws('/activity', (ws: any, req: any) => {
    try {
        special_log(url.parse(req.url, true).query, ws);
        connects.push(ws);
        ws.on('close', () => {
            connects = connects.filter(conn => {
                return (conn !== ws);
            });
        });
    } catch (e) {
        console.log(e);
    }
});

function special_log(param: any, ws: any) {
    if (param) {
        if (param.key) {
            specialLog = param.key;
            console.log('param: ');
            console.log(param.key);
        }
    }
    return ws;
}

app.ws('/message', (ws: any) => {
    try {
        ws.on('message', (msg: string) => {
            cachedData.push(msg);
            if (specialLog) {
                if (JSON.parse(msg).key === specialLog) {
                    connects.forEach(socket => {
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
    connects.forEach(socket => {
        if (cachedData !== []) {
            if (socket.readyState === 1) {
                socket.send(JSON.stringify(cachedData));
            }
        }
    });
    cachedData = [];
}, 1000);

app.listen(+settings.hostPort);