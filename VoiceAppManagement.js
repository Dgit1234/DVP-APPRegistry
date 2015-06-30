
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

        var ObjClass="";
        DbConn.Application.find({where: [{AppName: VAPPObj.AppName}]}).complete(function (errApp, resApp) {
            if (errApp) {
                logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,VAPPObj.AppName, errApp);
                callback(errApp, undefined);
            }
            else {
                if (resApp) {
                    logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - VioceApp Name %s is already taken',reqId,VAPPObj.AppName);
                    callback(new Error('Username is Already taken'), undefined);
                }
                else {
                    try {
                        if(VAPPObj.IsDeveloper)
                        {
                            ObjClass="DEVELOPER"
                        }
                        else
                        {
                            ObjClass="SYSTEM"
                        }


                        DbConn.Application.create(
                            {
                                AppName: VAPPObj.AppName,
                                Description: VAPPObj.Description,
                                Url: VAPPObj.Url,
                                ObjClass: ObjClass,
                                ObjType: VAPPObj.Protocol,
                                ObjCategory: "",
                                CompanyId: 1,
                                TenantId: 1,
                                Availability:VAPPObj.Availability

                            }
                        ).complete(function(errAppSave,resAppSave)

                            {
                                if(errAppSave)
                                {
                                    logger.error('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - New Voice App record %s insertion failed',reqId,JSON.stringify(VAPPObj), errAppSave);
                                    callback(errAppSave,undefined);
                                }
                                else
                                {
                                    logger.info('[DVP-APPRegistry.AddNewVoiceAppRecord] - [%s] - [PGSQL] - New Voice App record insertion succeeded. Result - %s ',reqId, errAppSave);
                                    callback(undefined,JSON.stringify(resAppSave));
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
        DbConn.Application.find({where: [{id: App}]}).complete(function (errApp, resApp) {

            if(errApp)
            {
                logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,App, errApp);
                callback(errApp,undefined);
            }
            else {
                if (resApp)
                {
                    logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Application details found %s ',reqId,JSON.stringify(resApp), errApp);
                    DbConn.AppDeveloper.find({where: [{id: Dev}]}).complete(function (errDev, resDev) {
                        if (errDev)
                        {
                            logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application Developer %s ',reqId,Dev, errApp);
                            callback(errApp, undefined)

                        }
                        else {
                            if (resDev) {
                                logger.debug('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Developer details found %s ',reqId,JSON.stringify(resDev), errApp);
                                resApp.setAppDeveloper(resDev).complete(function (errMap, resMap) {
                                    if (errMap) {
                                        logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Error occurred while mapping Application %s with Developer %s',reqId,resApp.id,resDev.id, errApp);
                                        callback(errMap, undefined);
                                    }
                                    else {
                                        logger.info('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - Mapping succeeded of Application %s with Developer %s',reqId,resApp.id,resDev.id);
                                        callback(undefined, resMap);
                                    }
                                })
                            }
                            else {
                                logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - No record found for Application Developer %s ',reqId,Dev);
                                callback(new Error("No record found for AppDevelopers : "+Dev),undefined);
                            }
                        }

                    });
                }
                else
                {
                    logger.error('[DVP-APPRegistry.MapDeveloperAndApplication] - [%s] - [PGSQL] - No record found for Application  %s ',reqId,App);
                    callback(new Error("No record found for Application : "+App),undefined);
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
        DbConn.Application.findAll({where: [{AppDeveloperId: VAPPObj}]}).complete(function (errApp, resApp) {

            if(errApp)
            {
                logger.error('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [PGSQL] - Error Occurred while searching Application Developer %s ',reqId,VAPPObj, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp.length>0) {
                    logger.info('[DVP-APPRegistry.AllVoiceAppRecordsOfDeveloper] - [%s] - [PGSQL] - Application records found which are developed by  Application Developer %s',reqId,VAPPObj);
                    callback(undefined, JSON.stringify(resApp));
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
        DbConn.Application.find({where: [{id: VID}]}).complete(function (errApp, resApp) {

            if(errApp)
            {
                logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - Error occurred while searching Application %s by Developer %s ',reqId,VID, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp) {
                    logger.info('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - Record found for Application %s by Developer %s ',reqId,VID);
                    callback(undefined, JSON.stringify(resApp));
                }
                else{
                    logger.error('[DVP-APPRegistry.VoiceAppByIdAndDeveloperID] - [%s] - [PGSQL] - No record found for Application %s by Developer %s ',reqId,VID);
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

        DbConn.Application.destroy({where: [{id: AppId}]}).complete(function(errApp,resApp)
        {
            if(errApp)
            {
                logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - Error occurred on deletion of Application %s',reqId,AppId, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - Deletion succeeded of Application %s - Result %s',reqId,AppId);
                    callback(undefined,resApp);
                }
                else
                {
                    logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }
            }
        });

    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.DeleteVoiceAppRecord] - [%s] - Exception occurred when calling  method : DeleteVoiceAppRecord %s',reqId,AppId, ex);
        callback(ex,undefined);
    }
}

function ChangeVoiceAppAvailability(AppId,status,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId}]}).complete(function (errApp, resApp) {
            if(errApp)
            {
                logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,AppId, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Application %s is found',reqId,AppId);
                    resApp.update(
                        {
                            Availability: status

                        }
                    ).then(function (resUpdate) {

                            logger.info('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Availability is changed to %s of Application %s is found',reqId,status,AppId);
                            callback(undefined, JSON.stringify(resUpdate));

                        }).error(function (errUpdate) {
                            logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - Error occurred while changing Availability to %s of Application %s',reqId,status, errUpdate);
                            callback(errUpdate,undefined);

                        });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - [PGSQL] - No record found for the Application %s',reqId,status,AppId);
                    callback(new Error("No record Found"),undefined);
                }
            }
        });
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.ChangeVoiceAppAvailability] - [%s] - Exception occurred when calling method : ChangeVoiceAppAvailability %s',reqId,status, ex);
        callback(ex,undefined);
    }
}

function VoiceAppUrlModification(AppId,VAPPObj,reqId,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (errApp, resApp) {
            if(errApp)
            {
                logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s' ,reqId,AppId, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Record of  Application %s is found',reqId,AppId);
                    resApp.update(
                        {
                            Url: VAPPObj.Url

                        }
                    ).then(function (resUpdate) {

                            logger.info('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Url of Application %s is updated to %s is succeeded',reqId,AppId,VAPPObj.Url);
                            callback(undefined, JSON.stringify(resUpdate));

                        }).error(function (errUpdate) {
                            logger.error('[DVP-APPRegistry.VoiceAppUrlModification] - [%s] - [PGSQL] - Url updating is failed of Application %s' ,reqId,AppId, errUpdate);
                            callback(errUpdate,undefined);

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
        DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (errApp, resApp) {

            if(errApp)
            {
                logger.error('[DVP-APPRegistry.CheckoutURL] - [%s] - [PGSQL] - Error occurred while searching Application %s ',reqId,AppId, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.CheckoutURL] - [%s] - [PGSQL] - Record found for Application %s ',reqId,AppId, errApp);
                    var options = {
                        hostname: resApp.Url

                    };

                    var req = http.request(options, function(res) {
                        logger.info('[DVP-APPRegistry.CheckoutURL] - [%s] - [HTTP] - Response code of HTTp request  %s ',reqId,res.statusCode);
                        callback(undefined,res.statusCode);

                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                        });
                    });

                    req.on('error', function(e) {
                        //console.log('problem with request: ' + e.message);
                        logger.error('[DVP-APPRegistry.CheckoutURL] - [%s] - [HTTP] - Error occurred while sending HTTP request to Application URL  %s ',reqId,resApp.Url, errApp);
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
        DbConn.Application.find({where: [{id: AppId}]}).complete(function (errCApp, resCApp) {
            if(errCApp)
            {
                callback(errCApp,undefined);
            }
            else
            {
                if(resCApp!=null)
                {

                        DbConn.Application.find({where: [{id: MasterId},{ObjClass:"SYSTEM"}]}).complete(function (errMaster, resMaster)
                        {
                            if(errMaster)
                            {
                                callback(errMaster,undefined);

                            }
                            else
                            {
                                if(resMaster!=null)
                                {
                                    resCApp.setMasterApplication(resMaster).complete(function(errMap,resMap)
                                    {
                                        if(errMap)
                                        {
                                            callback(errMap,undefined);
                                        }
                                        else
                                        {
                                            callback(undefined,resMap);
                                        }
                                    });
                                }
                                else
                                {
                                    callback(new Error("Invalid Master AppID"),undefined);
                                }
                            }

                        });

                }

                else
                {
                    callback(new Error("No child Application Found"),undefined);
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

