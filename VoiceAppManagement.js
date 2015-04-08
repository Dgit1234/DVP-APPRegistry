/**
 * Created by pawan on 4/8/2015.
 */

var DbConn = require('./DVP-DBModels');
var messageFormatter = require('./DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var stringify = require('stringify');


function AddNewVoiceAppRecord(VAPPObj,callback)
{
    try {
        DbConn.Application.find({where: [{AppName: VAPPObj.AppName}]}).complete(function (err, Aobj) {
            if (err) {
                callback(err, undefined);
            }
            else {
                if (Aobj) {
                    callback('Username is Already taken', undefined);
                }
                else {
                    try {
                        DbConn.Application.create(
                            {
                                AppName: VAPPObj.AppName,
                                Description: VAPPObj.Description,
                                Url: VAPPObj.Url,
                                CompanyId: VAPPObj.CompanyId,
                                TenantId: VAPPObj.TenantId,
                                ObjClass: VAPPObj.ObjClass,
                                ObjType: VAPPObj.ObjType,
                                ObjCategory: VAPPObj.ObjCategory

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

function MapDeveloperAndApplication(MapObj,callback)
{
    try{
        DbConn.Application.find({where: [{id: MapObj.Appid}]}).complete(function (err, Aobj) {

            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                DbConn.AppDeveloper.find({where: [{id: MapObj.Devid}]}).complete(function (errz, Dobj)
                {
                    if(errz)
                    {
                        callback(err,undefined)

                    }
                    else
                    {
                        //Dobj.addApplication(Aobj).complete(function (errx, MapRes)
                        Aobj.setAppDeveloper(Dobj).complete(function (errx, MapRes)
                        {
                            if(errx)
                            {
                                callback(errx,undefined);
                            }
                            else
                            {
                                callback(undefined,"Success");
                            }
                        })
                    }

                });
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

