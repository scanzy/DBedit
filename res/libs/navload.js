$.fn.extend({
    navload: function (options) {

        //options default setup
        var options = defaultValues(options, {
            loadnow: { enabled: false, data: undefined },
            requiredata: { options: { }, name: 'navload-' + this.attr('id') },
            request: { url:'', data: {} },
            href: function() { return "#"; }, content: undefined, tooltip: undefined,
            activestyle: "primary", defaultstyle: "default", isactive: function() { return false; },                   
            empty: "No elements", loading: "Loading elements...",
            done: function() {}, fail: function() {}, always: function() {}
        });
        
        //adds main container and hidden texts for hints
        $('<div class="navload btn-multiline"></div><p class="no-items grey center">' + options.empty + '</p>\
            <p class="loading-items center grey">' + options.loading + '</p> \
            <div class="loading-items-error center">\
                <p class="grey">Error while loading data</p>\
                <button class="items-load-retry btn btn-default btn-sm">\
                <span class="glyphicon glyphicon-repeat"></span> <span>Retry</span></button></div>').appendTo(this).hide();
               
        //saves root, options and load items function
        var t = { root: this, options: options, loadItems: function (requestdata) {
                this.loader.loadItems(requestdata); //loads items
                return t; //returns obj nav ref
            } 
        };

        //inits loader
        t.loader = this.find(".navload").scanzyload({ request: options.request, requiredata: options.requiredata, loadnow: options.loadnow,           
            fetch: function (i, data) {

                //fetches link with style and href
                var html = '<a class="btn btn-' + ((options.isactive(i, data)) ? options.activestyle : options.defaultstyle) + '" \
                    href="' + options.href(i, data) + '"';
                
                //tooltip
                if (options.tooltip != undefined) html += ' data-toggle="tooltip" title="' + options.tooltip(i, data) + '"';
                
                //fetches content
                return html + '>' + ((options.content != undefined) ? options.content(i, data) : data) + "</a> "; 
            },
            loading: t.root.find(".loading-items"),
            error: t.root.find(".loading-items-error"),
            empty: t.root.find(".no-items"), 
            retry: t.root.find(".items-load-retry"),
            done: function() { 
                t.root.find(".navload").show(); //shows nav
                t.root.find('[data-toggle="tooltip"]').tooltip(); //enables tooltips
                if (options.done != undefined) options.done(); //done custom callback
            }
        });        
        
        return t; //returns loader object ref
    }
});