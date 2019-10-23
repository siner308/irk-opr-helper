const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const path = require('path');

// #region Firebase 초기화
var serviceAccount = require('./key/pk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://irk-opr-helper.firebaseio.com',
});

// #endregion

// #region 라우터 Import
var router = require('./controllers/index.controller');

var apiDicRouter = require('./controllers/api/dic');
var apiItsmeRouter = require('./controllers/api/itsme');
var apiKeyRouter = require('./controllers/api/key');

var apiAuthRouter = require('./controllers/middle/auth');
// #endregion

// #region Express 초기화
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// #endregion

app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

app.set('layout', 'inc/_layout');
app.set('layout extractScripts', true);
app.use(require('express-ejs-layouts'));

// #endregion

// #region router 정의
app.use('/', router);
app.use('/api', apiDicRouter);
app.use('/api', apiItsmeRouter);

app.use('/api/key', apiAuthRouter);
app.use('/api', apiKeyRouter);
// #endregion

// Firebase Hoasting 에서 Request 를 받게 하기 위함
exports.app = functions.https.onRequest(app);
