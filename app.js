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
//var version=config.Host.version;

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});

RestServer.use(cors());
//Server listen
RestServer.listen(port, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);



});

//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

//APPDEVELOPER :- AppDeveloper tasks
//VOICEAPP


//.......................................................................................................................

//RestServer.post('/dvp/'+version+'/APPRegistry/AppDeveloperManagement/AddNewDeveloperRecord',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/AppDeveloperManagement/NewDeveloperRecord',function(req,res,next)
{

   // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.AppDeveloperManagement.AddNewDeveloperRecord] - [%s] - [HTTP] - Request Received  - Inputs - %s ',reqId,JSON.stringify(req.body));

        Developer.AddNewDeveloperRecord(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in Add New Developer : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
               // logger.error('[DVP-APPRegistry.AppDeveloperManagement.NewDeveloperRecord] - [APPDEVELOPER] - Error occurred on method AddNewDeveloperRecord - Records - '+JSON.stringify(req.body)+' - Error - ', err);

                res.setHeader('Content-Type', "application/json");
               // res.end(err);
                res.end(res.body);
            }
            else if(resz)
            {
                //logger.debug('[DVP-APPRegistry.AppDeveloperManagement.NewDeveloperRecord] - [APPDEVELOPER] - Successfully inserted - Returns - '+resz);
                //console.log("New Developer record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.setHeader('Content-Type', "application/json");
                res.send(resz);
                res.end();
            }

        });

    }
    catch(ex)
    {
       //console.log("Exception found in Add New Developer : "+ex);
        logger.error('[DVP-APPRegistry.AppDeveloperManagement.NewDeveloperRecord] - [%s] - Exception occurred on calling method AddNewDeveloperRecord',reqId, ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................

//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/AddNewVoiceAppRecord',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/NewVoiceAppRecord',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.VoiceAppManagement.AddNewVoiceAppRecord] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        VAPP.AddNewVoiceAppRecord(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.NewVoiceAppRecord] - [VOICEAPP] - Error occurred on method AddNewVoiceAppRecord - Records - '+JSON.stringify(req.body)+' - Error - ', err);
                //console.log("Error in Add New Voice app : "+err);

                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.NewVoiceAppRecord] - [VOICEAPP] - Successfully inserted - Returns - '+resz);
               // console.log("New voice app record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.NewVoiceAppRecord] - [%s] - Exception occurred on method AddNewVoiceAppRecord',reqId, ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.VoiceAppManagement.MapDeveloperAndApplication] - [%s] - [HTTP]  - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        VAPP.MapDeveloperAndApplication(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in Add New Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.MapDeveloperAndApplication] - [VOICEAPP] - [MAP] - Error occurred on method MapDeveloperAndApplication- Records - '+JSON.stringify(req.body)+' - Error - ', err);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log("New voice app record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);

                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.MapDeveloperAndApplication] - [VOICEAPP] - [MAP] - Successfully inserted - Returns - '+resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.MapDeveloperAndApplication] - [%s] - Exception occurred on method MapDeveloperAndApplication',reqId, ex);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/DeleteVoiceAppRecord',function(req,res,next)
RestServer.del('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecord',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.VoiceAppManagement.DeleteVoiceAppRecord] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        VAPP.DeleteVoiceAppRecord(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in Delete Voice app : "+err);
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.DeleteVoiceAppRecord] - [VOICEAPP] - Error occurred on method DeleteVoiceAppRecord- Records - '+JSON.stringify(req.body)+' - Error - ', err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log(" voice app deletion Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.DeleteVoiceAppRecord] - [VOICEAPP] - Successfully deleted - Returns - '+resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.DeleteVoiceAppRecord] - [%s] - Exception occurred on method DeleteVoiceAppRecord',reqId, ex);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/ChangeVoiceAppAvailability',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/ChangeVoiceAppAvailability',function(req,res,next)
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
    logger.debug('[DVP-APPRegistry.VoiceAppManagement.ChangeVoiceAppAvailability] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
    // log.info("\n.............................................Add appointment Starts....................................................\n");

        // log.info("Inputs : "+req.body);
        VAPP.ChangeVoiceAppAvailability(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.ChangeVoiceAppAvailability] - [VOICEAPP] - Error occurred on method ChangeVoiceAppAvailability- Records - '+JSON.stringify(req.body)+' - Error - ', err);
                //console.log("Error in Availability change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.ChangeVoiceAppAvailability] - [VOICEAPP] - Successfully changed - Returns - '+resz);
               // console.log(" voice app availability changed : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.ChangeVoiceAppAvailability] - [%s] - Exception occurred on method ChangeVoiceAppAvailability',reqId, ex);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.VoiceAppManagement.VoiceAppUrlModification] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));
        VAPP.VoiceAppUrlModification(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in URL change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.VoiceAppUrlModification] - [VOICEAPP] - Error occurred on method VoiceAppUrlModification- Records - '+JSON.stringify(req.body)+' - Error - ', err);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log(" voice app URL changed : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.VoiceAppUrlModification] - [VOICEAPP] - Successfully updated - Returns - '+resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.VoiceAppUrlModification] - [%s] - Exception occurred on method VoiceAppUrlModification',reqId, ex);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
//RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/URLtest',function(req,res,next)
RestServer.post('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/URLCheckout',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
    logger.debug('[DVP-APPRegistry.VoiceAppManagement.CheckoutURL] - [%s] - [HTTP] - Request Received - Inputs - %s',reqId,JSON.stringify(req.body));


        // log.info("Inputs : "+req.body);
        VAPP.UrlChecker(req.body,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in URL change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.CheckoutURL] - [VOICEAPP] - Error occurred on method UrlChecker- Records - '+JSON.stringify(req.body)+' - Error - ', err);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log(" voice app URL Checked, Status code : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.VoiceAppManagement.CheckoutURL] - [VOICEAPP] - Successive response returned  - Returns - '+resz);
                res.end(resz.toString());
            }

        });


    }
    catch(ex)
    {
        //console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.CheckoutURL] - [VOICEAPP] - Exception occurred on method UrlChecker', ex);
        res.end(ex.toString());
    }
    return next();
});


//.......................................................................................................................
//RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindAllVoiceAppRecords/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/AllVoiceAppRecordsOfDeveloper/:DevID',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    var reqId='';
    try {

        try
        {
            reqId = uuid.v1();
        }
        catch(ex)
        {

        }
    logger.debug('[DVP-APPRegistry.VoiceAppManagement.AllVoiceAppRecordsOfDeveloper] - [%s] - [HTTP] - Request received - Inputs - %s',reqId,req.params.DevID);

        // log.info("Inputs : "+req.body);
        VAPP.FindAllVoiceAppRecords(req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in Searching Voice apps : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                //logger.error('[DVP-APPRegistry.VoiceAppManagement.AllVoiceAppRecordsOfDeveloper] - [VOICEAPP] - Error occurred on method FindAllVoiceAppRecords - Records - '+JSON.stringify(req.params.DevID)+' - Error - ', err);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log("Result : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                //logger.debug('[DVP-APPRegistry.VoiceAppManagement.AllVoiceAppRecordsOfDeveloper] - [VOICEAPP] - Successfully data returns - '+resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in searching Voice App records : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);

        logger.error('[DVP-APPRegistry.VoiceAppManagement.AllVoiceAppRecordsOfDeveloper] - [%s] - Exception occurred on method FindAllVoiceAppRecords', ex);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
//RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindVoiceAppRecordForID/:VID/:DevID',function(req,res,next)
RestServer.get('/DVP/API/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppRecordOf/:VID/DevelopedBy/:DevID',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
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
        logger.debug('[DVP-APPRegistry.VoiceAppManagement.VoiceAppByIdAndDeveloperID] - [%s] - [HTTP] - Request received - Inputs - AppID : $s Developer : %s',reqId,req.params.VID,req.params.DevID);
        VAPP.FindVoiceAppRecordByID(req.params.VID,req.params.DevID,reqId,function(err,resz)
        {


            if(err)
            {
                //console.log("Error in Searching Voice apps : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                logger.error('[DVP-APPRegistry.VoiceAppManagement.VoiceAppByIdAndDeveloperID] - [VOICEAPP] - Error occurred on method FindVoiceAppRecordByID - Records - AppID : '+req.params.VID+' Developer : '+req.params.DevID+' - Error - ', err);
                res.end(err.toString());
            }
            else if(resz)
            {
                //console.log("Result : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                logger.debug('[DVP-APPRegistry.VoiceAppManagement.VoiceAppByIdAndDeveloperID] - [VOICEAPP] - Record found - Returns - '+resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        //console.log("Exception found in searching Voice App records for id : "+req.body.id+" Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        logger.error('[DVP-APPRegistry.VoiceAppManagement.VoiceAppByIdAndDeveloperID] - [%s] - Exception occurred on method VoiceAppByIdAndDeveloperID',reqId, ex);
        res.end(ex.toString());
    }
    return next();
});


/*
var swaggerUi = new SwaggerUi({
    url:"http://petstore.swagger.io/v2/swagger.json",
    dom_id:"swagger-ui-container"
});

swaggerUi.load();
    */
