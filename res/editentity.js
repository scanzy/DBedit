requiredata.request('typesdata', function (typesdata) {

    var html = ""; //loads fields
    for (var col in typesdata[type].columns) {
        html += '<div class="form-group"><label class="control-label col-sm-2" for="entity-details-' + col + '">' +
            typesdata[type].columns[col].displayname + ':</label><div class="col-sm-10">';

        //inserts fields
        switch (typesdata[type].columns[col].type) {

            case "varchar": html += '<input class="form-control" id="entity-details-' + col + '" name="' + col + '" type="text">'; break;
            case "int":     html += '<input class="form-control" id="entity-details-' + col + '" name="' + col + '" type="number" >'; break;
        }
        html += '</div></div>'
    }
    $("#entity-details").html(html);

    //if we are in edit mode
    if (id != undefined) { //loads current values
        $.ajax("./apis/entities/one.php" + urlParams({ type: type, id: id })).fail(errorPopup).success(function (data) {
            for (var col in typesdata[type].columns) if (col in data)
                $("#entity-details-" + col).val(data[col]);
        });
    }

    //unload event listener (confirms exit if data not saved)
    function areYouSure(e) {

        //gets (translated) message from cancel button tag
        var msg = $("#details-cancel").attr('data-confirm-exit-msg'); 

        //returns message (thanks to CodeCaster on stackoverflow.com)
        (e || window.event).returnValue = msg; //Gecko + IE
        return msg; //Gecko + Webkit, Safari, Chrome etc. not supported in Firefox (shows default msg)
    }

    //buttons bindings
    $("#details-cancel").click(function() { changeUrl({ type: type, id: id }); }); //returns to details page
    $("#details-save").click(function() { 

        //shows saving text on button and translates it
        $(this).text('Saving...'); translate(document.getElementById('details-save')); 

        //collects data from input fields
        var data = { type: type, data: { }}; 
        if (id != undefined) data.id = id; //only if editing (not creating new entity)
        $("#entity-details input").each(function() { data.data[$(this).attr('name')] = $(this).val(); });

        //saves data (ajax request)
        ajax("./apis/entities/edit.php", data, function() {
            window.removeEventListener('beforeunload', areYouSure); //prevents confirm message from being showed
            changeUrl({ type: type, id: id }); //redirects to details page
        })
        .fail(function() { //resets save button text and translates it
            $("#details-save").text('Save'); 
            translate(document.getElementById('details-save')); 
        }); 
    });

    //sets exit confim message in attribute of cancel button (so it can be translated)
    $("#details-cancel").attr('data-confirm-exit-msg', (id != undefined) ?
        "Are you sure you want to exit without saving? Changes will be lost" :
        "Are you sure you want to exit without saving? New inserted data will be lost");

    //enables buttons when something has been modified
    $("#entity-details input").one('input', function() {
        $("#details-cancel").removeClass('disabled');
        $("#details-save").removeClass('disabled');

        //adds event listener to show confirm dialog on page exit or cancel
        window.addEventListener('beforeunload', areYouSure);
    });
});