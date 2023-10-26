//npm modules
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
//middleware to validate user controls
const { check, validationResult } = require('express-validator');
//credentials used in the app
var credentials = require('../credentials.js');

//plugins stats and catalogue
var Findings = require('../lib/findings.js');
//logging system
var log = require('../lib/log.js');
//trace system
var trace = require('../lib/audittrace.js');
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

var findingaudit = express.Router();

findingaudit.get('/auditfindings',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);

    var appObjects = appLang.GetData(req.session.lang);

    if (status) {
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Findings > Findings Table accessed', 'Findings');
        var findingscatalog = Findings.LoadFindings(NewAuditFile, req.session.lang);

        //var teste = Findings.FindingsForGeneralDomainsAnalysis(NewAuditFile);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_findings',
            AuditErrors: '',
            findingcatalog: findingscatalog,
            msg: '',
            auditfile: 'work/' + req.sessionID + '.xml',
            audit: status,
            rectracking: credentials.portfolio,
            user: user,
            appButtons:  appObjects.buttons,
            appAudit: appObjects.audit,
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            auditfile: '',
            audit: status,
            rectracking: credentials.portfolio,
            user: '',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
});

findingaudit.post('/auditfindings', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    req.session.lang = commonF.GetLang(req);

    var appObjects = appLang.GetData(req.session.lang);
    
    if (status) {
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 1, 'Findings > Findings Table modified', 'Findings');

        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit findings');
        } else {
            var totalCtrl = req.body.rows_count;
            var Catalog = [];
            for ( var i = 1; i <= totalCtrl; i ++) {
                var NewEntry = {
                    Id: req.body['#' + i.toString() + 'Id'],
                    Selected: req.body['#' + i.toString() + 'Include']
                };
                Catalog.push(NewEntry);
            }
            //save plugins selected for audit
            var status = Findings.SaveFindings(NewAuditFile, Catalog);
            //commented on 2021-03-09 since nouse of loade findings
            //var findingscatalog = Findings.LoadFindings(NewAuditFile, req.session.lang);
            //Issue #52: Automatic save/download on conclusion of key activities
            res.redirect('/toolaudit/work/download');
            //
            /*due to: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
            res.render('toolaudit/toolwork', {
                action: 'audit',
                operation: 'audit_findings',
                AuditErrors: '',
                findingcatalog: findingscatalog,
                msg: 'Audit saved successfuly! Use "Download" command under "Audit" menu to get the file.',
                auditfile: 'work/' + req.sessionID + '.xml',
                audit: status
            });*/
        }
    } else {
        res.render('login/login', {
            action: 'login',
            //persons: persons,
            auditfile: '',
            audit: status,
            rectracking: credentials.portfolio,
            user:'',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }    
});

findingaudit.get('/deleteauditfinding/:findingId',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);
    
    var appObjects = appLang.GetData(req.session.lang);

    if (status) {
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 1, 'Findings > Finding deleted', 'Findings');

        var status = Findings.DeleteFinding(NewAuditFile, req.params.findingId);
        var findingscatalog = Findings.LoadFindings(NewAuditFile, req.session.lang);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_findings',
            AuditErrors: '',
            findingcatalog: findingscatalog,
            msg: appObjects.messages.finding_deleted,
            auditfile: 'work/' + req.sessionID + '.xml',
            audit: status,
            rectracking: credentials.portfolio,
            user: user,
            appButtons:  appObjects.buttons,
            appAudit: appObjects.audit,
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    } else {
        res.render('login/login', {
            action: 'login',
            auditfile: '',
            //persons: persons,
            audit: status,
            rectracking: credentials.portfolio,
            user: '',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
});

module.exports = findingaudit;