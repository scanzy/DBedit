
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
function showConfirm(html, size, callback) {
    confirmCallback = callback; //binds callbacks
    return showModal('<div class="modal-body">' + html + '</div>\
                <div class="modal-footer"> \
                    <button type="button" class="btn btn-default confirm-ok" data-dismiss="modal">OK</button> \
                    <button type="button" class="btn btn-default confirm-cancel" data-dismiss="modal">Cancel</button> \
                </div>', size,
    function(root) { 
        root.translate(); //translates dialog
        root.find(".confirm-ok").click(function() { confirmResult = true; });
        root.find(".confirm-cancel").click(function() { confirmResult = false; });
    }, 
    function() { confirmCallback(confirmResult); }); //sends result
}