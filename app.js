/**
 * Created by pawan on 4/8/2015.
 */
var restify = require('restify');
var Developer=require('./AppDeveloperManagement.js');
var VAPP=require('./VoiceAppManagement.js');

var RestServer = restify.createServer({
    name: "myapp",
    version: '1.0.0'
},function(req,res)
{

});
//Server listen
RestServer.listen(8083, function () {
    console.log('%s listening at %s', RestServer.name, RestServer.url);

});
//Enable request body parsing(access)
RestServer.use(restify.bodyParser());
RestServer.use(restify.acceptParser(RestServer.acceptable));
RestServer.use(restify.queryParser());

//.......................................................................................................................

RestServer.post('/dvp/:version/APPRegistry/AppDeveloperManagement/AddNewDeveloperRecord',function(req,res,next)
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
                res.end(err.toString());
            }
            else if(resz)
            {
                console.log("New Developer record saving Succeeded : "+resz);
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

RestServer.post('/dvp/:version/APPRegistry/VoiceAppManagement/AddNewVoiceAppRecord',function(req,res,next)
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
RestServer.post('/dvp/:version/APPRegistry/VoiceAppManagement/MapDeveloperAndApplication',function(req,res,next)
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