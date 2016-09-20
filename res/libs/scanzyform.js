$.fn.extend({
    scanzyform: function(options) {

        //default options setup
        var options = defaultValues(options, { 
            html: "<form><div class='form-field-root'></div><br/><div class='form-btn-root'></div></form>", //main form html
            selectors: { fields: ".form-field-root", buttons: ".form-btn-root" }, //fields and buttons root selectors
            buttons: { }, types: { }, fields: { }, //form structure data (fields)
            done: undefined, //loading finished callback
            change: undefined, //called when some field is changed
            change_first: undefined //called at first field modification
        });

        for (var name in options.buttons) //buttons options setup
            options.buttons[name] = defaultValues(options.buttons[name], { 
                html: "<button>" + name + "</button>", //button html
                ref: undefined, //button reference (jQuery obj)
                click: undefined //button callback
            });

        for (var type in options.types) //field types options setup
            options.types[type] = defaultValues(options.types[type], {
                html: function(name, label) { return "<div><label>" + label + "</label><input name='" + name + "' type='text'></div>"; },
                init_one: undefined, init_all: undefined, reset: function(name) { this.set(name, ""); }, //initialization callbacks
                set: function(name, value) { $("input[name='" + name + "']").val(value); }, //used to set value
                get: function(name) { return $("input[name='" + name + "']").val(); }, //used to get value
                bind_change: function(name, func) { $("input[name='" + name + "']").on('input', func); }, //sets change handler
                change: undefined, //field changed callback
                options: { } //field default options (customizable)
            });

        for (var fieldname in options.fields) //fields names/data options setup
            options.fields[fieldname] = defaultValues(options.fields[fieldname], { 
                label: fieldname.charAt(0).toUpperCase() + fieldname.slice(1) + ":",
                type: undefined, value: undefined, ref: undefined, //field reference (jQuery obj)
                change: undefined, //changed callback
                options: options.types[options.fields[fieldname].type].options //field default options
            });

        var f = { root: this, options: options, //saves data

            build: function() {
                
                this.root.empty().append($(options.html)).hide().fadeIn("slow"); //form html setup
                
                //inits field types (pre)
                for(var type in options.types) if (options.types[type].init_all_pre != undefined) options.types[type].init_all_pre();

                //inserts fields (with individual setup)
                var fieldroot = this.root.find(options.selectors.fields); 
                for(var name in options.fields) {

                    var field = options.fields[name]; //gets field
                    var type = options.types[field.type]; //gets type info
                    field.ref = $(type.html(name, field.label, field.options)).appendTo(fieldroot).hide().fadeIn("slow"); //appends new field

                    if (type.init_one != undefined) type.init_one(field.ref, field.options); //inits field
                }

                //inits field types (post)
                for(var type in options.types) if (options.types[type].init_all_post != undefined) options.types[type].init_all_post();

                //inserts buttons and adds callbacks
                var btnroot = this.root.find(options.selectors.buttons); 
                for(var name in options.buttons) {

                    var btn = options.buttons[name]; //gets btn
                    btn.ref = $(btn.html).appendTo(btnroot).hide().fadeIn("slow"); //inserts it

                    if (btn.click != undefined) btn.ref.click(btn.click); //binds click callback
                }            
                
                //sets values
                for(var name in options.fields) {
                    var field = options.fields[name]; //gets field
                    if (field.value != undefined) options.types[field.type].set(name, field.value); //sets if found
                    else options.types[field.type].reset(name); //resets if not found
                }

                //binds change callbacks
                for(var name in options.fields) {
                    var field = options.fields[name]; //gets field
                    var type = options.types[field.type]; //and type
                    type.bind_change(name, function(e) { 
                        
                        //custom callbacks
                        if (field.change != undefined) field.change(e); 
                        if (type.change != undefined) type.change(name, e); 
                        if (options.change != undefined) options.change(name, e);
                        if (f.notYetChanged) if (options.change_first != undefined) options.change_first(name, e);

                        f.notYetChanged = false; //now form has been changed
                    });
                }
                
                if (options.done != undefined) options.done(this); //done
                return this; //returns builder
            },

            notYetChanged: true, //flag to remember if form has been changed after load
            
            //sets/resets fields values
            set: function(values) { for(var name in values) options.types[options.fields[name].type].set(name, values[name]); },
            reset: function() { for(var name in options.fields) options.types[options.fields[name].type].reset(); },

            //gets fields values
            get: function() {
                var data = {};
                for(var name in options.fields) data[name] = options.types[options.fields[name].type].get(name);
                return data;
            }
        };

        return f; //return builder ref
    }
});