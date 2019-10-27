const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')();

const admin = require('firebase-admin');
try {
  admin.initializeApp();
} catch (e) {}

// #region Public functions

router.use(cookieParser);
router.use(async (req, res, next) => {
  if (
    req.headers.authorization == null ||
    req.headers.authorization.startsWith('Bearer ') == false ||
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).send('authorization failed');
    return;
  }

  let token = req.headers.authorization.split(' ')[1];
  try {
    let decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
    return;
  } catch (err) {
    res.status(403).send('authorization failed');
    return;
  }
});

module.exports = router;
