
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
var type = GetParam('type');
var id = GetParam('id');
var link = GetParam('link');
var action = GetParam('action');

//gets userdata and sets user name in topbar
requiredata.options.useSessionStorage = true;
requiredata.load('userdata', function() { 
    ajax("./apis/auth/info.php", null, function(data) { requiredata.set('userdata', data); }).fail(errorPopup);
});
requiredata.request('userdata', function (data) { $("#topbar-user").text(data.name + ' ' + data.surname); });

//logout button
$("#logout").click(function () { sessionStorage.clear(); //erases session data
    ajax("./apis/auth/logout.php", null, function () { window.location = "./login.php" }); });

//enables bootstrap tooltip
$(document).ready(function(){ $('[data-toggle="tooltip"]').tooltip(); });

//call this if you are the button you are clicking
function hideAllTooltips() { $('[data-toggle="tooltip"]').tooltip('hide'); }

//sets title in topbar
$("#topbar-title").text(document.title).removeClass('hidden');

//gets data about entities
requiredata.load('typesdata', function () {
    ajax("./apis/entitytypes/get.php", null, function(data) { requiredata.set('typesdata', data); }).fail(errorPopup);
});