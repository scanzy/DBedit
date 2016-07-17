
//adds missing functions/objects to some object, following proto structure
function defaultValues(data, proto)
{
    //loops through all properties
    for(var i in proto)
    {        
        if (!(i in data)) data[i] = proto[i]; //copies default proto value/object if not found        
        if (proto[i] instanceof Object) data[i] = defaultValues(data[i], proto[i]); //recursively sets defaults                    
    }
    return data; //returns modified data
}

$.fn.extend({ //extends jquery 
    scanzyload: function (options) {

        //options default setup
        var options = defaultValues(options, {
            request: { url:'', data: {} }, fetch: function () { }, 
            requiredata: { options: { }, name: 'scanzyload-' + this.attr('id') },
            loading: { show: function () { }, hide: function () { } },
            error: { show: function () { }, hide: function () { } },
            empty: { show: function () { }, hide: function () { } },
            done: function() {}, fail: function() {}, always: function() {}
        });

        //saves element root, options and load items function
        var x = { root: this, options: options, loadItems: function (requestdata) {
            var root = this.root;

            //loads request data
            if (requestdata == undefined) requestdata = options.request.data;
            else //uses data passed as param to update data stored in object
                for (var i in options.request.data) //skips already present params
                    if (!(i in requestdata)) requestdata[i] = options.request.data[i];

            //shows loading, hides error/empty
            options.loading.show();
            options.error.hide();
            options.empty.hide();

            //sets requiredata options and sends request
            requiredata.options(options.requiredata.name, options.requiredata.options);
            requiredata.loadAjax(options.requiredata.name, {url: options.request.url, data: requestdata})
            .done(function (data) {

                //checks empty                       
                if (data != null && data != "") {
                    if (data instanceof Object) {
                        if (Object.keys(data).length <= 0) { options.empty.show(); return; }
                    }
                    else if (data instanceof Array)
                        if (data.length <= 0) { options.empty.show(); return; }
                }
                else { options.empty.show(); return; }

                var html = ""; //fetches data
                for (var i in data) html += options.fetch(i, data[i]);

                root.html(html); //and adds html to page
                options.done(); //callback
            })
            .fail(function () { options.error.show(); options.fail(); }) //shows error
            .always(function () { options.loading.hide(); options.always(); }); //hides loading
        }
        };
        return x; //returns scanzyload object ref
    }
});