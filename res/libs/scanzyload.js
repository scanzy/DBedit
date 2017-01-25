
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
            loadnow: { enabled: false, data: undefined },
            request: { url: undefined, data: { } }, processResponse: undefined, fetch: function() { }, 
            requiredata: { options: { }, name: 'scanzyload-' + this.attr('id') },
            loading: { show: function() { }, hide: function() { } },
            error: { show: function() { }, hide: function() { } },
            empty: { show: function() { }, hide: function() { } },
            retry: { click: function() { } },
            done: function() {}, fail: function() {}, always: function() {}
        });

        //saves element root, options and load items function
        var x = { root: this, options: options, 

            //fetches items
            fetchItems: function(data) { 

                //saves original data from request (cloning array or object)
                if ($.isArray(data)) x.data = data.slice(0); 
                else { x.data = {}; for(var i in data) x.data[i] = data[i]; }

                //performs response processing if needed
                if (options.processResponse != undefined) data = options.processResponse(data);                

                //checks empty                       
                if (data != null && data != "") {
                    if (data instanceof Object) {
                        if (Object.keys(data).length <= 0) { options.empty.show("fade"); return; }
                    }
                    else if (data instanceof Array)
                        if (data.length <= 0) { options.empty.show("fade"); return; }
                }
                else { options.empty.show("fade"); return; }

                var html = ""; //fetches data
                for (var i in data) html += options.fetch(i, data[i]);

                $(html).hide("fade").appendTo(x.root.empty()).fadeIn("slow"); //and adds html to page               
                options.done(); //callback                    
            },
            
            //post-fetch (hides loading)
            postFetch: function() { options.loading.hide(); options.always(); },

            //loads items
            loadItems: function (requestdata) {

                //shows loading, hides error/empty
                options.loading.show();
                options.error.hide();
                options.empty.hide();

                //passive mode (does not perform ajax request)
                if (options.request.url == undefined) { 
                    requiredata.request(options.requiredata.name, function(data) { 
                        x.fetchItems(data), x.postFetch(); 
                    }); 
                    return; 
                }

                //loads request data
                if (requestdata == undefined) requestdata = options.request.data;
                else //uses data passed as param to update data stored in object
                    for (var i in options.request.data) //skips already present params
                        if (!(i in requestdata)) requestdata[i] = options.request.data[i];                

                //sets requiredata options and sends request
                requiredata.options(options.requiredata.name, options.requiredata.options);
                requiredata.loadAjax(options.requiredata.name, {url: options.request.url, data: requestdata})
                .done(x.fetchItems) //fetches items 
                .fail(function () { options.error.show("fade"); options.fail(); }) //shows error
                .always(x.postFetch); //hides loading
            }
        };

        //binds retry button
        options.retry.click(function(){ x.loadItems(); }); 
       
        if (options.loadnow.enabled) x.loadItems(options.loadnow.data);  //load now if needed
        return x; //returns scanzyload object ref
    }
});