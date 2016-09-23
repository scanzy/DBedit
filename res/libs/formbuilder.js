$.fn.extend({
    formbuilder: function(options) {

        //default options setup
        var options = defaultValues(options, {
            fields: { }, done: undefined, //loading finished callback
            cancel: undefined, save: { url: undefined, getpostdata: undefined, success: undefined, fail: undefined }, //buttons callbacks
            altbtn: { text: undefined, style: 'default', click: undefined }, //alt button (left aligned) 
            change: undefined, //called when some field is changed
            change_first: undefined, //called when some field is changed for the first time after form load 
            confirmExit: { enabled: false, msg: "Are you sure to leave the page?" } //are-you-sure exit no save prompt
        });

        //prepares are-you-sure functionality
        //adds event listener to show confirm dialog on page exit or cancel
        if (options.confirmExit.enabled) this.attr('data-confirm-exit-msg', options.confirmExit.msg);
                        
        //saves data and functions
        var builder = { root: this, options: options,

            //to get fields on rows (responsive)
            fieldWrapper: function(label, fieldHtml) {
                return '<div class="col-md-6 form-group-2"><div class="row">\
                    <label class="control-label col-lg-3 col-md-4 col-sm-3">' + label + '</label>\
                    <div class="col-lg-9 col-md-8 col-sm-9">' + fieldHtml + '</div></div></div>';
            },            

            //confirms exit if data not saved
            areYouSure: function(e) {

                //gets (translated) message from root attribute
                var msg = builder.root.attr('data-confirm-exit-msg'); 

                //returns message (thanks to CodeCaster on stackoverflow.com)
                (e || window.event).returnValue = msg; //Gecko + IE
                return msg; //Gecko + Webkit, Safari, Chrome etc. not supported in Firefox (shows default msg)
            },
           
            //creates scanzyform
            scanzyform: this.scanzyform({
                html: '<div class="form-horizontal"><div class="row form-field-root"></div>\
                       <div class="line"></div><div class="right form-btn-root"></div></div>',
                buttons: { 
                    altbtn: { html: (options.altbtn.text == undefined) ? '' : '<button class="left btn btn-' + options.altbtn.style + ' btn-lg">'
                        + options.altbtn.text + '</button>', click: options.altbtn.click //alt button
                    },
                    save: { html: '<button class="btn btn-lg btn-success form-save disabled">Save</button> ', 
                        click: function() { 

                            //prevents clicks if disabled
                            if (builder.root.find(".form-save").hasClass("disabled")) return;

                            //shows saving text on button and translates it
                            builder.root.find(".form-save").text('Saving...').translate(); 

                            //sends data to save (ajax post request)
                            ajax(options.save.url, options.save.getpostdata(builder.getdata()), function(response) {
                                window.removeEventListener('beforeunload', builder.areYouSure); //prevents confirm exit message from being showed
                                if (options.save != undefined) options.save.success(response); //post save callback
                            })              

                            //resets save button text and translates it
                            .always(function() { builder.root.find(".form-save").text('Save').translate(); }) 
                            .fail(function(a, b, c) { if (options.fail != undefined) options.save.fail(a, b, c); }); //post save fail callback                             
                        } 
                    },
                    separator: { html: '<span> </span>' }, cancel: { html: '<button class="btn btn-lg btn-default">Cancel</button> ', click: options.cancel }                    
                },
                types: { 
                    "string": { //simple text field
                        html: function(name, label, foptions) { return builder.fieldWrapper(label, '<input class="form-control" type="text" name="' + name + '">'); }, 
                        bind_change: function(name, func) { $("input[name='" + name + "']").on('input', func); },
                        options: { allowEmpty: true, unique: false }                                               
                    },
                    "text": { //text area
                        html: function(name, label, foptions) { return builder.fieldWrapper(label, '<textarea class="form-control vresize" stylecols="3" name="' + name + '">'); },
                        bind_change: function(name, func) { $("textarea[name='" + name + "']").on('input', func); },
                        options: { allowEmpty: true, unique: false } 
                    },
                    "int": { //integer field
                        html: function(name, label, foptions) {                             
                            var html = '<input class="form-control" type="number" name="' + name + '"';

                            //min max contraints  
                            if ('max' in foptions) html += 'max="' + foptions.max + '" '; 
                            if ('min' in foptions) html += 'min="' + foptions.min + '" ';

                            return builder.fieldWrapper(label, html + '>'); 
                        },
                        init_one: function(el, foptions) {

                            //basic options
                            var opts = { allowPlus: false, allowMinus: false, allowThouSep: false, allowDecSep: false, allowLeadingSpaces: true };

                            //gets max/min
                            if ('max' in foptions) opts.max = foptions.max;
                            if ('min' in foptions) opts.min = foptions.min;    
                            el.find("input").numeric(opts);
                        },
                        bind_change: function(name, func) { $("input[name='" + name + "']").on('input', func); },
                        options: { allowEmpty: true, unique: false } 
                    },
                    "bool": { //on/off toggle
                        html: function(name, label, foptions) {
                            var html = '<input class="form-control" type="checkbox" data-toggle="toggle" name="' + name + '"'; 

                            //custom styles and texts for on
                            if ('text' in foptions.on) html += 'data-on="' + foptions.on.text + '" ';
                            if ('style' in foptions.on) html += 'data-onstyle="' + foptions.on.style + '" ';

                            //custom styles and texts for off
                            if ('text' in foptions.off) html += 'data-off="' + foptions.off.text + '" ';
                            if ('style' in foptions.off) html += 'data-offstyle="' + foptions.off.style + '" ';

                            return builder.fieldWrapper(label, html + '>'); 
                        },
                        init_one: function(el) { el.find("input").bootstrapToggle(); },
                        bind_change: function(name, func) { $("input[name='" + name + "']").on('change', func); },
                        get: function(name) { return $("input[name='" + name + "']").prop('checked') ? 1 : 0; },
                        set: function(name, value) { $("input[name='" + name + "']").bootstrapToggle((value == 1) ? 'on' : 'off'); },
                        reset: function(name) { this.set(name, false); },
                        options: { on: { }, off: { } }
                    },
                    "select": { //dropdown select
                        html: function(name, label, foptions) {
                            var html = '<select class="form-control" name="' + name + '">';

                            //inserts options (also empty option)
                            if (foptions.allowEmpty) html += '<option value="">&lt;No selection&gt;</option>'; 
                            for(var opt in foptions.choices) html += '<option value="' + opt + '">' + foptions.choices[opt] + '</option>';

                            return builder.fieldWrapper(label, html + '</select>');
                        },
                        init_one: function(el) { el.find("select").selectpicker(); },
                        bind_change: function(name, func) { $("select[name='" + name + "']").on('changed.bs.select', func); },
                        get: function(name) { return $("select[name='" + name + "']").val(); },
                        set: function(name, value) { $("select[name='" + name + "']").selectpicker('val', value); },
                        reset: function(name) { this.set(name, $("select[name='" + name + "'] option").first().attr('value')); },
                        options: { choices: { }, allowEmpty: true }
                    },
                    "date": { //date field with picker
                        html: function(name, label, foptions) {
                            return builder.fieldWrapper(label, 
                            '<div class="input-group date" data-date-format="dd/mm/yyyy"><input type="text" class="form-control" name="' + name + '">\
                            <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');
                        },
                        init_one: function(el, foptions) { //inits date picker 
                            el.find("input").datepicker({ 
                                autoclose: true, language: (navigator.language || navigator.userLanguage).substr(0, 2), clearBtn: foptions.allowEmpty });
                        },
                        init_all_pre: function() { //loads date picker lang data
                            $.ajax({ url: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/locales/bootstrap-datepicker." 
                            + (navigator.language || navigator.userLanguage).substr(0, 2) + ".min.js", dataType: "script", cache: true });
                        },
                        bind_change: function(name, func) { $("input[name='" + name + "']").parent().on('changeDate', func); },
                        get: function(name) { 
                            var date = $("input[name='" + name + "']").parent().datepicker('getDate');
                            return (date == null) ? null : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate()); 
                        },
                        set: function(name, value) { 
                            var x = value.split("-"); //splits year, month and day
                            $("input[name='" + name + "']").parent().datepicker('setDate', new Date(x[0], x[1] - 1, x[2], 0, 0, 0, 0)); 
                        },
                        reset: function(name) { $("input[name='" + name + "']").parent().datepicker('update', ''); },
                        options: { allowEmpty: true, unique: false } 
                    }
                },
                change_first: function(name, e) {                     
                    builder.root.find(".form-save").removeClass('disabled'); //enables save button when something has been modified                    
                    window.addEventListener('beforeunload', builder.areYouSure); //enables confirm exit
                    if (options.change_first != undefined) options.change_first(name, e); //custom callback
                },                
                fields: options.fields, change: options.change, done: options.done //these are passed without modifications
            }),
            
            //gets data in array
            getdata: function() { return this.scanzyform.get(); }       
        };
        return builder.scanzyform.build();        
    }

    /*

    //TODO: we need something to provide support for errors/hints/constraints

    //shows invalid field message and icon
    function setInvalid(el, msg) {
        var parent = el.parents(".form-group-2");
        parent.addClass('has-error').addClass('has-feedback'); //red field
        $("<span class='glyphicon glyphicon-remove form-control-feedback'></span>").insertAfter(el); //icon
        el.parents(".form-group-2 .row > div").append("<label class='control-label label-hint'>" + msg + "</span>").translate(); //hint
    }

    //hides invalid field message and icon
    function setValid(el) {
        var parent = el.parents(".form-group-2");
        parent.removeClass('has-error').removeClass('has-feedback'); //normal field
        parent.find("span.glyphicon-remove").remove(); //icon
        parent.find("label.label-hint").remove(); //hint
    }

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

    //unique/empty check handlers
    function setCheckHandlers() {
        $('#entity-details [data-allow-empty="false"]').on('input', checkEmpty).each(checkEmpty);
        $('#entity-details [data-unique="true"]').on('input', checkUnique).each(checkUnique);
    }

    //snipped executed before saving data
    var fieldsOK = true; //scrolls to invalid fields if any
    $('#entity-details [data-allow-empty="false"], \
        #entity-details [data-unique="true"]').each(function() {
        if ($(this).parent(".form-group-2").hasClass('has-error')) {
            scrollToElement($(this).focus());
            fieldsOK = false; return false;
        }
    });
    if (!fieldsOK) return; //doesn't save if something not ok

    //scrolls to elements
    function scrollToElement(el) { $("html, body").animate({ scrollTop: el.offset().top - $(window).height() * 0.3 }, 700); }

    */
});