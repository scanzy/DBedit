requiredata.request('typesdata', function (typesdata) {

    var html = ""; //loads fields
    for (var col in typesdata[type].columns) {
        html += '<div class="form-group"><label class="control-label col-sm-2" for="entity-details-' + col + '">' +
            typesdata[type].columns[col].displayname + ':</label><div class="col-sm-10">';

        //inserts fields
        switch (typesdata[type].columns[col].type) {

            case "varchar": case "int":
            html += '<input class="form-control" id="entity-details-' + col + '" name="' + col + '" \
                data-unique="' + typesdata[type].columns[col].unique + '" \
                data-allow-empty="' + typesdata[type].columns[col].allowempty + '" \
                type="' + ((typesdata[type].columns[col].type == "int") ? "number" : "text") + '">'; break;
        }
        html += '</div></div>'
    }
    $("#entity-details").html(html);

    translate($(".box.title h1").text((id != undefined) ? "Edit" : "New")[0]); //sets page title

    //if we are in edit mode
    if (id != undefined) { //loads current values
        requiredata.loadAjax('entitydata', { url: "./apis/entities/one.php", data: { type: type, id: id }, error: errorPopup});
        requiredata.request('entitydata', function (data) {
            for (var col in typesdata[type].columns) if (col in data)
                $("#entity-details-" + col).val(data[col]);
        });        
        $("#topbar-entity").addClass('active'); //selects alias in topbar
    } else $("#topbar-type").addClass('active'); //selects type in topbar

    //unload event listener (confirms exit if data not saved)
    function areYouSure(e) {

        //gets (translated) message from cancel button tag
        var msg = $("#details-cancel").attr('data-confirm-exit-msg'); 

        //returns message (thanks to CodeCaster on stackoverflow.com)
        (e || window.event).returnValue = msg; //Gecko + IE
        return msg; //Gecko + Webkit, Safari, Chrome etc. not supported in Firefox (shows default msg)
    }

    //buttons bindings
    $("#details-cancel").click(function() { changeUrl((id != undefined) ? { type: type, id: id } : { type: type }); }); //returns to entities or details page
    $("#details-save").click(function() { 

        //scrolls to invalid fields if any
        var fieldsOK = true;
        $('#entity-details input[data-allow-empty="false"], #entity-details input[data-unique="true"]').each(function() {
            if ($(this).parent().parent().hasClass('has-error')) {
                scrollToElement($(this).focus());
                fieldsOK = false; return false;
            }
        });
        if (!fieldsOK) return; //doesn't save if something not ok

        //shows saving text on button and translates it
        $(this).text('Saving...'); translate(document.getElementById('details-save')); 

        //collects data from input fields
        var data = { type: type, data: { }}; 
        if (id != undefined) data.id = id; //only if editing (not creating new entity)
        $("#entity-details input").each(function() { 

            switch($(this).attr('type'))
            {
                case "text": data.data[$(this).attr('name')] = $(this).val(); 
                case "number": data.data[$(this).attr('name')] = $(this).val();
            }
            
        });

        //saves data (ajax request)
        ajax("./apis/entities/edit.php", data, function(id) {
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

    //ensures int field has always int value
    $("input[type='number']").numeric();

    //checks if empty field
    function checkEmpty() {
        if ($(this).val().trim() == "") setInvalid($(this), "This field can't be empty");        
        else setValid($(this));
    }

    //checks if unique field
    function checkUnique() {
        var input = $(this);
        requiredata.request('uniquevalues', function(data) {
            if ($.inArray(input.val().trim(), data) != -1) 
                setInvalid(input, "This field can't have this value");
            else setValid(input);
        });
    }

    //shows invalid field message and icon
    function setInvalid(el, msg) {
        el.parent().parent().addClass('has-error').addClass('has-feedback'); //red field
        el.parent().append("<span class='glyphicon glyphicon-remove form-control-feedback'></span>"); //icon
        translate(el.parent().append("<label class='control-label label-hint'>" + msg + "</span>")[0]); //hint
    }

    //hides invalid field message and icon
    function setValid(el) {
        el.parent().parent().removeClass('has-error').removeClass('has-feedback'); //normal field
        el.parent().find("span.glyphicon-remove").remove(); //icon
        el.parent().find("label.label-hint").remove(); //hint
    }

    //unique/empty check handlers
    function setCheckHandlers() {
        $('#entity-details input[data-allow-empty="false"]').on('input', checkEmpty).each(checkEmpty);
        $('#entity-details input[data-unique="true"]').on('input', checkUnique).each(checkUnique);
    }

    //sets handlers 
    if (id != undefined) requiredata.request('entitydata', setCheckHandlers);
    else setCheckHandlers(); //if has to load data waits until loading complete

    //gets unique data
    var data = { type: type }; if (id != undefined) data.id = id;
    requiredata.loadAjax('uniquevalues', { url: "./apis/entities/uniques.php", data: data });
});