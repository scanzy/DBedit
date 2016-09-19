//shows message
function showMsg(msg, type)
{
    if (type == undefined) type = "success"; //fallback type

    //inserts container if needed 
    if ($("#messages").length <= 0) $("body").append("<div id='messages' style='position:fixed;bottom:0;text-align:center;width:100%;padding: 0 1em;'></div>");
    
    //appends new message and sets timer to fade it out
    $('<div class="alert alert-' + type + ' fade in"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + msg + '</div>')
    .appendTo('#messages').delay(3000).fadeOut(3000, function() { $(this).remove(); if ($("#messages").children().length <= 0) $("#messages").remove(); }); 
}

//different message types (colors)
function showError(msg){ showMsg(msg, "danger"); }
function showWarning(msg){ showMsg(msg, "warning"); }
function showInfo(msg){ showMsg(msg, "info"); }