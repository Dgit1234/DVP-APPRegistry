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
            else {
                if (Aobj)
                {
                    DbConn.AppDeveloper.find({where: [{id: MapObj.Devid}]}).complete(function (errz, Dobj) {
                        if (errz) {
                            callback(err, undefined)

                        }
                        else {
                            if (Dobj) {
                                //Dobj.addApplication(Aobj).complete(function (errx, MapRes)
                                Aobj.setAppDeveloper(Dobj).complete(function (errx, MapRes) {
                                    if (errx) {
                                        callback(errx, undefined);
                                    }
                                    else {
                                        callback(undefined, "Success");
                                    }
                                })
                            }
                            else {
                                callback("No record found for AppDevelopers : "+MapObj.Devid);
                            }
                        }

                    });
                }
                else
                {
                    callback("No record found for Application : "+MapObj.Appid);
                }
            }


        });
    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

function FindAllVoiceAppRecords(callback)
{
    try{
        DbConn.Application.findAll().complete(function (err, Aobj) {

            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                if(Aobj.length>0) {
                    callback(undefined, JSON.stringify(Aobj));
                }
                else{
                    callback("No record Found",undefined);
                }
            }

        });

    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

function FindVoiceAppRecordForID(VID,callback)
{
    try{
        DbConn.Application.find({where: [{id: VID}]}).complete(function (err, Aobj) {

            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                if(Aobj) {
                    callback(undefined, JSON.stringify(Aobj));
                }
                else{
                    callback("No record Found",undefined);
                }
            }

        });

    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

function DeleteVoiceAppRecord(VAPPObj,callback)
{
    try
    {
        DbConn.Application.find().complete(function (err, Aobj) {

            if(err)
            {
                callback(err,undefined);

            }
            else
            {
                DbConn.Application.destroy({where: [{id: VAPPObj.id}]}).complete(function(err,result)
                {
                    if(err)
                    {
                        callback(err,undefined);
                    }
                    else
                    {
                        if(result)
                        {
                            callback(undefined,result);
                        }
                        else
                        {
                            callback("No record found",undefined);
                        }
                    }
                })
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
module.exports.FindVoiceAppRecordForID = FindVoiceAppRecordForID;
module.exports.DeleteVoiceAppRecord = DeleteVoiceAppRecord;

