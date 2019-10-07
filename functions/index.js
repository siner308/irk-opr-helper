const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
//const bodyParse = require('body-parser');
//const cors = require('cors');

var serviceAccount = require('./key/pk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://irk-opr-helper.firebaseio.com',
});
const db = admin.firestore();

var apiDicRouter = require('./routes/api/dic');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/dic', apiDicRouter);

exports.app = functions.https.onRequest(app);

//const app_api = express();

//app.use(cors({ origin: ['https://opr.ingress.com'] }));

//app_api.use('/api/', app);
//app_api.use(bodyParse.json());
//app_api.use(cors({ origin: ['https://opr.ingress.com'] }));

//exports.api = functions.https.onRequest(app_api);
//exports.app_api = app_api;

/*app.get('/warmup', (req, res) => {
  res.send('hey');
});*/
