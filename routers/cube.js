//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator');
//credentials used in the app
var credentials = require('../credentials.js');

//email system
var emailService = require('../lib/email.js')(credentials);
//plugins stats and catalogue
var pluginsService = require('../lib/catplugins.js')(global.PlugInsPath);
//logging system
var log = require('../lib/log.js');
//multilanguage support
var appLang = require('../lib/language.js');
//common business functions
var commonF = require('../lib/common.js');

//generation of uuid
//const uuid = require('uuid/v4');
const { v4: uuid } = require('uuid');
//session handling and store
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//configure Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//requests to users database handler
const axios = require('axios');
//module to hash passwords
const bcrypt = require('bcrypt-nodejs');
//file uploads
var formidable = require('formidable');
var fs = require("fs");


var cube = express.Router();

cube.get('/kgraph', (req, res) => {
       req.session.lang = commonF.GetLang(req);

       var appObjects = appLang.GetData(req.session.lang);


       res.render('./cube/kgraph', {
              sessionlang: req.session.lang,
              nav: appObjects.pageNavigation
       });
});

module.exports = cube;
