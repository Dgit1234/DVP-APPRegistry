
/**
 * Created by pawan on 4/8/2015.
 */

var DbConn = require('DVP-DBModels');
//var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var stringify = require('stringify');
var open = require('open');
var http=require('http');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;
var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');


function AddNewVoiceAppRecord(VAPPObj,reqId,callback)
{
    try {
        DbConn.Application.find({where: [{AppName: VAPPObj.AppName}]}).complete(function (err, Aobj) {
            if (err) {
                logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,VAPPObj.AppName, err);
                callback(err, undefined);
            }
            else {
                if (Aobj) {
                    logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - VioceApp Name %s is already taken',reqId,VAPPObj.AppName);
                    callback(new Error('Username is Already taken'), undefined);
                }
                else {
                    try {
                        DbConn.Application.create(
                            {
                                AppName: VAPPObj.AppName,
                                Description: VAPPObj.Description,
                                Url: VAPPObj.Url,
                                ObjClass: VAPPObj.ObjClass,
                                ObjType: VAPPObj.ObjType,
                                ObjCategory: VAPPObj.ObjCategory,
                                CompanyId: 1,
                                TenantId: 1,
                                Availability:VAPPObj.Availability

                            }
                        ).complete(function(err,result)

                            {
                                if(err)
                                {
                                    logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - New Voice App record %s insertion failed',reqId,JSON.stringify(VAPPObj), err);
                                    callback(err,undefined);
                                }
                                else
                                {
                                    logger.info('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - New Voice App record insertion succeeded. Result - %s ',reqId, err);
                                    callback(undefined,JSON.stringify(result));
                                }
                            });
                    }
                    catch(ex)
                    {
                        logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - Exception in insertion of New Voice App record %s ',reqId,JSON.stringify(VAPPObj), ex);
                        callback(ex,undefined);
                    }
                }
            }
        })
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - Exception occurred when calling  method : AddNewVoiceAppRecord',reqId, ex);
        callback(ex,undefined);
    }
}

function MapDeveloperAndApplication(App,Dev,reqId,callback)
{
    try{
        DbConn.Application.find({where: [{id: App}]}).complete(function (err, Aobj) {

            if(err)
            {
                logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,App, err);
                callback(err,undefined);
            }
            else {
                if (Aobj)
                {
                    logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Application details found %s ',reqId,JSON.stringify(Aobj), err);
                    DbConn.AppDeveloper.find({where: [{id: Dev}]}).complete(function (errz, Dobj) {
                        if (errz)
                        {
                            logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application Developer %s ',reqId,Dev, err);
                            callback(err, undefined)

                        }
                        else {
                            if (Dobj) {
                                //Dobj.addApplication(Aobj).complete(function (errx, MapRes)
                                logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Developer details found %s ',reqId,JSON.stringify(Dobj), err);
                                Aobj.setAppDeveloper(Dobj).complete(function (errx, MapRes) {
                                    if (errx) {
                                        logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while mapping Application %s with Developer %s',reqId,Aobj.id,Dobj.id, err);
                                        callback(errx, undefined);
                                    }
                                    else {
                                        logger.info('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Mapping succeeded of Application %s with Developer %s',reqId,Aobj.id,Dobj.id);
                                        callback(undefined, MapRes);
                                    }
                                })
                            }
                            else {
                                logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - No record found for Application Developer %s ',reqId,MapObj.Devid);
                                callback("No record found for AppDevelopers : "+Dev);
                            }
                        }

                    });
                }
                else
                {
                    logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - No record found for Application  %s ',reqId,App);
                    callback("No record found for Application : "+MapObj.Appid);
                }
            }


        });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - Exception occurred when calling  method : MapDeveloperAndApplication',reqId, ex);
        callback(ex,undefined);
    }
}

function FindAllVoiceAppRecords(VAPPObj,reqId,callback)
{
    try{
        DbConn.Application.findAll({where: [{AppDeveloperId: VAPPObj}]}).complete(function (err, Aobj) {

            if(err)
            {
                logger.error('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [PGSQL] - Error Occurred while searching Application Developer %s ',reqId,VAPPObj, err);
                callback(err,undefined);
            }
            else
            {
                if(Aobj.length>0) {
                    logger.info('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [PGSQL] - Application records found which are developed by  Application Developer %s',reqId,VAPPObj);
                    callback(undefined, JSON.stringify(Aobj));
                }
                else{
                    logger.error('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [PGSQL] -No application records found of Application Developer %s ',reqId,VAPPObj);
                    callback(new Error("No record Found"),undefined);
                }
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - Exception occurred when calling  method : FindAllVoiceAppRecords',reqId, ex);
        callback(ex,undefined);
    }
}

function FindVoiceAppRecordByID(VID,DEVID,reqId,callback)
{
    try{
        DbConn.Application.find({where: [{id: VID},{AppDeveloperId:DEVID}]}).complete(function (err, Aobj) {

            if(err)
            {
                logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - Error occurred while searching Application %s by Developer %s ',reqId,VID,DEVID, err);
                callback(err,undefined);
            }
            else
            {
                if(Aobj) {
                    logger.info('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - Record found for Application %s by Developer %s ',reqId,VID,DEVID);
                    callback(undefined, JSON.stringify(Aobj));
                }
                else{
                    logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - No record found for Application %s by Developer %s ',reqId,VID,DEVID);
                    callback(new Error("No record Found"),undefined);
                }
            }

        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - Exception occurred when calling  method : FindVoiceAppRecordForID',reqId, ex);
        callback(ex,undefined);
    }
}

function DeleteVoiceAppRecord(AppId,reqId,callback)
{
    try
    {
        // DbConn.Application.find().complete(function (err, Aobj) {

        // if(err)
        // {
        // logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - Error occurred find records of Application %s',reqId, err);
        //  callback(err,undefined);

        //}
        //else
        //{
        DbConn.Application.destroy({where: [{id: AppId}]}).complete(function(err,result)
        {
            if(err)
            {
                logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - Error occurred on deletion of Application %s',reqId,AppId, err);
                callback(err,undefined);
            }
            else
            {
                if(result)
                {
                    logger.info('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - Deletion succeeded of Application %s - Result %s',reqId,AppId);
                    callback(undefined,result);
                }
                else
                {
                    logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }
            }
        });
        //}
        // });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Exception occurred when calling  method : DeleteVoiceAppRecord %s',reqId,AppId, ex);
        callback(ex,undefined);
    }
}

function ChangeVoiceAppAvailability(AppId,VAPPObj,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {
            if(err)
            {
                logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s developed by %s',reqId,AppId,VAPPObj.DevID, err);
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {
                    logger.info('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Application %s developed by %s is found',reqId,AppId,VAPPObj.DevID);
                    Aobj.update(
                        {
                            Availability: VAPPObj.Availability

                        }
                    ).then(function (result) {

                            logger.info('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Availability is changed to %s of Application %s developed by %s is found',reqId,VAPPObj.Availability,AppId,VAPPObj.DevID);
                            callback(undefined, JSON.stringify(result));

                        }).error(function (errz) {
                            //console.log("Availability updation failed");
                            logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Error occurred while changing Availability to %s of Application %s developed by %s',reqId,VAPPObj.Availability,AppId,VAPPObj.DevID, errz);
                            callback(errz,undefined);

                        });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - No record found for the Application %s developed by %s',reqId,VAPPObj.Availability,AppId,VAPPObj.DevID);
                    callback(new Error("No record Found"),undefined);
                }
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Exception occurred when calling method : ChangeVoiceAppAvailability',reqId,VAPPObj.AvailabilityAppId,VAPPObj.DevID, errz);
        callback(ex,undefined);
    }
}

function VoiceAppUrlModification(AppId,VAPPObj,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {
            if(err)
            {
                logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s' ,reqId,AppId, err);
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {
                    logger.info('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Record of  Application %s is found',reqId,AppId);
                    Aobj.update(
                        {
                            Url: VAPPObj.Url

                        }
                    ).then(function (result) {

                            logger.info('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Url of Application %s is updated to %s is succeeded',reqId,AppId,VAPPObj.Url);
                            callback(undefined, JSON.stringify(result));

                        }).error(function (errz) {
                            //console.log("URL updation failed");
                            logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Url updating is failed of Application %s' ,reqId,AppId, errz);
                            callback(errz,undefined);

                        });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - No record found for Application %s' ,reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Exception occurred when calling method : ChangeVoiceAppAvailability : id %s ' ,reqId,AppId,ex);
        callback(ex,undefined);
    }
}

function UrlChecker(AppId,VAPPObj,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {

            if(err)
            {
                logger.error('[DVP-APPRegistry.CheckoutURL] - [%s] - [PGSQL] - Error occurred while searching Application %s ',reqId,AppId, err);
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {
                    logger.info('[DVP-APPRegistry.CheckoutURL] - [%s] - [PGSQL] - Record found for Application %s ',reqId,AppId, err);
                    var options = {
                        hostname: Aobj.Url

                    };

                    var req = http.request(options, function(res) {
                        //console.log('STATUS: ' + res.statusCode);
                        logger.info('[DVP-APPRegistry.CheckoutURL] - [%s] - [HTTP] - Response code of HTTp request  %s ',reqId,res.statusCode);
                        callback(undefined,res.statusCode);
                        //console.log('HEADERS: ' + JSON.stringify(res.headers));
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            //console.log('BODY: ' + chunk);
                        });
                    });

                    req.on('error', function(e) {
                        //console.log('problem with request: ' + e.message);
                        logger.error('[DVP-APPRegistry.CheckoutURL] - [%s] - [HTTP] - Error occurred while sending HTTP request to Application URL  %s ',reqId,Aobj.Url, err);
                        callback(e.message,undefined);
                    });
                    req.end();

                }
                else
                {
                    logger.error('[DVP-APPRegistry.CheckoutURL] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }
            }

        });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Exception occurred when calling method : UrlChecker' ,reqId,ex);
        callback(ex,err);
    }
}

function SetMasterApp(AppId,MasterId,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId}]}).complete(function (errA, Aobj) {
            if(errA)
            {
                callback(errA,undefined);
            }
            else
            {
                if(Aobj!=null)
                {

                        DbConn.Application.find({where: [{id: MasterId}]}).complete(function (errM, Mobj)
                        {
                            if(errM)
                            {
                                callback(errM,undefined);

                            }
                            else
                            {
                                if(Mobj!=null)
                                {
                                    Aobj.setMasterApplication(Mobj).complete(function(errMap,ResMap)
                                    {
                                        if(errMap)
                                        {
                                            callback(errMap,undefined);
                                        }
                                        else
                                        {
                                            callback(undefined,ResMap);
                                        }
                                    });
                                }
                            }

                        });

                }

                else
                {
                    callback(new Error("Empty"),undefined);
                }
            }
        });
    }
    catch(ex)
    {
        callback(ex,undefined);
    }

}


module.exports.AddNewVoiceAppRecord = AddNewVoiceAppRecord;
module.exports.MapDeveloperAndApplication = MapDeveloperAndApplication;
module.exports.FindAllVoiceAppRecords = FindAllVoiceAppRecords;
module.exports.FindVoiceAppRecordByID = FindVoiceAppRecordByID;
module.exports.DeleteVoiceAppRecord = DeleteVoiceAppRecord;
module.exports.ChangeVoiceAppAvailability = ChangeVoiceAppAvailability;
module.exports.VoiceAppUrlModification = VoiceAppUrlModification;
module.exports.UrlChecker = UrlChecker;
module.exports.SetMasterApp = SetMasterApp;

