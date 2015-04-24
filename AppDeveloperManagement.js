/**
 * Created by pawan on 4/8/2015.
 */
var DbConn = require('DVP-DBModels');
//var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var stringify = require('stringify');




function AddNewDeveloperRecord(DevObj,callback)
{
    try {
        DbConn.AppDeveloper.find({where: [{Username: DevObj.Username}]}).complete(function (err, Dobj) {
            if (err) {
                callback(err, undefined);
            }
            else {
                if (Dobj) {
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
                                CompanyId: DevObj.CompanyId,
                                TenantId: DevObj.TenantId,
                                ObjClass: DevObj.ObjClass,
                                ObjType: DevObj.ObjType,
                                ObjCategory: DevObj.ObjCategory,
                                RegDate: (new Date()).toString(),
                                RefId:DevObj.RefId,
                                Availability:DevObj.Availability
                            }
                        ).complete(function(err,result)

                            {
                                if(err)
                                {
                                    callback(err,undefined);
                                }
                                else
                                {
                                    callback(undefined,JSON.stringify(result));
                                }
                            });
                    }
                    catch(ex)
                    {
                        callback(ex,undefined);
                    }
                }
            }
        })
    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

module.exports.AddNewDeveloperRecord = AddNewDeveloperRecord;