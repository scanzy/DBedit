//gets GET params from url
function GetParams() {
    var params = [];
    var paramsdata = window.location.search.substring(1).split('&');
    for (var i = 0; i < paramsdata.length; i++) {
        var pdata = paramsdata[i].split('=');
        params[pdata[0]] = decodeURIComponent(pdata[1]);
    }            
    return params;
}

//gets GET param from url
function GetParam(p) {                 
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++)
        if (p == params[i].split('=')[0])
            return decodeURIComponent(params[i].split('=')[1]);
    return undefined;
}

//stores params
var params = GetParams();
var type = params['type'];
var id = params['id'];
var link = params['link'];
var linkid = params['linkid'];
var action = params['action'];

//writes a get search string to append to urls from params data object
function urlParams(params)
{
    var s = "?"; 
    for (var name in params) s += encodeURIComponent(name) + "=" + encodeURIComponent(params[name]) + "&";
    return s.slice(0, -1); //removes ? or last &
}

//redirects changing get params
function changeUrl(backparams){ window.location.href = "./" + urlParams(backparams); }

//goes back
function goBack() { requiredata.request('backpage', function(params) { changeUrl(params); }); }

//shows error popup (using messages.js)
function errorPopup(xhr, text, error) { showError("<strong>" + xhr.status + " " + error + ":</strong> " + xhr.responseText); }

//sends ajax post request showing popup on error
function ajax(url, data, callback) { 
    return $.post(url, data, function (data) { if (callback != undefined) callback(data); }).fail(errorPopup);
}

//gets display content from raw data
function raw2display(data, colinfo)
{
    switch(colinfo.type) {
        case "date": return data.split("-").reverse().join("/");
        case "bool": 
            var style = 'default';
            if (data == "1") {
                data = ('text' in colinfo.on) ? colinfo.on.text : "On"; 
                if ('style' in colinfo.on) style = colinfo.on.style;                 
            }
            else if ('off' in colinfo) {
                data = ('text' in colinfo.off) ? colinfo.off.text : "Off"; 
                if ('style' in colinfo.off) style = colinfo.off.style;   
            } 
            return '<span class="label label-' + style + '">' + data + '</span>';
                                    
        case "select": 
            if (data == "") return "";
            return '<span class="label label-' + 
                (('style' in colinfo.options[data]) ? colinfo.options[data].style : "default") + 
                '">' + colinfo.options[data].text + '</span>';
    }
    return data;
}