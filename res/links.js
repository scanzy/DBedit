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
            
            var columns = { }; //gets columns
            var linkedcol = (linktypedata.link1 == type) ? "id2" : "id1";
            columns[linkedcol] = typesdata[link].displayone;
            for (var col in linktypedata.columns) columns[col] = linktypedata.columns[col].displayname;   

            var linkstable = $("#links-table").scanzytable({
                request: { url: "./apis/links/filter.php", data: { type: type, id: id, link: link } }, 
                requiredata: { name: 'linksfitered' }, columns: columns,
                button: { 
                    show: true, text: getAlias({ alias: alias }, { alias: alias }, linktypedata.add[type]),
                    click: function() { changeUrl({ type: type, id: id, link: link, action: "edit" }); } 
                }, 
                search: { show: true, minRows: linktypedata.searchminrows },
                fetch: {
                    rows: { 
                        start: function(x, data) { return '<tr data-link-id="' + data.id +'">'; },
                        click: function() { changeUrl({ type: type, id: id, link: link, linkid: $(this).attr('data-link-id'), action: "edit" }); },
                        hoverClass : 'hover' 
                    },
                    contents: function(col, data) { return raw2display(data, typedata.columns[col]); }
                }            
            });

            linkstable.loader.options.loading.show(); //shows loading hint
            
            //fetches table
            requiredata.request('linkedaliases', function(linkedaliases) { 

                //gets aliases
                function aliasPlaceholder(x, id) { 
                    if (x != linkedcol) return ""; //skips if not right col
                    for (var i in linkedaliases) //finds alias
                        if (linkedaliases[i].id == id) return linkedaliases[i].alias;
                    return "Unknown"; //fallback
                }

                //sets alias funcs and loads items
                linkstable.options.fetch.content.id1 = aliasPlaceholder;
                linkstable.options.fetch.content.id2 = aliasPlaceholder;
                linkstable.loadItems();    
            });        
        });
    });
});

//requests aliases (for table) and gets current (to set topbar and title)
requiredata.loadAjax('linkedaliases', { url: "./apis/entities/aliases.php", data: { type: link } });     

//sets links count in title
requiredata.request('linksfitered', function(data) { $(".box.title h1").append(' <span class="badge badge-light">' + data.length + '</span>'); });
