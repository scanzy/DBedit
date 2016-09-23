//called on error
function err(urlobj, msg) { urlobj.action = "error"; changeUrl(urlobj); window.onerror = null; throw new Error(msg); }

//binds generic error handler
window.onerror = function() { changeUrl({ action: "error" }); } 

//checks entity type not found
if (type != undefined)
    requiredata.request('typesdata', function (data) { var t = type; if (!(t in data)) err({ action: "error" }, "Entity type not found"); });

//checks entity not found
if (id != undefined)
    requiredata.request('entitydata', function (data) { if (data == false) err({ type: type, action: "error" }, "Entity not found"); });

//checks link type not found
if (link != undefined)
    requiredata.request('typesdata', function (data) { if (!(link in data)) err({ type: type, id: id, action: "error" }, "Link type not found"); });

//checks link not found
if (linkid != undefined)
    requiredata.request('linkdata', function (data) { if (data == false) err({ type: type, id: id, link: link, action: "error" }, "Link not found"); });