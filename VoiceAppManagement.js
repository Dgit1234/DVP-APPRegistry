
/**
 * Created by pawan on 4/8/2015.
 */

var DbConn = require('DVP-DBModels');
//var messageFormatter = require('DVP-Common/CommonMessageGenerator/ClientMessageJsonFormatter.js');
var stringify = require('stringify');
var open = require('open');
var http=require('http');


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
                                ObjCategory: VAPPObj.ObjCategory,
                                Availability:VAPPObj.Availability

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

function FindAllVoiceAppRecords(VAPPObj,callback)
{
    try{
        DbConn.Application.findAll({where: [{AppDeveloperId: VAPPObj}]}).complete(function (err, Aobj) {

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

function FindVoiceAppRecordForID(VID,DEVID,callback)
{
    try{
        DbConn.Application.find({where: [{id: VID},{AppDeveloperId:DEVID}]}).complete(function (err, Aobj) {

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

function ChangeVoiceAppAvailability(VAPPObj,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: VAPPObj.VID},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {
            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {

                    Aobj.update(
                        {
                            Availability: VAPPObj.Availability

                        }
                    ).then(function (result) {

                            callback(undefined, JSON.stringify(result));

                        }).error(function (errz) {
                            console.log("Availability updation failed");

                            callback("Error Found : "+errz,undefined);

                        });

                }
                else
                {
                    callback('No record found',undefined);
                }
            }
        });
    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

function VoiceAppUrlModification(VAPPObj,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: VAPPObj.VID},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {
            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {

                    Aobj.update(
                        {
                            Url: VAPPObj.Url

                        }
                    ).then(function (result) {

                            callback(undefined, JSON.stringify(result));

                        }).error(function (errz) {
                            console.log("URL updation failed");

                            callback("Error Found : "+errz,undefined);

                        });

                }
                else
                {
                    callback('No record found',undefined);
                }
            }
        });
    }
    catch(ex)
    {
        callback(ex,undefined);
    }
}

function UrlChecker(VAPPObj,callback)
{
    try
    {
        DbConn.Application.find({where: [{id: VAPPObj.VID},{AppDeveloperId:VAPPObj.DevID}]}).complete(function (err, Aobj) {

            if(err)
            {
                callback(err,undefined);
            }
            else
            {
                if(Aobj)
                {

                    var options = {
                        hostname: Aobj.Url

                    };

                    var req = http.request(options, function(res) {
                        console.log('STATUS: ' + res.statusCode);
                        callback(undefined,res.statusCode);
                        //console.log('HEADERS: ' + JSON.stringify(res.headers));
                        res.setEncoding('utf8');
                        res.on('data', function (chunk) {
                            //console.log('BODY: ' + chunk);
                        });
                    });

                    req.on('error', function(e) {
                        console.log('problem with request: ' + e.message);
                        callback(e.message,undefined);
                    });
                    req.end();

                }
                else
                {
                    callback("No rec",undefined);
                }
            }

        });
    }
    catch(ex)
    {
        callback(ex,err);
    }
}



module.exports.AddNewVoiceAppRecord = AddNewVoiceAppRecord;
module.exports.MapDeveloperAndApplication = MapDeveloperAndApplication;
module.exports.FindAllVoiceAppRecords = FindAllVoiceAppRecords;
module.exports.FindVoiceAppRecordForID = FindVoiceAppRecordForID;
module.exports.DeleteVoiceAppRecord = DeleteVoiceAppRecord;
module.exports.ChangeVoiceAppAvailability = ChangeVoiceAppAvailability;
module.exports.VoiceAppUrlModification = VoiceAppUrlModification;
module.exports.UrlChecker = UrlChecker;

