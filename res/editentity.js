requiredata.request('typesdata', function (typesdata) {

    var html = ""; //loads fields
    for (var col in typesdata[type].columns) {

        //saves column info
        var colinfo = typesdata[type].columns[col];

        //inserts container and label 
        html += '<div class="col-md-6 form-group-2"><div class="row">\
            <label class="control-label col-lg-3 col-md-4 col-sm-3">' + colinfo.displayname + ':</label>\
            <div class="col-lg-9 col-md-8 col-sm-9">';

        //inserts fields
        switch(colinfo.type) {

            case "varchar": case "int": case "bool": //inserts fields specifying type
                html += '<input class="form-control" id="entity-details-' + col + '" name="' + col + '" \
                    data-unique="' + colinfo.unique + '" data-allow-empty="' + colinfo.allowempty + '" ';
                
                //sets other attributes
                switch(colinfo.type) {
                    case "varchar": html += 'type="text" '; break;

                    case "int":     
                        html += 'type="number" '; //min max contraints                        
                        if ('max' in colinfo) html += 'max="' + colinfo.max + '" ';
                        if ('min' in colinfo) html += 'min="' + colinfo.min + '" ';
                    break;

                    case "bool": 
                        html += ' type="checkbox" data-toggle="toggle"'; 

                        //custom styles and texts for on
                        if ('text' in colinfo.on) html += 'data-on="' + colinfo.on.text + '" ';
                        if ('style' in colinfo.on) html += 'data-onstyle="' + colinfo.on.style + '" ';

                        //custom styles and texts for off
                        if ('text' in colinfo.off) html += 'data-off="' + colinfo.off.text + '" ';
                        if ('style' in colinfo.off) html += 'data-offstyle="' + colinfo.off.style + '" ';
                    break;
                }
                html += ">";
            break;

            case "date": //inserts picker                 
                html += '<div class="input-group date">\
                    <input type="text" class="form-control" id="entity-details-' + col + '" name="' + col + '" \
                    data-unique="' + colinfo.unique + '" data-allow-empty="' + colinfo.allowempty + '">\
                    <div class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></div></div>';
            break;

            case "select": //inserts select
                html += '<select class="selectpicker form-control" id="entity-details-' + col + '" name="' + col + '" \
                    data-unique="' + colinfo.unique + '" data-allow-empty="' + colinfo.allowempty + '">';
                html += '<option value="">&lt;No selection&gt;</option>';
                for(var opt in colinfo.options) 
                    html += '<option value="' + opt + '">' + colinfo.options[opt].text + '</option>';
                html += '</select>';
            break;
        }

        html += '</div></div></div>'
    }
    $("#entity-details").html(html);

    //sets page title
    $(".box.title h1").text((id != undefined) ? typesdata[type]['edit'] : typesdata[type]['new']); 

    //sets input handler to enable buttons on input change
    function detectChanges() 
    {
        //binds changes of datepicker, select and toggle to input
        $(".input-group.date").on('changeDate', function() { $(this).find('input').trigger('input'); });
        $(".selectpicker").on('changed.bs.select', function() { $(this).trigger('input'); });
        $("input[type='checkbox']").on('change', function() { $(this).trigger('input'); });
        
        //enables buttons when something has been modified
        $("#entity-details input, #entity-details select").one('input', function() {
            $("#details-cancel").removeClass('disabled');
            $("#details-save").removeClass('disabled');

            //adds event listener to show confirm dialog on page exit or cancel
            window.addEventListener('beforeunload', areYouSure);
        }); 
    }

    //if we are in edit mode
    if (id != undefined) { //loads current values
        requiredata.loadAjax('entitydata', { url: "./apis/entities/one.php", data: { type: type, id: id }, error: errorPopup});
        requiredata.request('entitydata', function (data) { 
                        
            for (var col in typesdata[type].columns) //for each column
                if (col in data) if (data[col] != null && data[col] != "") //checks empty

                    switch(typesdata[type].columns[col].type) { //switches type                        
                        case "date": $("#entity-details-" + col).val(data[col].date2str()); break;
                        case "bool": if (data[col] != "0") $("#entity-details-" + col).bootstrapToggle('on'); break;
                        default: $("#entity-details-" + col).val(data[col]); break;
                    }
            
            detectChanges(); //once data is loaded we can detect changes
        });        
        $("#topbar-entity").addClass('active'); //selects alias in topbar
    }
    else {
        $("#topbar-type").addClass('active'); //selects type in topbar
        detectChanges(); //we can detect changes since we have no data to load
    }

    //ensures int field has always int value (and inside bounds)
    $("input[type='number']").each(function() {        
        
        var opts = {}; //gets colinfo to set max/min
        var colinfo = typesdata[type].columns[$(this).attr('name')];        
        if ('max' in colinfo) html += ' max="' + colinfo.max + '"';
        if ('min' in colinfo) html += ' min="' + colinfo.min + '"';    
        $(this).numeric(opts);
    });

    //loads date picker lang data
    var langcode = (navigator.language || navigator.userLanguage).substr(0, 2);
    $.ajax({ url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/locales/bootstrap-datepicker." + langcode + ".min.js",
        dataType: "script", cache: true, 
    }).always(function() { 
        $(".input-group.date").each(function() { 
            $(this).datepicker({ 
                autoclose: true, language: langcode, //and inits picker
                clearBtn: typesdata[type].columns[$(this).find("input").attr('name')].allowEmpty 
            });
        }); 
    });

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
        
        var fieldsOK = true; //scrolls to invalid fields if any
        $('#entity-details [data-allow-empty="false"], \
           #entity-details [data-unique="true"]').each(function() {
            if ($(this).parent(".form-group-2").hasClass('has-error')) {
                scrollToElement($(this).focus());
                fieldsOK = false; return false;
            }
        });
        if (!fieldsOK) return; //doesn't save if something not ok

        //shows saving text on button and translates it
        $(this).text('Saving...'); translate(document.getElementById('details-save')); 

        //collects data from input fields and selects
        var data = { type: type, data: { }}; 
        if (id != undefined) data.id = id; //only if editing (not creating new entity)
        $("#entity-details input, #entity-details select").each(function() { 

            //gets input value
            var col = $(this).attr('name');
            data.data[col] = $(this).val(); 

            //converts types if needed
            switch(typesdata[type].columns[col].type) {
                case "date": data.data[col] = data.data[col].str2date(); break;
                case "bool": data.data[col] = $(this).prop('checked') ? "1" : "0"; 
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
        var parent = el.parents(".form-group-2");
        parent.addClass('has-error').addClass('has-feedback'); //red field
        $("<span class='glyphicon glyphicon-remove form-control-feedback'></span>").insertAfter(el); //icon
        translate(el.parents(".form-group-2 .row > div").append("<label class='control-label label-hint'>" + msg + "</span>")[0]); //hint
    }

    //hides invalid field message and icon
    function setValid(el) {
        var parent = el.parents(".form-group-2");
        parent.removeClass('has-error').removeClass('has-feedback'); //normal field
        parent.find("span.glyphicon-remove").remove(); //icon
        parent.find("label.label-hint").remove(); //hint
    }

    //unique/empty check handlers
    function setCheckHandlers() {
        $('#entity-details [data-allow-empty="false"]').on('input', checkEmpty).each(checkEmpty);
        $('#entity-details [data-unique="true"]').on('input', checkUnique).each(checkUnique);
    }

    //sets handlers 
    if (id != undefined) requiredata.request('entitydata', setCheckHandlers);
    else setCheckHandlers(); //if has to load data waits until loading complete

    //gets unique data
    var data = { type: type }; if (id != undefined) data.id = id;
    requiredata.loadAjax('uniquevalues', { url: "./apis/entities/uniques.php", data: data });
});