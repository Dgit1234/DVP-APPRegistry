/**
 * Created by pawan on 4/8/2015.
 */
var restify = require('restify');
var Developer = require('./AppDeveloperManagement.js');
var APP = require('./VoiceAppManagement.js');
var http = require('http');
var cors = require('cors');
var config = require('config');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var uuid=require('node-uuid');
var port = config.Host.port || 3000;
var version=config.Host.version;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
});

restify.CORS.ALLOW_HEADERS.push('authorization');
//restify.CORS.ALLOW_HEADERS.push('Access-Control-Request-Method');



RestServer.use(restify.CORS());
RestServer.use(restify.fullResponse());
//Server listen

RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});

//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());


//.......................................................................................................................

//RestServer.post('/dvp/'+version+'/APPRegistry/AppDeveloperManagement/AddNewDeveloperRecord',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/Developer',function(req,res,next)
{

    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

       // log.info("Inputs : "+req.body);
        logger.debug('[DVP-APPRegistry.CreateDeveloper] - [%s] - [HTTP] - Request Received  - Inputs - %s ',reqId,JSON.stringify(req.body));

        Developer.CreateDeveloper(req.body,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.CreateDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.CreateDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - Exception occurred on calling method CreateDeveloper',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.CreateDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................

//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/AddNewVoiceAppRecord',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/Application',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

        logger.debug('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        APP.CreateVoiceApplication(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Exception occurred on method CreateVoiceApplication',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/Application/:AppID/AssignToDeveloper/:DevID',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

        logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [HTTP]  - Request Received - Inputs - App %s Dev %s ',reqId,req.params.AppID,req.params.DevID);
        APP.AssignApplicationToDeveloper(req.params.AppID,req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - Exception occurred on method AssignApplicationToDeveloper  : App %s Dev %s ',reqId,req.params.AppID,req.params.DevID, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/DeleteVoiceAppRecord',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/Application/:CAppID/SetAsMasterApp/:MAppID',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

        logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,req.params.MAppID);
        APP.SetMasterApp(req.params.CAppID,req.params.MAppID,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - Exception occurred on method SetMasterApp : Master App id % Child App %s ',reqId,req.params.MAppID,req.params.CAppID,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
     next();
});


RestServer.del('/DVP/API/'+version+'/APPRegistry/Application/:id',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;


        logger.debug('[DVP-APPRegistry.DeleteApplication] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,req.params.id);
        APP.DeleteApplication(req.params.id,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.DeleteApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.DeleteApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - Exception occurred on method DeleteApplication : id %',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.DeleteApplication] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/ChangeVoiceAppAvailability',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/Application/:id/Activate/:status',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

    logger.debug('[DVP-APPRegistry.ActivateApplication] - [%s] - [HTTP] - Request Received - Inputs -App %s others %s',reqId,req.params.id,JSON.stringify(req.body));

        APP.ActivateApplication(req.params.id,req.params.status,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.ActivateApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.ActivateApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - Exception occurred on method ActivateApplication App %s others %s',reqId,req.params.id,JSON.stringify(req),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.ActivateApplication] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification',function(req,res,next)


RestServer.post('/DVP/API/'+version+'/APPRegistry/Application/:AppID/URL',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }

        var Company=1;
        var Teanant=1;

        logger.debug('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [HTTP] - Request Received - Inputs - Id %s other %s',reqId,req.params.AppID,JSON.stringify(req.body));
        APP.ModifyApplicationURL(req.params.AppID,req.body,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - Exception occurred on method ModifyApplicationURL Inputs - Id %s other %s',reqId,req.params.AppID,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/URLtest',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/Application/:AppID/Test',function(req,res,next)
{

    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
    logger.debug('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Request Received - Inputs - id %s others %s',reqId,req.params.AppID,JSON.stringify(req.body));



        APP.TestApplication(req.params.AppID,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.TestApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.TestApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.TestApplication] - [VOICEAPP] - Exception occurred on method UrlChecker - Inputs - id %s ',reqId,req.params.AppID, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.TestApplication] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});


//.......................................................................................................................

//RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecordsOfDeveloper/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/Applications/:DevID',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
    logger.debug('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [HTTP] - Request received - Inputs - %s',reqId,req.params.DevID);

        APP.PickDeveloperApplications(req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - Exception occurred on method PickDeveloperApplications', ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindVoiceAppRecordForID/:VID/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/ApplicationDetails/:AppID',function(req,res,next)
{
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
        logger.debug('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [HTTP] - Request received - Inputs - AppID : $s Developer : %s',reqId,req.params.VID);
        APP.PickApplicationRecord(req.params.AppID,reqId,function(err,resz)
        {


            if(err)
            {

                logger.error('[DVP-APPRegistry.PickApplicationRecord] - [VOICEAPP] - Error occurred on method PickApplicationRecord - Records - AppID : '+req.params.AppId);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                logger.debug('[DVP-APPRegistry.PickApplicationRecord] - [VOICEAPP] - Record found - Returns - '+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Exception occurred on method PickApplicationRecord',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});


