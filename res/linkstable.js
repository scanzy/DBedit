$.fn.extend({ //extends jquery    
    loadLinksTable: function(link, linktypedata) //loads links table
    {
        var root = this;
        requiredata.request('typesdata', function (typesdata) {
            requiredata.request('entityalias', function(alias) {

                var columns = { }; //gets columns
                var linkedcol = (linktypedata.link1 == type) ? "id2" : "id1";
                columns[linkedcol] = typesdata[link].displayone;
                for (var col in linktypedata.columns) 
                    columns[col] = ('shortname' in linktypedata.columns[col]) ? linktypedata.columns[col].shortname : linktypedata.columns[col].displayname;   

                //orderby object
                var orderby = ('orderby' in linktypedata) ? ((type in linktypedata.orderby) ? linktypedata.orderby[type] : undefined) : undefined; 

                var linkstable = root.scanzytable({
                    request: { url: "./apis/links/filter.php", data: { type: type, id: id, link: link } }, 
                    requiredata: { name: 'linksfitered-' + link }, columns: columns,
                    button: { 
                        show: true, text: getAlias({ alias: alias }, { alias: alias }, linktypedata.add[type]),
                        click: function() { changeUrl({ type: type, id: id, link: link, action: "edit" }); } 
                    }, 
                    sort: {  
                        enabled: (orderby != undefined), //sort options on data load
                        column: (orderby != undefined) ? orderby.column : undefined,
                        reverse: (orderby != undefined) ? orderby.reverse : false,
                        click: true //enables sort on th click
                    },    
                    search: { show: true, minRows: linktypedata.searchminrows },
                    fetch: {
                        rows: { 
                            start: function(x, data) { return '<tr data-link-id="' + data.id +'">'; },
                            click: function() { changeUrl({ type: type, id: id, link: link, linkid: $(this).attr('data-link-id'), action: "edit" }); },
                            hoverClass : 'hover' 
                        },
                        contents: function(col, data) { return raw2display(data, linktypedata.columns[col]); }
                    },
                    empty: getAlias({ alias: alias }, { alias: alias }, linktypedata.emptysethint[type])          
                });

                linkstable.loader.options.loading.show(); //shows loading hint
                
                //fetches table
                ajax("./apis/entities/aliases.php", { type: link }, function(linkedaliases) { 

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
    }
});