//shared js code for admin framework

//gets GET param from url
function GetParam(p) {                 
    var params = window.location.search.substring(1).split('&');
    for (var i = 0; i < params.length; i++)
        if (p == params[i].split('=')[0])
            return params[i].split('=')[1];
    return null;
}

//shows error popup (using messages.js)
function errorPopup(xhr, text, error) { showError("<strong>" + xhr.status + " " + error + ":</strong> " + xhr.responseText); }

//sends ajax post request showing popup on error
function ajax(url, data, callback) { 
    return $.post(url, data, function (data) { if (callback != undefined) callback(data); }).fail(errorPopup);
}

//logout button
$("#logout").click(function () { ajax("./apis/auth/logout.php", null, function () { window.location = "./login.php" }); });

//enables bootstrap tooltip
$(document).ready(function(){ $('[data-toggle="tooltip"]').tooltip(); });

//call this if you are the button you are clicking
function hideAllTooltips() { $('[data-toggle="tooltip"]').tooltip('hide'); }

//builds topbar with path
var el = $("#topbar .nav").prepend('<li><a href="./">' + document.title + '</a></li>');

      