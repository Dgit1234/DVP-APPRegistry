
/**
 * Created by pawan on 4/8/2015.
 */

var DbConn = require('dvp-dbmodels');
var stringify = require('stringify');
var open = require('open');
var http=require('http');
var httpreq=require('request');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');



function CreateVoiceApplication(appobj,reqId,callback) {

    if(appobj.AppName)
    {
        try
        {
            var ObjClass="";

            DbConn.Application.find({where:{AppName:appobj.AppName}}).then(function (resApp) {

                if(resApp)
                {
                    logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - VoiceApp Name %s is already taken',reqId,appobj.AppName);
                    callback(new Error('AppName is Already taken'), undefined);
                }else
                {
                    if(appobj.ObjType=="HTTAPI"|| appobj.ObjType=="SOCKET" || appobj.ObjType=="EXTENDED")
                    {
                        try
                        {
                            if(appobj.IsDeveloper)
                            {
                                ObjClass = "DEVELOPER"
                            }else
                            {
                                ObjClass = "SYSTEM"
                            }


                            var newObj = DbConn.Application.build
                            (
                                {
                                    AppName: appobj.AppName,
                                    Description: appobj.Description,
                                    Url: appobj.Url,
                                    ObjClass: ObjClass,
                                    ObjType: appobj.ObjType,
                                    ObjCategory:appobj.ObjCategory,
                                    CompanyId: 1,
                                    TenantId: 1,
                                    Availability: appobj.Availability


                                }
                            );

                            newObj.save().then(function (resSave) {


                                logger.info('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - New Voice App record insertion succeeded. Result ', reqId);
                                callback(undefined, resSave);

                            }).catch(function (errSave) {

                                logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - New Voice App record insertion failed', reqId);
                                callback(errSave, undefined);
                            });
                        }
                        catch(ex)
                        {
                            logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - Exception in insertion of New Voice App record  ', reqId, ex);
                            callback(ex, undefined);
                        }
                    }
                    else
                    {
                        logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Invalid ObjectType %s ', reqId, appobj.ObjType);
                        callback(new Error("Invalid ObjectType"), undefined);
                    }

                }


            }).catch(function (errApp) {
                logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,appobj.AppName, errApp);
                callback(errApp, undefined);
            });

        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - Exception occurred when calling  method : CreateVoiceApplication',reqId, ex);
            callback(ex,undefined);
        }

    }
    else
    {
        callback(new Error("Empty request or AppName is Undefined"),undefined);
    }


}

function AssignApplicationToDeveloper(App,Dev,reqId,callback) {
    if(!isNaN(App) && !isNaN(Dev) && App && Dev)
    {
        try{
            DbConn.Application.find({where: [{id: App}]}).then(function (resApp) {

                if (resApp)
                {
                    logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Application details found %s ',reqId,JSON.stringify(resApp), errApp);
                    DbConn.AppDeveloper.find({where: [{id: Dev}]}).then(function (resDev) {

                        if (resDev) {
                            logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Developer details found %s ',reqId,JSON.stringify(resDev), errApp);
                            resApp.setAppDeveloper(resDev).then(function (resMap) {

                                logger.info('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Mapping succeeded of Application %s with Developer %s',reqId,resApp.id,resDev.id);
                                callback(undefined, resMap);
                            }).catch(function (errMap) {
                                logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while mapping Application %s with Developer %s',reqId,resApp.id,resDev.id, errApp);
                                callback(errMap, undefined);
                            });


                        }
                        else {
                            logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - No record found for Application Developer %s ',reqId,Dev);
                            callback(new Error("No record found for AppDevelopers : "+Dev),undefined);
                        }

                    }).catch(function (errDev) {
                        logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while searching for records of Application Developer %s ',reqId,Dev, errApp);
                        callback(errDev, undefined);
                    });


                }
                else
                {
                    logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - No record found for Application  %s ',reqId,App);
                    callback(new Error("No record found for Application : "+App),undefined);
                }

            }).catch(function (errApp) {
                logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,App, errApp);
                callback(errApp,undefined);
            });




        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - Exception occurred when calling  method : AssignApplicationToDeveloper',reqId, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - AppID or DeveloperID undefined ');
        callback(new Error("AppID or DeveloperID undefined"),undefined);
    }

}

function PickDeveloperApplications(DevID,reqId,callback) {
    if(!isNaN(DevID)&&DevID)
    {
        try{
            DbConn.Application.findAll({where: [{AppDeveloperId: DevID}]}).then(function (resApp) {

                if(resApp.length>0) {
                    logger.info('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] - Application records found which are developed by  Application Developer %s',reqId,DevID);
                    callback(undefined, resApp);
                }
                else{
                    logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] -No application records found of Application Developer %s ',reqId,DevID);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {

                logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] - Error Occurred while searching Application Developer %s ',reqId,DevID, errApp);
                callback(errApp,undefined);

            });






        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - Exception occurred when calling  method : PickDeveloperApplications',reqId, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - DeveloperID is not in correct format',reqId);
        callback(new Error("DeveloperID is not in correct format"),undefined);
    }
}

function PickApplicationRecord(AppID,reqId,callback) {
    if(!isNaN(AppID)&& AppID)
    {
        try{
            DbConn.Application.find({where: [{id: AppID}]}).then(function (resApp) {

                if(resApp) {
                    logger.info('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - Record found for Application %s by Developer %s ',reqId,AppID);
                    callback(undefined, resApp);
                }
                else{
                    logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - No record found for Application %s by Developer %s ',reqId,AppID);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {
                logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - Error occurred while searching Application %s by Developer %s ',reqId,AppID, errApp);
                callback(errApp,undefined);
            });




        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Exception occurred when calling  method : PickApplicationRecord',reqId, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Application ID is not in correct format ',reqId);
        callback(new Error("Application ID is not in correct format"),undefined);
    }

}

function PickAllApplications(reqId,callback) {

    try{
        DbConn.Application.findAll().then(function (resApp) {

            if(resApp) {
                logger.info('[DVP-APPRegistry.PickAllApplications] - [%s] - [PGSQL] - Record found for Applications ',reqId);
                callback(undefined, resApp);
            }
            else{
                logger.error('[DVP-APPRegistry.PickAllApplications] - [%s] - [PGSQL] - No record found for Applications ',reqId);
                callback(new Error("No record Found"),undefined);
            }

        }).catch(function (errApp) {
            logger.error('[DVP-APPRegistry.PickAllApplications] - [%s] - [PGSQL] - Error occurred while searching Applications ',reqId);
            callback(errApp,undefined);
        });




    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - Exception occurred when calling  method : PickAllApplications',reqId, ex);
        callback(ex,undefined);
    }


}

function PickActiveApplications(status,reqId,callback) {

    try{
        DbConn.Application.findAll({where: [{Availability: status}]}).then(function (resApp) {

            if(resApp) {
                logger.info('[DVP-APPRegistry.PickActiveApplications] - [%s] - [PGSQL] - Record found for Active Applications ',reqId);
                callback(undefined, resApp);
            }
            else{
                logger.error('[DVP-APPRegistry.PickActiveApplications] - [%s] - [PGSQL] - No record found for Active Applications ',reqId);
                callback(new Error("No record Found"),undefined);
            }

        }).catch(function (errApp) {
            logger.error('[DVP-APPRegistry.PickActiveApplications] - [%s] - [PGSQL] - Error occurred while searching Active Applications ',reqId);
            callback(errApp,undefined);
        });




    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.PickActiveApplications] - [%s] - Exception occurred when calling  method : PickActiveApplications',reqId, ex);
        callback(ex,undefined);
    }


}

function DeleteApplication(AppId,reqId,callback) {
    if(!isNaN(AppId)&&AppId)
    {
        try
        {

            DbConn.Application.destroy({where: [{id: AppId}]}).then(function (resApp) {

                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.DeleteApplication] - [%s] - [PGSQL] - Deletion succeeded of Application %s - Result %s',reqId,AppId);
                    callback(undefined,resApp);
                }
                else
                {
                    logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {
                logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - [PGSQL] - Error occurred on deletion of Application %s',reqId,AppId, errApp);
                callback(errApp,undefined);
            });




        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - Exception occurred when calling  method : DeleteApplication %s',reqId,AppId, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - ApplicationID is undefined');
        callback(new Error("ApplicationID is undefined"),undefined);
    }


}

function ActivateApplication(AppId,status,reqId,callback) {
    if(!isNaN(AppId)&&AppId)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).then(function (resApp) {

                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Application %s is found',reqId,AppId);
                    resApp.update(
                        {
                            Availability: status

                        }
                    ).then(function (resUpdate) {

                            logger.info('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Availability is changed to %s of Application %s is found',reqId,status,AppId);
                            callback(undefined, resUpdate);

                        }).error(function (errUpdate) {
                            logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Error occurred while changing Availability to %s of Application %s',reqId,status, errUpdate);
                            callback(errUpdate,undefined);

                        });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - No record found for the Application %s',reqId,status,AppId);
                    callback(new Error("No record Found"),undefined);
                }


            }).catch(function (errApp) {

                logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,AppId, errApp);
                callback(errApp,undefined);



            });


        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - Exception occurred when calling method : ActivateApplication %s',reqId,status, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - ApplicationID is undefined');
        callback(new Error("ApplicationID is undefined"),undefined);
    }

}

function ModifyApplicationURL(AppId,VAPPObj,reqId,callback) {
    if(!isNaN(AppId)&&AppId&& VAPPObj)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).then(function (resApp) {

                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Record of  Application %s is found',reqId,AppId);
                    resApp.update(
                        {
                            Url: VAPPObj.Url

                        }
                    ).then(function (resUpdate) {

                            logger.info('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Url of Application %s is updated to %s is succeeded',reqId,AppId,VAPPObj.Url);
                            callback(undefined,resUpdate);

                        }).catch(function (errUpdate) {
                            logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Url updating is failed of Application %s' ,reqId,AppId, errUpdate);
                            callback(errUpdate,undefined);

                        });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - No record found for Application %s' ,reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {

                logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s' ,reqId,AppId, errApp);
                callback(errApp,undefined);

            });



        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Exception occurred when calling method : ModifyApplicationURL : id %s ' ,reqId,AppId,ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - Empty request recieved' ,reqId);
        callback(new Error("Empty request"),undefined);
    }

}

function TestApplication(AppId,reqId,callback) {
    if(!isNaN(AppId)&& AppId)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).then(function (resApp) {

                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Record found for Application %s ',reqId,AppId);


                    /*var options = {
                     hostname: resApp.Url

                     };
                     console.log(options.hostname);

                     var req = http.request(options, function(res) {
                     logger.info('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Response code of HTTp request  %s ',reqId,res.statusCode);
                     callback(undefined,res.statusCode);

                     res.setEncoding('utf8');
                     res.on('data', function (chunk) {
                     });
                     });

                     req.on('error', function(e) {

                     logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Error occurred while sending HTTP request to Application URL  %s ',reqId,resApp.Url, errApp);
                     callback(e.message,undefined);
                     });
                     req.end();*/


                    var options = {
                        url: resApp.Url,
                        headers: {
                            'authorization': ""
                        }
                    };


                    httpreq(options, function (error, response, body) {
                        console.log(JSON.stringify(response));

                        if(error)
                        {
                            console.log("gottah "+error);
                            logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Error occurred while sending HTTP request to Application URL  %s ',reqId,resApp.Url, error);

                                callback(error,undefined);

                        }
                        else
                        {
                            logger.info('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Response code of HTTp request  %s ',reqId,response.statusCode);
                            callback(undefined,response.statusCode);
                        }

                    })

                }
                else
                {
                    logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {
                logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Error occurred while searching Application %s ',reqId,AppId, errApp);
                callback(errApp,undefined);
            });



        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Exception occurred when calling method : TestApplication' ,reqId,ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Application Id is not in Correct format' ,reqId);
        callback(new Error("Application Id is not in Correct format"),undefined);
    }

}

function SetMasterApp(AppId,MasterId,reqId,callback) {
    if(!isNaN(AppId) && AppId && !isNaN(MasterId) && MasterId)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).then(function (resCApp) {

                if(resCApp)
                {

                    DbConn.Application.find({where: [{id: MasterId},{ObjClass:"SYSTEM"}]}).then(function(resMaster)
                    {
                        if(resMaster)
                        {
                            resCApp.setMasterApplication(resMaster).then(function (resMap) {

                                logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Assign succeeded of Application %s and Master Application %s ',reqId,AppId,MasterId);
                                callback(undefined,resMap);

                            }).catch(function (errMap) {
                                logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error searching Master Application %s of Object class = SYSTEM ',reqId,MasterId,errMap);
                                callback(errMap,undefined);
                            });


                        }
                        else
                        {
                            logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - No record found for MAster Application %s of Object class = SYSTEM ',reqId,MasterId);
                            callback(new Error("Invalid Master AppID"),undefined);
                        }
                    }).catch(function (errMaster) {
                        logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error found in searching Master Application %s of Object class = SYSTEM ',reqId,MasterId,errMaster);
                        callback(errMaster,undefined);
                    });


                }

                else
                {
                    logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - No record found for Child Application %s of Object class = SYSTEM ',reqId,AppId);
                    callback(new Error("No child Application Found"),undefined);
                }

            }).catch(function (errCApp) {

                logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error found in searching Application ',reqId,AppId,errCApp);
                callback(errCApp,undefined);

            });


        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Exception in Method starting ',reqId,ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.SetMasterApp] - [%s]  ChildAppID or MasterAPPID is Undefined');
        callback(new Error("ChildAppID or MasterAPPID is Undefined"),undefined);
    }


}


function UpdateAppData(AppId,updtObj,reqId,callback) {

    if(!isNaN(AppId)&&AppId&& updtObj)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).then(function (resApp) {

                if(resApp)
                {
                    logger.info('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] - Record of  Application %s is found',reqId,AppId);
                    resApp.updateAttributes(updtObj).then(function (resUpdate) {

                        logger.info('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] -  Application %s is updated ',reqId,AppId);
                        callback(undefined,resUpdate);

                    }).catch(function (errUpdate) {
                        logger.error('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] - Updating is failed of Application %s' ,reqId,AppId, errUpdate);
                        callback(errUpdate,undefined);

                    });

                }
                else
                {
                    logger.error('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] - No record found for Application %s' ,reqId,AppId);
                    callback(new Error("No record Found"),undefined);
                }

            }).catch(function (errApp) {

                logger.error('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s' ,reqId,AppId, errApp);
                callback(errApp,undefined);

            });



        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.UpdateAppData] - [%s] - [PGSQL] - Exception occurred when calling method : UpdateAppData : id %s ' ,reqId,AppId,ex);
            callback(ex,undefined);
        }
    }
    else
    {
        logger.error('[DVP-APPRegistry.UpdateAppData] - [%s] - Empty request received' ,reqId);
        callback(new Error("Empty request"),undefined);
    }

}

module.exports.CreateVoiceApplication = CreateVoiceApplication;
module.exports.AssignApplicationToDeveloper = AssignApplicationToDeveloper;
module.exports.PickDeveloperApplications = PickDeveloperApplications;
module.exports.PickApplicationRecord = PickApplicationRecord;
module.exports.DeleteApplication = DeleteApplication;
module.exports.ActivateApplication = ActivateApplication;
module.exports.ModifyApplicationURL = ModifyApplicationURL;
module.exports.TestApplication = TestApplication;
module.exports.SetMasterApp = SetMasterApp;
module.exports.PickAllApplications =PickAllApplications;
module.exports.PickActiveApplications=PickActiveApplications;
module.exports.UpdateAppData=UpdateAppData;

