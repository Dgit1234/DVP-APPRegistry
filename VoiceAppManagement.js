
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


function CreateVoiceApplication(VAPPObj,reqId,callback)
{
    if(VAPPObj && VAPPObj.AppName)
    {
        try {

            var ObjClass="";
            DbConn.Application.find({where: [{AppName: VAPPObj.AppName}]}).complete(function (errApp, resApp) {
                if (errApp) {
                    logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,VAPPObj.AppName, errApp);
                    callback(errApp, undefined);
                }
                else {
                    if (resApp) {
                        logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - VioceApp Name %s is already taken',reqId,VAPPObj.AppName);
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
                                        logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - New Voice App record %s insertion failed',reqId,JSON.stringify(VAPPObj), errAppSave);
                                        callback(errAppSave,undefined);
                                    }
                                    else
                                    {
                                        logger.info('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - New Voice App record insertion succeeded. Result - %s ',reqId, errAppSave);
                                        callback(undefined,resAppSave);
                                    }
                                });
                        }
                        catch(ex)
                        {
                            logger.error('[DVP-APPRegistry.CreateVoiceApplication] - [%s] - [PGSQL] - Exception in insertion of New Voice App record %s ',reqId,JSON.stringify(VAPPObj), ex);
                            callback(ex,undefined);
                        }
                    }
                }
            })
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

function AssignApplicationToDeveloper(App,Dev,reqId,callback)
{
   if(!isNaN(App) && !isNaN(Dev) && App && Dev)
   {
       try{
           DbConn.Application.find({where: [{id: App}]}).complete(function (errApp, resApp) {

               if(errApp)
               {
                   logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,App, errApp);
                   callback(errApp,undefined);
               }
               else {
                   if (resApp)
                   {
                       logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Application details found %s ',reqId,JSON.stringify(resApp), errApp);
                       DbConn.AppDeveloper.find({where: [{id: Dev}]}).complete(function (errDev, resDev) {
                           if (errDev)
                           {
                               logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while searching for records of Application Developer %s ',reqId,Dev, errApp);
                               callback(errApp, undefined)

                           }
                           else {
                               if (resDev) {
                                   logger.debug('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Developer details found %s ',reqId,JSON.stringify(resDev), errApp);
                                   resApp.setAppDeveloper(resDev).complete(function (errMap, resMap) {
                                       if (errMap) {
                                           logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Error occurred while mapping Application %s with Developer %s',reqId,resApp.id,resDev.id, errApp);
                                           callback(errMap, undefined);
                                       }
                                       else {
                                           logger.info('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - Mapping succeeded of Application %s with Developer %s',reqId,resApp.id,resDev.id);
                                           callback(undefined, resMap);
                                       }
                                   })
                               }
                               else {
                                   logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - No record found for Application Developer %s ',reqId,Dev);
                                   callback(new Error("No record found for AppDevelopers : "+Dev),undefined);
                               }
                           }

                       });
                   }
                   else
                   {
                       logger.error('[DVP-APPRegistry.AssignApplicationToDeveloper] - [%s] - [PGSQL] - No record found for Application  %s ',reqId,App);
                       callback(new Error("No record found for Application : "+App),undefined);
                   }
               }


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

function PickDeveloperApplications(DevID,reqId,callback)
{
if(!isNaN(DevID))
{
    try{
        DbConn.Application.findAll({where: [{AppDeveloperId: DevID}]}).complete(function (errApp, resApp) {

            if(errApp)
            {
                logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] - Error Occurred while searching Application Developer %s ',reqId,DevID, errApp);
                callback(errApp,undefined);
            }
            else
            {
                if(resApp.length>0) {
                    logger.info('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] - Application records found which are developed by  Application Developer %s',reqId,DevID);
                    callback(undefined, JSON.stringify(resApp));
                }
                else{
                    logger.error('[DVP-APPRegistry.PickDeveloperApplications] - [%s] - [PGSQL] -No application records found of Application Developer %s ',reqId,DevID);
                    callback(new Error("No record Found"),undefined);
                }
            }

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

function PickApplicationRecord(AppID,reqId,callback)
{
    if(!isNaN(AppID))
    {
        try{
            DbConn.Application.find({where: [{id: AppID}]}).complete(function (errApp, resApp) {

                if(errApp)
                {
                    logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - Error occurred while searching Application %s by Developer %s ',reqId,AppID, errApp);
                    callback(errApp,undefined);
                }
                else
                {
                    if(resApp) {
                        logger.info('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - Record found for Application %s by Developer %s ',reqId,AppID);
                        callback(undefined, JSON.stringify(resApp));
                    }
                    else{
                        logger.error('[DVP-APPRegistry.PickApplicationRecord] - [%s] - [PGSQL] - No record found for Application %s by Developer %s ',reqId,AppID);
                        callback(new Error("No record Found"),undefined);
                    }
                }

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

function DeleteApplication(AppId,reqId,callback)
{
  if(!isNaN(AppId))
  {
      try
      {

          DbConn.Application.destroy({where: [{id: AppId}]}).complete(function(errApp,resApp)
          {
              if(errApp)
              {
                  logger.error('[DVP-APPRegistry.DeleteApplication] - [%s] - [PGSQL] - Error occurred on deletion of Application %s',reqId,AppId, errApp);
                  callback(errApp,undefined);
              }
              else
              {
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
              }
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

function ActivateApplication(AppId,status,reqId,callback)
{
    if(!isNaN(AppId))
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).complete(function (errApp, resApp) {
                if(errApp)
                {
                    logger.error('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s ',reqId,AppId, errApp);
                    callback(errApp,undefined);
                }
                else
                {
                    if(resApp)
                    {
                        logger.info('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Application %s is found',reqId,AppId);
                        resApp.update(
                            {
                                Availability: status

                            }
                        ).then(function (resUpdate) {

                                logger.info('[DVP-APPRegistry.ActivateApplication] - [%s] - [PGSQL] - Availability is changed to %s of Application %s is found',reqId,status,AppId);
                                callback(undefined, JSON.stringify(resUpdate));

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
                }
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

function ModifyApplicationURL(AppId,VAPPObj,reqId,callback)
{
    if(!isNaN(VAPPObj))
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (errApp, resApp) {
                if(errApp)
                {
                    logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Error occurred while searching for records of Application %s' ,reqId,AppId, errApp);
                    callback(errApp,undefined);
                }
                else
                {
                    if(resApp)
                    {
                        logger.info('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Record of  Application %s is found',reqId,AppId);
                        resApp.update(
                            {
                                Url: VAPPObj.Url

                            }
                        ).then(function (resUpdate) {

                                logger.info('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Url of Application %s is updated to %s is succeeded',reqId,AppId,VAPPObj.Url);
                                callback(undefined, JSON.stringify(resUpdate));

                            }).error(function (errUpdate) {
                                logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - Url updating is failed of Application %s' ,reqId,AppId, errUpdate);
                                callback(errUpdate,undefined);

                            });

                    }
                    else
                    {
                        logger.error('[DVP-APPRegistry.ModifyApplicationURL] - [%s] - [PGSQL] - No record found for Application %s' ,reqId,AppId);
                        callback(new Error("No record Found"),undefined);
                    }
                }
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
        callback(new Error("Empty request"),undefined);
    }

}

function TestApplication(AppId,reqId,callback)
{
    if(!isNaN(AppId))
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).complete(function (errApp, resApp) {

                if(errApp)
                {
                    logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Error occurred while searching Application %s ',reqId,AppId, errApp);
                    callback(errApp,undefined);
                }
                else
                {
                    if(resApp)
                    {
                        logger.info('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - Record found for Application %s ',reqId,AppId, errApp);
                        var options = {
                            hostname: resApp.Url

                        };

                        var req = http.request(options, function(res) {
                            logger.info('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Response code of HTTp request  %s ',reqId,res.statusCode);
                            callback(undefined,res.statusCode);

                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                            });
                        });

                        req.on('error', function(e) {
                            //console.log('problem with request: ' + e.message);
                            logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [HTTP] - Error occurred while sending HTTP request to Application URL  %s ',reqId,resApp.Url, errApp);
                            callback(e.message,undefined);
                        });
                        req.end();

                    }
                    else
                    {
                        logger.error('[DVP-APPRegistry.TestApplication] - [%s] - [PGSQL] - No record found for Application %s ',reqId,AppId);
                        callback(new Error("No record Found"),undefined);
                    }
                }

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

function SetMasterApp(AppId,MasterId,reqId,callback)
{
    if(!isNaN(AppId) && AppId && !isNaN(MasterId) && MasterId)
    {
        try
        {
            DbConn.Application.find({where: [{id: AppId}]}).complete(function (errCApp, resCApp) {
                if(errCApp)
                {
                    logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error found in searching Application %s ',reqId,AppId,errCApp);
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
                                logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error found in searching Master Application %s of Object class = SYSTEM ',reqId,MasterId,errMaster);
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
                                            logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Error searching Master Application %s of Object class = SYSTEM ',reqId,MasterId,errMaster);
                                            callback(errMap,undefined);
                                        }
                                        else
                                        {
                                            logger.debug('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - Assign succeeded of Application %s and Master Application %s ',reqId,AppId,MasterId);
                                            callback(undefined,resMap);
                                        }
                                    });
                                }
                                else
                                {
                                    logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - No record found for MAster Application %s of Object class = SYSTEM ',reqId,MasterId);
                                    callback(new Error("Invalid Master AppID"),undefined);
                                }
                            }

                        });

                    }

                    else
                    {
                        logger.error('[DVP-APPRegistry.SetMasterApp] - [%s] - [PGSQL] - No record found for Child Application %s of Object class = SYSTEM ',reqId,AppId);
                        callback(new Error("No child Application Found"),undefined);
                    }
                }
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


module.exports.CreateVoiceApplication = CreateVoiceApplication;
module.exports.AssignApplicationToDeveloper = AssignApplicationToDeveloper;
module.exports.PickDeveloperApplications = PickDeveloperApplications;
module.exports.PickApplicationRecord = PickApplicationRecord;
module.exports.DeleteApplication = DeleteApplication;
module.exports.ActivateApplication = ActivateApplication;
module.exports.ModifyApplicationURL = ModifyApplicationURL;
module.exports.TestApplication = TestApplication;
module.exports.SetMasterApp = SetMasterApp;

