//called on error
function err(urlobj, msg) { urlobj.action = "error"; urlobj.err = msg; changeUrl(urlobj); window.onerror = null; throw new Error(msg); }

//binds generic error handler
window.onerror = function(msg, source, lineno, colno, obj) { 
    var errstr = "Error in file " + source + ":" + lineno + ":" + colno + ": " + msg;
    console.log(errstr); console.log(obj); //logs error
    changeUrl({ action: "error", err: errstr }); 
} 

//checks entity type not found
if (type != undefined)
    requiredata.request('typesdata', function (data) { var t = type; if (!(t in data)) err({}, "Entity type not found (type '" + type + "')"); });

//checks entity not found
if (id != undefined)
    requiredata.request('entitydata', function (data) { if (data == false) err({ type: type }, "Entity not found (id '" + id + "')"); });

//checks link type not found
if (link != undefined)
    requiredata.request('typesdata', function (data) { if (!(link in data)) err({ type: type, id: id }, "Link type not found (type '" + link + "')"); });

//checks link not found
if (linkid != undefined)
    requiredata.request('linkdata', function (data) { if (data == false) err({ type: type, id: id, link: link }, "Link not found (linkid '" + linkid + "')"); });