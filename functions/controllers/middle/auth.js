const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser')();

var ApiResponse = require('../../models/class/apiresponse');

// #region Public functions

router.use(cookieParser);
router.use(async (req, res, next) => {
  if (
    req.headers.authorization == null ||
    req.headers.authorization.startsWith('Bearer ') == false ||
    !(req.cookies && req.cookies.__session)
  ) {
    res.status(403).json(new ApiResponse(false, 'Unauthorized', null));
    return;
  }

  next();
});

module.exports = router;
