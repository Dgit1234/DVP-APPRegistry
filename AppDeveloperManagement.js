/**
 * Created by pawan on 4/8/2015.
 */
var DbConn = require('DVP-DBModels');
//var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var stringify = require('stringify');
var logger = require('DVP-Common/LogHandler/CommonLogHandler.js').logger;




function AddNewDeveloperRecord(DevObj,reqId,callback)
{
    try {
        DbConn.AppDeveloper.find({where: [{Username: DevObj.Username}]}).complete(function (err, Dobj) {
            if (err) {
                logger.error('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [PGSQL] - Error occurred find records of Developer %s ',reqId,DevObj.Username, err);
                callback(err, undefined);
            }
            else {
                if (Dobj) {
                    logger.error('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [PGSQL] - Developer Username %s is already taken',reqId,DevObj.Username);
                    callback('Username is Already taken', undefined);
                }
                else {
                    try {
                        DbConn.AppDeveloper.create(
                            {
                                Username: DevObj.Username,
                                Password: DevObj.Password,
                                Email:DevObj.Email,
                                Phone:DevObj.Phone,
                                ObjClass: "OBJCLZ",
                                ObjType: "OBJTYP",
                                ObjCategory: "OBJCAT",
                                CompanyId: 1,
                                TenantId: 1,
                                RegDate: (new Date()).toString(),
                                RefId:DevObj.RefId,
                                Availability:DevObj.Availability
                            }
                        ).complete(function(err,result)

                            {
                                if(err)
                                {
                                    logger.error('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [PGSQL] - New Developer record %s insertion failed',reqId,JSON.stringify(DevObj), err);
                                    callback(err,undefined);
                                }
                                else
                                {
                                    logger.debug('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [PGSQL] - New Developer record insertion succeeded. Result - %s',reqId,JSON.stringify(result), err);
                                    callback(undefined,JSON.stringify(result));
                                }
                            });
                    }
                    catch(ex)
                    {
                        logger.error('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - [PGSQL] - Exception in insertion of New Developer record %s ',reqId,JSON.stringify(DevObj), ex);
                        callback(ex,undefined);
                    }
                }
            }
        })
    }
    catch(ex)
    {
        logger.error('[DVP-APPRegistry.AddNewDeveloperRecord] - [%s] - Exception in calling  method : AddNewDeveloperRecord',reqId, ex);
        callback(ex,undefined);
    }
}

module.exports.AddNewDeveloperRecord = AddNewDeveloperRecord;