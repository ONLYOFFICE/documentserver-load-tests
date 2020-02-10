import express from 'express';
import cors from 'cors';
import bodyParser = require("body-parser");
import path from "path";
const settings = require("./settings.json");
const uuidv1 = require('uuid/v1');
const favicon = require('serve-favicon');

import expressWs from 'express-ws';
const { app } = expressWs(express());

let _counter = 1;
let connects: WebSocket[] = [];

settings.key = uuidv1().substr(0,8);

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

app.get('/',  (req, res) => {
    if (_counter > settings.userGroupCount) {
        settings.key = uuidv1().substr(0,8);
        _counter = 1;
    }
    settings.userName = "user_" + _counter;
    _counter +=1;
    res.render('index', settings );

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

// don't know how to set type instead of any
app.ws('/activity', (ws: any) => {
    try {
        connects.push(ws);
        if (ws.readyState === 1) {
            ws.on('message', (msg: string) => {
                connects.forEach(socket => {
                    socket.send(msg);
                });
            });
        }

        ws.on('close', () => {
            connects = connects.filter(conn => {
                return (conn !== ws);
            });
        });
    } catch (e) {
        console.log(e);
    }
});

app.listen(+settings.hostPort);