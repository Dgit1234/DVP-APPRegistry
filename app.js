/**
 * Created by pawan on 4/8/2015.
 */
var restify = require('restify');
var Developer = require('./AppDeveloperManagement.js');
var VAPP = require('./VoiceAppManagement.js');
var http = require('http');
var cors = require('cors');
var config = require('config');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var uuid=require('node-uuid');
var port = config.Host.port || 3000;
var version=config.Host.version;
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});

RestServer.use(cors());
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
RestServer.post('/DVP/API/'+version+'/APPRegistry/AppDeveloperManagement/Developer',function(req,res,next)
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

       // log.info("Inputs : "+req.body);
        logger.debug('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [HTTP] - Request Received  - Inputs - %s ',reqId,JSON.stringify(req.body));

        Developer.AddNewDeveloperRecord(req.body,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.NewDeveloperRecord] - [%s] - Exception occurred on calling method AddNewDeveloperRecord',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................

//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/AddNewVoiceAppRecord',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceApp',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        VAPP.AddNewVoiceAppRecord(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.NewVoiceAppRecord] - [%s] - Exception occurred on method AddNewVoiceAppRecord',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/Application/:AppID/MapWithDeveloper/:DevID',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [HTTP]  - Request Received - Inputs - App %s Dev %s ',reqId,req.params.AppID,req.params.DevID);
        VAPP.MapDeveloperAndApplication(req.params.AppID,req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - Exception occurred on method MapDeveloperAndApplication  : App %s Dev %s ',reqId,req.params.AppID,req.params.DevID, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/DeleteVoiceAppRecord',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/Application/:MAppID/SetAsMasterAppOf/:CAppID',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,req.params.MAppID);
        VAPP.SetMasterApp(req.params.CAppID,req.params.MAppID,reqId,function(err,resz)
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


RestServer.del('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceApp/:id',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,req.params.id);
        VAPP.DeleteVoiceAppRecord(req.params.id,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Exception occurred on method DeleteVoiceAppRecord : id %',reqId,req.params.id,ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/ChangeVoiceAppAvailability',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppAvailability/:id',function(req,res,next)
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
    logger.debug('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [HTTP] - Request Received - Inputs -App %s others %s',reqId,req.params.id,JSON.stringify(req.body));

        VAPP.ChangeVoiceAppAvailability(req.params.id,req.body,reqId,function(err,resz)
        {


            if(err)
            {

                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Exception occurred on method ChangeVoiceAppAvailability App %s others %s',reqId,req.params.id,JSON.stringify(req),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification',function(req,res,next)


RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification/:AppID',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [HTTP] - Request Received - Inputs - Id %s other %s',reqId,req.params.AppID,JSON.stringify(req.body));
        VAPP.VoiceAppUrlModification(req.params.AppID,req.body,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - Exception occurred on method VoiceAppUrlModification Inputs - Id %s other %s',reqId,req.params.AppID,JSON.stringify(req.body),ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/URLtest',function(req,res,next)

RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/URLCheckout/:AppID',function(req,res,next)
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
    logger.debug('[DVP-APPRegistry.CheckoutURL] - [%s] - [HTTP] - Request Received - Inputs - id %s others %s',reqId,req.params.AppID,JSON.stringify(req.body));



        VAPP.UrlChecker(req.params.AppID,req.body,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.CheckoutURL] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.CheckoutURL] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });


    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.CheckoutURL] - [VOICEAPP] - Exception occurred on method UrlChecker - Inputs - id %s others %s',reqId,req.params.AppID,JSON.stringify(req.body), ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.CheckoutURL] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});


//.......................................................................................................................

//RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecordsOfDeveloper/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecordsOfDeveloper/:DevID',function(req,res,next)
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
    logger.debug('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [HTTP] - Request received - Inputs - %s',reqId,req.params.DevID);

        VAPP.FindAllVoiceAppRecords(req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {

        logger.error('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - Exception occurred on method FindAllVoiceAppRecords', ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});

//.......................................................................................................................
//RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindVoiceAppRecordForID/:VID/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecordOf/:VID/DevelopedBy/:DevID',function(req,res,next)
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
        logger.debug('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [HTTP] - Request received - Inputs - AppID : $s Developer : %s',reqId,req.params.VID,req.params.DevID);
        VAPP.FindVoiceAppRecordByID(req.params.VID,req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {

                logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [VOICEAPP] - Error occurred on method FindVoiceAppRecordByID - Records - AppID : '+req.params.VID+' Developer : '+req.params.DevID+' - Error - ', err);
                var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, undefined);
                logger.debug('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }
            else if(resz)
            {

                logger.debug('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [VOICEAPP] - Record found - Returns - '+resz);
                var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - Request response : %s ', reqId, jsonString);
                res.end(jsonString);
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in searching Voice App records for id : "+req.body.id+" Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - Exception occurred on method VoiceAppByIdAndDeveloperID',reqId, ex);
        var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, undefined);
        logger.debug('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - Request response : %s ', reqId, jsonString);
        res.end(jsonString);
    }
    return next();
});


