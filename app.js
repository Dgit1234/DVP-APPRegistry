/**
 * Created by pawan on 4/8/2015.
 */
var restify = require('restify');
var Developer=require('./AppDeveloperManagement.js');
var VAPP=require('./VoiceAppManagement.js');
var http=require('http');
var cors = require('cors');
var config = require('config');

var port = config.Host.port || 3000;
var version=config.Host.version;
var version=config.Host.version;

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

//.......................................................................................................................

RestServer.post('/dvp/'+version+'/APPRegistry/AppDeveloperManagement/AddNewDeveloperRecord',function(req,res,next)
{
   // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
       // log.info("Inputs : "+req.body);
        Developer.AddNewDeveloperRecord(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Add New Developer : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.setHeader('Content-Type', "application/json");
               // res.end(err);
                res.end(res.body);
            }
            else if(resz)
            {
                console.log("New Developer record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.setHeader('Content-Type', "application/json");
                res.send(resz);
                res.end();
            }

        });

    }
    catch(ex)
    {
       console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................

RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/AddNewVoiceAppRecord',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.AddNewVoiceAppRecord(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Add New Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log("New voice app record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.MapDeveloperAndApplication(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Add New Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log("New voice app record saving Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/DeleteVoiceAppRecord',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.DeleteVoiceAppRecord(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Delete Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log(" voice app deletion Succeeded : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/ChangeVoiceAppAvailability',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.ChangeVoiceAppAvailability(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Availability change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log(" voice app availability changed : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});
//.......................................................................................................................
RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/VoiceAppUrlModification',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.VoiceAppUrlModification(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in URL change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log(" voice app URL changed : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz.toString());
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
RestServer.post('/dvp/'+version+'/APPRegistry/VoiceAppManagement/URLtest',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {

        // log.info("Inputs : "+req.body);
        VAPP.UrlChecker(req.body,function(err,resz)
        {


            if(err)
            {
                console.log("Error in URL change of  Voice app : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log(" voice app URL Checked, Status code : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz.toString());
            }

        });


    }
    catch(ex)
    {
        console.log("Exception found in Add New Developer : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});


//.......................................................................................................................
RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindAllVoiceAppRecords/:DevID',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.FindAllVoiceAppRecords(req.params.DevID,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Searching Voice apps : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log("Result : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in searching Voice App records : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
        res.end(ex.toString());
    }
    return next();
});

//.......................................................................................................................
RestServer.get('/dvp/'+version+'/APPRegistry/VoiceAppManagement/FindVoiceAppRecordForID/:VID/:DevID',function(req,res,next)
{
    // log.info("\n.............................................Add appointment Starts....................................................\n");
    try {
        // log.info("Inputs : "+req.body);
        VAPP.FindVoiceAppRecordForID(req.params.VID,req.params.DevID,function(err,resz)
        {


            if(err)
            {
                console.log("Error in Searching Voice apps : "+err);
                //var jsonString = messageFormatter.FormatMessage(err, "ERROR/EXCEPTION", false, resz);
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log("Result : "+resz);
                //var jsonString = messageFormatter.FormatMessage(undefined, "SUCCESS", true, resz);
                res.end(resz);
            }

        });

    }
    catch(ex)
    {
        console.log("Exception found in searching Voice App records for id : "+req.body.id+" Exception : "+ex);
        //var jsonString = messageFormatter.FormatMessage(ex, "EXCEPTION", false, res);
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
