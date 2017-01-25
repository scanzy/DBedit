requiredata.request('entityalias', function(alias) {   
    requiredata.request('typesdata', function(typesdata) {

        //shows link types nav only if more than one
        requiredata.request('linktypesdata', function(linktypesdata) {
            if (Object.keys(linktypesdata).length > 1)
            {
                //gets title to append line and nav root 
                var title = $('.box.title').append('<div class="line"></div>');
                var navroot = $('<div id="links-nav" class="center"></div>').appendTo(title);

                //fetches link types nav
                var linksnav = navroot.navload({
                    requiredata: { name: 'linktypesdata' }, loadnow: { enabled: true }, request: { url: undefined }, //passive mode
                    href: function(i, data) { return './' + urlParams({ type: type, id: id, link: ((data.link1 == type) ? data.link2 : data.link1) }); },
                    tooltip: function(i, data) { return getAlias({ alias: alias }, { alias: alias }, data.description[type]); },
                    isactive: function(i, data) { return ((data.link1 == type) ? data.link2 : data.link1) == link },
                    content: function(i, data) { return typesdata[(data.link1 == type) ? data.link2 : data.link1].displayname; },
                    always: function () { $('#links-nav').translate(); } //translates
                });
            }
        });

        //inits table
        requiredata.request('linktypedata', function(linktypedata) {
            requiredata.set('title', getAlias({ alias: alias }, { alias: alias }, linktypedata.description[type])); //sets title with linktype description            
            $("#links-table").loadLinksTable(link, linktypedata); //loads table
        });        
    });
}); 

//sets links count in title
requiredata.request('linksfitered-' + link, function(data) { $(".box.title h1").append(' <span class="badge badge-light">' + data.length + '</span>'); });