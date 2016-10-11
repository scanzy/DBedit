//called on error
function err(msg) { 

    //sends ajax request to log error on server
    ajax("./errors/send.php" + urlParams({ err: msg }));

    //displays modal popup
    showConfirmEx('<h2 class="title">An error occurred</h2>', 
        '<p class="center"><span>If the problem persists try logging in again</span><br/><br/>' +
        '<button class="btn btn-sm btn-info confirm-logout"><span class="glyphicon glyphicon-user"></span> <span>Login again</span></button></p>',
        '<button class="confirm-ok btn btn-md btn-danger left" data-dismiss="modal">Continue</button>' +
        '<button class="confirm-cancel btn btn-success btn-md" data-dismiss="modal">Close</button>', "md", 
        function(x) { 
            if (x == false) window.location.href = $("#topbar .navbar-back").attr('href'); //goes back
            else 
                showConfirm('<p>If you choose to continue anyway you could loose your data.</p>', "md", function(x) { 
                    if (x == false) window.location.href = $("#topbar .navbar-back").attr('href'); //goes back
                }, "danger", "default", "Continue").translate();
        }
    ).translate().find(".confirm-logout").click(logout); //binds logout
}

//binds generic error handler
window.onerror = function(msg, source, lineno, colno, obj) { 
    window.onerror = null; //to avoid infinite loops

    //logs error in console
    var errstr = "Error in file " + source + ":" + lineno + ":" + colno + ": " + msg;
    console.log(errstr); console.log(obj);     

    err(errstr); //shows popup
} 

//checks entity type not found
if (type != undefined) requiredata.request('typesdata', function (data) { var t = type; if (!(t in data)) err("Entity type not found (type '" + type + "')"); });

//checks entity not found
if (id != undefined) requiredata.request('entitydata', function (data) { if (data == false) err("Entity not found (id '" + id + "')"); });

//checks link type not found
if (link != undefined) requiredata.request('typesdata', function (data) { if (!(link in data)) err("Link type not found (type '" + link + "')"); });

//checks link not found
if (linkid != undefined) requiredata.request('linkdata', function (data) { if (data == false) err("Link not found (linkid '" + linkid + "')"); });