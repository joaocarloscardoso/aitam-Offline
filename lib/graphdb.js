//credentials used in the app
var credentials = require('../credentials.js');

var fs = require('fs'),
    path = require('path');

//logging system
var log = require('./log.js');

const neo4j = require('neo4j-driver');

const driver = neo4j.driver(credentials.neo4j.uri, neo4j.auth.basic(credentials.neo4j.user,credentials.neo4j.password));

function CreateDictionary() {
    var NewDictFile = global.WorkSetPath;
    NewDictFile = NewDictFile + 'gazetteer.dic';

    if  ( ! fs.existsSync(NewDictFile)) {
        const session = driver.session();
        session
            .run('MATCH (n:Country) RETURN n')
            .then(result => {
                fs.writeFileSync(NewDictFile, '');
                    result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Name +'|Country|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('1 Graph db error: ' + error);
            })
            .then(() => session.close())

        const session1 = driver.session();
        session1
            .run('MATCH (n:Function) RETURN n')
            .then(result => {
                result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Function|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('2 Graph db error: ' + error);
            })
            .then(() => session1.close())

        const session2 = driver.session();
        session2
            .run('MATCH (n:ActivityDomain) RETURN n')
            .then(result => {
                result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|ActivityDomain|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('3 Graph db error: ' + error);
            })
            .then(() => session2.close())

        const session3 = driver.session();
        session3
            .run('MATCH (n:Process) RETURN n')
            .then(result => {
                result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Process|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('4 Graph db error: ' + error);
            })
            .then(() => session3.close())

        const session4 = driver.session();
        session4
            .run('MATCH (n:Goal) RETURN n')
            .then(result => {
                result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Goal|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('5 Graph db error: ' + error);
            })
            .then(() => session4.close())

        const session5 = driver.session();
        session5
            .run('MATCH (n:Topics) RETURN n')
            .then(result => {
                result.records.forEach(function(record){
                    fs.appendFileSync(NewDictFile, record._fields[0].properties.Definition +'|Topics|0\n');
                // console.log(record._fields[0].properties.Name);
                });
            })
            .catch(error => {
                log.warn('6 Graph db error: ' + error);
            })
            .then(() => session5.close())
    }
};

module.exports.CreateDictionary = CreateDictionary;
