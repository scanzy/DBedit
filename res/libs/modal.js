
//shows a modal dialog
function showModal(html, size, setup, callback) {

    if ([ "xs", "sm", "md", "lg"].indexOf(size) == -1) size = "md"; //default fallback size is medium

    //inserts container
    var dialog = $('<div class="modal fade" role="dialog"><div class="modal-dialog modal-' + size + '">\
                       <div class="modal-content"></div></div></div>').appendTo("body");    
   
    dialog.find(".modal-content").html(html);  //inserts html
    if (setup != undefined) setup(dialog);     //does setup
    dialog.on("hidden.bs.modal", function() {  //inits callback
        if (callback != undefined) callback()
        dialog.remove();
    });                        
    return dialog.modal(); //shows modal
}

var confirmCallback = function() { }; //variable to store callback
var confirmResult = false; //variable to store result (ok/cancel)

//shows a confirm dialog
function showConfirm(html, size, callback, okstyle, cancelstyle, oktext, canceltext, title) {

    //default fallback styles
    var styles = [ "default", "danger", "success", "warning", "info", "primary", "link" ];
    if (styles.indexOf(okstyle) == -1) okstyle = styles[0];
    if (styles.indexOf(cancelstyle) == -1) cancelstyle = styles[0];

    //default fallback texts
    if (oktext == undefined) oktext = "OK";
    if (canceltext == undefined) canceltext = "Cancel";

    confirmCallback = callback; //binds callbacks
    return showModal((title == undefined) ? '' : 
        '<div class="modal-header"><button data-dismiss="modal" class="close">&times;</button><h2 class="title">' + title + '</h2></div>' +
        '<div class="modal-body">' + html + '</div>\
         <div class="modal-footer"> \
            <button type="button" class="btn btn-' + okstyle + ' confirm-ok" data-dismiss="modal">' + oktext + '</button> \
            <button type="button" class="btn btn-' + cancelstyle + ' confirm-cancel" data-dismiss="modal">' + canceltext + '</button> \
         </div>', size,
    function(root) { 
        root.translate(); //translates dialog
        root.find(".confirm-ok").click(function() { confirmResult = true; });
        root.find(".confirm-cancel").click(function() { confirmResult = false; });
    }, 
    function() { confirmCallback(confirmResult); }); //sends result
}