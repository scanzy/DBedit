requiredata.request('entityalias', function(alias) {   
    requiredata.request('typesdata', function(typesdata) {

        //fetches link types nav
        var linksnav = $("#links-nav").scanzyload({ 
            requiredata: { name: 'linktypesdata' }, request: { url: undefined }, //passive mode
            fetch: function(name, data) { 
                var linkedtype = (data.link1 == type) ? data.link2 : data.link1;
                return '<a class="btn btn-' + ((linkedtype == link) ? "primary" : "default" ) + '" data-toggle="tooltip" \
                        title="' + getAlias({ alias: alias }, { alias: alias }, data.description[type]) + '" \
                        href="./' + urlParams({type: type, id: id, link: linkedtype}) + '">' + typesdata[linkedtype].displayname + '</a> ';
            },
            error: $("#links-nav-load-error"), loading: $("#links-nav-loading"), retry: $("#links-nav-load-retry"),
            always: function () { 
                $('#links-nav [data-toggle="tooltip"]').tooltip(); //enables tooltips
                $('#links-nav').translate(); //translates
            } 
        }).loadItems();   

        //inits table
        requiredata.request('linktypedata', function(linktypedata) {
            requiredata.set('title', getAlias({ alias: alias }, { alias: alias }, linktypedata.description[type])); //sets title with linktype description            
            $("#links-table").loadLinksTable(link, linktypedata); //loads table
        });        
    });
}); 

//sets links count in title
requiredata.request('linksfitered-' + link, function(data) { $(".box.title h1").append(' <span class="badge badge-light">' + data.length + '</span>'); });