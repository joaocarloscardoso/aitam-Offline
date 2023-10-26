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
// statistics service
var statisticsService = require('../lib/statistics.js');
//logging system
var log = require('../lib/log.js');
//trace system library
var trace = require('../lib/audittrace.js');
//multilanguage support
var appLang = require('../lib/language.js');
//common business functions
var commonF = require('../lib/common.js');
var Findings = require('../lib/findings.js');
var Recommendations = require('../lib/auditrec.js');


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

var tooleaudit = express.Router();

tooleaudit.get('/toolauditreference',function(req,res){
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
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Overview > Audit Reference accessed', 'Load/General');
        var AuditReference = InitialAudit.GetAuditReference(NewAuditFile, req.session.lang);
        //console.log(AuditReference);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            source: req.query.src,
            AuditReference: AuditReference,
            AuditErrors: '',
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

tooleaudit.get('/toolauditplugins',function(req,res){
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
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Plan > Plug-ins accessed', 'Plan');
        var PluginsCatalog = pluginsService.getPluginsForAudit(NewAuditFile, req.session.lang);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_plugins',
            AuditErrors: '',
            catalog: PluginsCatalog,
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

tooleaudit.get('/toolauditline',function(req,res){
    //res.send('Hello e-gov');
    //res.json(persons);
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);

    var appObjects = appLang.GetData(req.session.lang);

    //20221213
    if (status) {
        //change to get interactions info : statisticsService
        var TimeLineCatalog = statisticsService.GetTimelineStatus(NewAuditFile, req.session.lang);

        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Overview > Audit Control Dashboard accessed', 'Load/General');

/*
        var PluginsCatalog = statisticsService.GetPluginsUsed(NewAuditFile, req.session.lang);
        var GeneralDomainCatalog = statisticsService.GeneralDomainCharacterization(NewAuditFile, req.session.lang);
        var GeneralRiskCatalog = statisticsService.GeneralRiskCharacterization(NewAuditFile, req.session.lang);
        var GeneralFindingCatalog = Findings.FindingsForGeneralDomainsAnalysis(NewAuditFile, req.session.lang);
        var DataRecommendations = Recommendations.LoadAuditRecommendationsForAnalysis(NewAuditFile, req.session.lang);
*/
        //res.render('toolaudit/toolwork', { 
        res.render('toolaudit/auditlinevis', {
            action: 'audit',
            operation: 'audit_line',
            AuditErrors: '',
            catalog: TimeLineCatalog,
            /*
            GeneralDomainCatalog: GeneralDomainCatalog,
            GeneralRiskCatalog: GeneralRiskCatalog,
            GeneralFindingCatalog: GeneralFindingCatalog,
            data: DataRecommendations,
            PluginsCatalog: PluginsCatalog,
            */
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

tooleaudit.get('/auditstatistics',function(req,res){
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
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Plan > Domain Characterization accessed','Analytical');

        var GeneralDomainCatalog = statisticsService.GeneralDomainCharacterization(NewAuditFile, req.session.lang);
        var GeneralRiskCatalog = statisticsService.GeneralRiskCharacterization(NewAuditFile, req.session.lang);
        var Domain01Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '01', req.session.lang);
        var Domain02Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '02', req.session.lang);
        var Domain03Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '03', req.session.lang);
        var Domain04Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '04', req.session.lang);
        var Domain05Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '05', req.session.lang);
        var Domain06Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '06', req.session.lang);
        var Domain07Catalog = statisticsService.SpecificDomainCharacterization(NewAuditFile, '07', req.session.lang);
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_stats',
            AuditErrors: '',
            GeneralDomainCatalog: GeneralDomainCatalog,
            GeneralRiskCatalog: GeneralRiskCatalog,
            Domain01Catalog: Domain01Catalog,
            Domain02Catalog: Domain02Catalog,
            Domain03Catalog: Domain03Catalog,
            Domain04Catalog: Domain04Catalog,
            Domain05Catalog: Domain05Catalog,
            Domain06Catalog: Domain06Catalog,
            Domain07Catalog: Domain07Catalog,
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
            user:'',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
});

tooleaudit.get('/auditlog',function(req,res){
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
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Audit history', 'Analytical');
        var GeneralOpCatalog = trace.GeneralOpCharacterization(global.WorkSetPath + req.sessionID + '_trace.txt', req.session.lang);

        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_history',
            AuditErrors: '',
            GeneralOpCatalog: GeneralOpCatalog,
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
            user:'',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
});

tooleaudit.get('/restoreaudit',function(req,res){
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
        trace.RestoreSnapshot(req.sessionID, req.query.src, NewAuditFile);
        var TimeLineCatalog = statisticsService.GetTimelineStatus(NewAuditFile, req.session.lang);

        res.render('toolaudit/auditlinevis', {
            action: 'audit',
            operation: 'audit_line',
            AuditErrors: '',
            catalog: TimeLineCatalog,
            /*
            GeneralDomainCatalog: GeneralDomainCatalog,
            GeneralRiskCatalog: GeneralRiskCatalog,
            GeneralFindingCatalog: GeneralFindingCatalog,
            data: DataRecommendations,
            PluginsCatalog: PluginsCatalog,
            */
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
            user:'',
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
});

tooleaudit.post('/tooleditaudit', function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = global.WorkSetPath;
    var langMessage = '';
    
    form.on('fileBegin', function(field, file) {
        //rename the incoming file to the file's name
        file.path = form.uploadDir + req.sessionID + '.xml';
    });   

    form.parse(req, function(err, fields, files){
        var AuditFile = global.WorkSetPath;
        AuditFile = AuditFile + req.sessionID + '.xml';
        var InitialAudit = require('../lib/initialaudit.js')(AuditFile);
        var status = InitialAudit.VerifyAuditFile(AuditFile);

        var coreVersion= '';
    
        if (status)
        {
            coreVersion= InitialAudit.GetCoreVersion(AuditFile).substring(0, 4);
        }

        var appObjects = appLang.GetData(req.session.lang);
        
        var user = commonF.GetUser(req);
        if (Number(coreVersion) < 2021) {
            //set chosen working language to english
            req.session.lang = credentials.WorkLang;
            langMessage = appObjects.messages.audit_file_version;
        } else {
            req.session.lang = commonF.GetLang(req);
        }

        if(err) { 
            //log.warn('Error loading file from user ' + req.session.passport.user +'!');
            return res.render('/portal/toolindex', {
                action: 'tool',
                auditfile: 'work/' + req.sessionID + '.xml',
                audit: status,
                rectracking: credentials.portfolio,
                user: user,
                sessionlang: req.session.lang,
                nav: appObjects.pageNavigation
            });
        }
        //log.info(`User (` +  req.session.passport.user + `) uploaded a file: ${JSON.stringify(files)}`);
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, AuditFile, 1, 'Audit Uploaded', 'Load/General');
        //res.redirect(303, '/thank-you');
        //var CheckedAuditFile = global.WorkSetPath;
        //CheckedAuditFile = CheckedAuditFile + req.sessionID + '.xml';

        //20221213
        var TimeLineCatalog = statisticsService.GetTimelineStatus(AuditFile, req.session.lang);
        res.render('toolaudit/auditlinevis', {
            action: 'audit',
            operation: 'audit_line',
            AuditErrors: '',
            catalog: TimeLineCatalog,
            /*
            GeneralDomainCatalog: GeneralDomainCatalog,
            GeneralRiskCatalog: GeneralRiskCatalog,
            GeneralFindingCatalog: GeneralFindingCatalog,
            data: DataRecommendations,
            PluginsCatalog: PluginsCatalog,
            */
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
        /*
        return res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_creation',
            msg: 'Load completed successfuly!' + langMessage,
            auditfile: 'work/' + req.sessionID + '.xml',
            audit: status,
            rectracking: credentials.portfolio,
            user: user,
            appButtons:  appObjects.buttons,
            appAudit: appObjects.audit,
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
        */
    });
    /*
    form.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        request.resume();
    });
    form.on('aborted', function(err) {
        console.log("user aborted upload");
    });
    */
});  

tooleaudit.post('/toolnewaudit', function(req, res){
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);
    
    var appObjects = appLang.GetData(req.session.lang);

    //Create new audit file
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    InitialAudit.CreateInitialAuditXML();
    trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 1, 'Audit Created', 'Load/General');
    //res.redirect(303, '/thank-you');
    return res.render('toolaudit/toolwork', {
        action: 'audit',
        operation: 'audit_creation',
        msg: 'New audit created successfuly!',
        auditfile: 'work/' + req.sessionID + '.xml',
        audit: true,
        rectracking: credentials.portfolio,
        user: user,
        appButtons:  appObjects.buttons,
        appAudit: appObjects.audit,
        sessionlang: req.session.lang,
        nav: appObjects.pageNavigation
    });
});  

tooleaudit.post('/toolauditreference', [
    check('auditid').isLength({ min: 2 }).withMessage('Audit ID must be at least 2 chars long!'),
    check('title').isLength({ min: 3 }).withMessage('Audit Title must be at least 3 chars long!')
], (req, res) => {
    // Get content
    var AuditReference = {
        AuditId: req.body.auditid,
        Title: req.body.title,
        Background: req.body.background,
        Scope: req.body.scope,
        AuditScope: req.body.auditscope,
        AuditApproach: req.body.auditapproach
    };

    var AuditFile = global.WorkSetPath;
    AuditFile = AuditFile + req.sessionID + '.xml';

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);
    
    var appObjects = appLang.GetData(req.session.lang);

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            AuditReference: AuditReference,
            source: 'tbl',
            AuditErrors: errors.array(),
            msg: '',
            auditfile: 'work/' + req.sessionID + '.xml',
            audit: true,
            rectracking: credentials.portfolio,
            user: user,
            appButtons:  appObjects.buttons,
            appAudit: appObjects.audit,
            sessionlang: req.session.lang,
            nav: appObjects.pageNavigation
        });
    }
    else {
        //Save reference on audit file
        var InitialAudit = require('../lib/initialaudit.js')(AuditFile);

        InitialAudit.SetAuditReference(AuditFile, AuditReference, req.session.lang)
        trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, AuditFile, 1, 'Overview > Audit Reference modified', 'Load/General');

        //Issue #52: Automatic save/download on conclusion of key activities
        res.redirect('/toolaudit/work/download');
        //
        /*due to: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
        res.render('toolaudit/toolwork', {
            action: 'audit',
            operation: 'audit_reference',
            AuditReference: AuditReference,
            AuditErrors: '',
            msg: 'Audit saved successfuly! Use "Download" command under "Audit" menu to get the file.',
            auditfile: 'work/' + req.sessionID + '.xml',
            audit: true
        });*/
    }
});

tooleaudit.post('/toolauditplugins', function(req, res){
    //old: path.join(__dirname,'work')
    var NewAuditFile = global.WorkSetPath;
    NewAuditFile = NewAuditFile + req.sessionID + '.xml';
    var InitialAudit = require('../lib/initialaudit.js')(NewAuditFile);
    var status = InitialAudit.VerifyAuditFile(NewAuditFile);

    var user = commonF.GetUser(req);
    req.session.lang = commonF.GetLang(req);
    
    var appObjects = appLang.GetData(req.session.lang);

    if (status) {
        //check if req.body is filled
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            log.warn('Object req.body missing on tool audit plugins');
        } else {
            var totalCtrl = req.body.rows_count;
            var PlugIns2Audit = '';
            for ( var i = 1; i <= totalCtrl; i ++) {
                if (req.body['#' + i.toString() + 'Include'] == 'Yes'){
                    PlugIns2Audit = PlugIns2Audit + req.body['#' + i.toString() + 'Reference'] + '|' + req.body['#' + i.toString() + 'File'] + '#'
                }
            }
            //save plugins selected for audit
            var status = pluginsService.setPluginsForAudit(PlugIns2Audit, NewAuditFile);
            trace.AddActivity(global.WorkSetPath + req.sessionID + '_trace.txt', req.sessionID, NewAuditFile, 0, 'Plan > Plug-ins selected for audit', 'Plan');

            //reload plugins list and present save status
            var PluginsCatalog = pluginsService.getPluginsForAudit(NewAuditFile, req.session.lang);
            res.render('toolaudit/toolwork', {
                action: 'audit',
                operation: 'audit_plugins',
                AuditErrors: '',
                catalog: PluginsCatalog,
                msg: appObjects.messages.audit_edit_save,
                auditfile: 'work/' + req.sessionID + '.xml',
                audit: status,
                rectracking: credentials.portfolio,
                user: user,
                appButtons:  appObjects.buttons,
                appAudit: appObjects.audit,
                sessionlang: req.session.lang,
                nav: appObjects.pageNavigation
            });
        }
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

module.exports = tooleaudit;
