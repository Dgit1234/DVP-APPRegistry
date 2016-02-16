/**
 * Created by pawan on 4/8/2015.
 */
var DbConn = require('dvp-dbmodels');
var stringify = require('stringify');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');


function CreateDeveloper(DevObj,Company,Tenant,reqId,callback) {
    if(DevObj && DevObj.Username)
    {
        try {
            DbConn.AppDeveloper.find({where: [{Username: DevObj.Username},{CompanyId:Company},{TenantId:Tenant}]}).then(function (resDev) {

                if (resDev) {
                    logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - [PGSQL] - Developer Username %s is already taken',reqId,DevObj.Username);
                    callback(new Error('Username is Already taken'), undefined);
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
                                CompanyId: Company,
                                TenantId:Tenant,
                                RegDate: (new Date()).toString(),
                                RefId:DevObj.RefId,
                                Availability:DevObj.Availability
                            }
                        ).then(function (resDevSave) {

                                logger.debug('[DVP-APPRegistry.CreateDeveloper] - [%s] - [PGSQL] - New Developer record insertion succeeded.',reqId);
                                callback(undefined,resDevSave);

                            }).catch(function (errDevSave) {
                                logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - [PGSQL] - New Developer record  insertion failed', reqId,errDevSave);
                                callback(errDevSave,undefined);
                            });


                          
                    }
                    catch(ex)
                    {
                        logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - [PGSQL] - Exception in insertion of New Developer record %s ',reqId,JSON.stringify(DevObj), ex);
                        callback(ex,undefined);
                    }
                }

            }).catch(function (errDev) {

                logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - [PGSQL] - Error occurred find records of Developer %s ',reqId,DevObj.Username, errDev);
                callback(errDev, undefined);

            });


        }
        catch(ex)
        {
            logger.error('[DVP-APPRegistry.CreateDeveloper] - [%s] - Exception in calling  method : CreateDeveloper',reqId, ex);
            callback(ex,undefined);
        }
    }
    else
    {
        callback(new Error("Empty request or Developer Username is Undefined"),undefined);
    }

}

module.exports.CreateDeveloper = CreateDeveloper;
