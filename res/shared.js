//gets GET params from url
function GetParams() {
    var params = [];
    var paramsdata = window.location.search.substring(1).split('&');
    for (var i = 0; i < paramsdata.length; i++) {
        var pdata = paramsdata[i].split('=');
        params[pdata[0]] = pdata[1];
    }            
    return params;
}

//gets GET param from url
function GetParam(p) {                 
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++)
        if (p == params[i].split('=')[0])
            return params[i].split('=')[1];
    return undefined;
}

//writes a get search string to append to urls from params data object
function urlParams(params)
{
    var s = "?"; 
    for (var name in params) s += encodeURIComponent(name) + "=" + encodeURIComponent(params[name]) + "&";
    return s.slice(0, -1); //removes ? or last &
}

//redirects changing get params
function changeUrl(params){ window.location.href = "./" + urlParams(params); }

//shows error popup (using messages.js)
function errorPopup(xhr, text, error) { showError("<strong>" + xhr.status + " " + error + ":</strong> " + xhr.responseText); }

//sends ajax post request showing popup on error
function ajax(url, data, callback) { 
    return $.post(url, data, function (data) { if (callback != undefined) callback(data); }).fail(errorPopup);
}

//stores params
var params = GetParams();
var type = params['type'];
var id = params['id'];
var link = params['link'];
var action = params['action'];

//logout button
$("#logout").click(function () { sessionStorage.clear(); //erases session data
    ajax("./apis/auth/logout.php", null, function () { window.location = "./login.php" }); });

//enables bootstrap tooltip
$(document).ready(function(){ $('[data-toggle="tooltip"]').tooltip(); });

//call this if you are the button you are clicking
function hideAllTooltips() { $('[data-toggle="tooltip"]').tooltip('hide'); } 

//scrolls to elements
function scrollToElement(el) { $("html, body").animate({ scrollTop: el.offset().top - $(window).height() * 0.3 }, 700); }

//sets requiredata options
requiredata.options('userdata', { useSessionStorage: true });
requiredata.options('typesdata', { useSessionStorage: true });

//and loads data if needed
requiredata.loadAjax('userdata', { url: "./apis/auth/info.php" }); //gets data about users
requiredata.loadAjax('typesdata', { url: "./apis/entitytypes/get.php" }); //gets data about entities

//sets topbar elements  
$("#topbar-title").text(document.title).removeClass('hidden'); //sets title in topbar

//sets user name in topbar
requiredata.request('userdata', function (data) { $("#topbar-user").text(data.name + ' ' + data.surname); });

//shows type in topbar
if (type != undefined) requiredata.request('typesdata', function(typesdata) {      
    $("#topbar-type").text(typesdata[type].displayname).attr('href', './' + urlParams({ type: type })).removeClass('hidden');

    //gets display name for this entity
    requiredata.request('entitydata', function (data) {
        var alias = typesdata[type].alias; 
        for (var col in typesdata[type].columns) alias = alias.replace("%" + col + "%", data[col]);
        requiredata.set('entityalias', alias); //and saves it
    });
});

//shows entity alias in topbar
if (id != undefined) requiredata.request('entityalias', function(alias) {       
    $("#topbar-entity").text(alias).attr('href', './' + urlParams({ type: type, id: id })).removeClass('hidden');
});