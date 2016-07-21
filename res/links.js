requiredata.request('typesdata', function(typesdata){

    //fetches link types nav
    var linksnav = $("#links-nav").scanzyload({ 
        requiredata: { name: 'linksdata' }, 
        request: { url: "./apis/linktypes/get.php", data: { type: type } },
        fetch: function(name, data) { 
            var linkedtype = (data.link1 == type) ? data.link2 : data.link1;
            return '<a class="btn btn-' + ((linkedtype == link) ? "primary" : "default" ) + '" data-toggle="tooltip" title="' + data.description + '"' +
                '" href="./' + urlParams({type: type, id: id, link: linkedtype}) + '">' + typesdata[linkedtype].displayname + '</a> ';
        },
        error: $("#links-nav-load-error"), loading: $("#links-nav-loading"), retry: $("#links-nav-load-retry"),
        always: function () { 
            $('#links-nav [data-toggle="tooltip"]').tooltip(); //enables tooltips
            translate(document.getElementById("links-nav")); //translates
        } 
    }).loadItems();

    //fetches table
    requiredata.request('linksdata', function(linksdata) {    
       
        //gets linktype info
        linktype = undefined;
        for(var i in linksdata) 
            if (((linksdata[i].link1 == type) && (linksdata[i].link2 == link))
             || ((linksdata[i].link2 == type) && (linksdata[i].link1 == link)))
                { linktype = linksdata[i]; break; }

        var columns = { }; //gets columns
        columns[(linksdata[i].link1 == type) ? "id2" : "id1"] = typesdata[link].displayone;
        for (var col in linktype.columns) columns[col] = linktype.columns[col].displayname;
        
        columns["-"] = ""; //linked/unlinked button column

        //uses this and then loads aliases
        function aliasPlaceholder(x, id) { return '<td data-entity-id="' + id + '">'; }

        var linkstable = $("#links-table").scanzytable({
            request: { url: "./apis/links/filter.php", data: { type: type, id: id, link: link } },
            requiredata: { name: 'links' }, columns: columns,
            button: { show: true, click: function() { }}, search: { show: true },
            fetch: {
                rows: { 
                    start: function(x, data) { return '<tr data-link-id="' + data.id +'">'; },
                    hoverClass : 'hover' 
                },
                cell: { 
                    id1: { start: aliasPlaceholder }, id2: { start: aliasPlaceholder }, 
                    "-": { start: function() { return "<td class='right'>"; } }
                },
                content: { id1: function() {}, id2: function() {}, "-": function() {
                    return "<button class='btn btn-success btn-xs linked'>" + linktype.linked +"</button>";
                }}
            }            
        }).loadItems();
        
        //after table and aliasesloaded
        requiredata.request('links', function(links) {            
            requiredata.request('linkedaliases', function(aliases) {

            //sets entity aliases in table
            $("[data-entity-id]").each(function() {
                $(this).text(aliases[$(this).attr("data-entity-id")]);
            });

            //adds rows for unlinked items
            for(var id in aliases)
                if ($("#links-table td[data-entity-id='" + id + "']").length <= 0)
                    $("#links-table tbody").append("<tr>\
                    <td colspan='" + (Object.keys(columns).length - 1) + "' data-entity-id='" + id + "'>" + aliases[id] + "</td>\
                    <td class='right'><button class='btn btn-danger btn-xs unlinked'>" + linktype.unlinked + "</button></td></tr>");
                });

            //adds handler for link/unlink button
            $(".linked").on('click', function() { 
                ajax("./apis/links/link.php" + urlParams({}), function() { document.location.reload(true); });
            });
            $(".unlinked").on('click', function() { 
                ajax("./apis/links/unlink.php" + urlParams({}), function() { document.location.reload(true); });
            });
        });
    });
});

//requests aliases (for table) and gets current (to set topbar and title)
requiredata.loadAjax('linkedaliases', { url: "./apis/entities/aliases.php", data: { type: link } });     

//sets title and request entity data to get entity alias
requiredata.loadAjax('entitydata', { url: "./apis/entities/one.php", data: { type: type, id: id }});
requiredata.request('entityalias', function(alias) { $(".box.title h1").text(alias); });

//selects link in topbar
$("#topbar-link").addClass('active');
