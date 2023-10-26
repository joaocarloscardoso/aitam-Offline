module.exports = {
    cookieSecret: 'ALSAI AITAM ITWG WGITA cookie',
    passPhrase: 'FLAVIA#tc&2020',
    gmail: {
        user: '',
        password: '',
    },
    neo4j: {
        uri:'',            
        uriExternal:'',    
        user: '',
        password: ''
    },
    mongoDB: {
        urlDB:'',
        user: '',
        password:'',
        dbportfolio: '',
        colportfolio: '',
        colhistory: ''
    },
    AITAMmail: '',
    /*
    PlugInsPath: 'C:\\develop\\nodejs\\projects\\aitam\\public\\plugins',
    AuditTemplatesPath: 'C:\\develop\\nodejs\\projects\\aitam\\public\\audittemplates',
    LogFilesPath: 'C:\\develop\\nodejs\\projects\\aitam\\log\\',
    CoreSetPath: 'C:\\develop\\nodejs\\projects\\aitam\\coreset\\',
    WorkSetPath: 'C:\\develop\\nodejs\\projects\\aitam\\work\\',
    WorkSetLangPath: 'C:\\develop\\nodejs\\projects\\aitam\\public\\lang',
    */
    WorkLang: 'eng',
    ReportFormat: 'odt',    //ISO 3 letter 
    portfolio: "No",    //Yes or No
    trace: "No",  //Yes or No trace log on MongDB
    neo4jUse: "Yes", //Yes or No 
    urlpaths: {
        plugins: 'public/plugins/',
        audittemplates: 'public/audittemplates/',
    }
};
global.PlugInsPath='';
global.AuditTemplatesPath='';
global.LogFilesPath='';
global.CoreSetPath='';
global.WorkSetPath='';
global.WorkSetLangPath='';