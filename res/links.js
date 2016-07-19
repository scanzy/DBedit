requiredata.request('typesdata', function(typesdata){

    //fetches link types nav
    var linksnav = $("#links-nav").scanzyload({ 
        requiredata: { name: 'linksdata' }, 
        request: { url: "./apis/linktypes/get.php", data: { type:type } },
        fetch: function(name, data) { 
            var linkedtype = (data.link1 == type) ? data.link2 : data.link1;
            return '<a class="btn btn-' + ((name == link) ? "primary" : "default" ) + '" data-toggle="tooltip" title="' + data.description + '"' +
                '" href="./' + urlParams({type: type, id: id, link: name}) + '">' + typesdata[linkedtype].displayname + '</a> ';
        },
        error: $("#links-nav-load-error"), loading: $("#links-nav-loading"), retry: $("#links-nav-load-retry"),
        always: function () { 
            $('#links-nav [data-toggle="tooltip"]').tooltip(); //enables tooltips
            translate(document.getElementById("links-nav")); //translates
        } 
    }).loadItems();

    //fetches table
    requiredata.request('linksdata', function(linksdata) {    
       
        var columns = {}; //gets columns
        if (linksdata[link].link1 == type) columns["id2"] = typesdata[linksdata[link].link2].displayone;
        for (var col in linksdata[link].columns) columns[col] = linksdata[link].columns[col].displayname;

        var linkstable = $("#links-table").scanzytable({
            request: { url: "./apis/links/get.php", data: { type: type, id: id, link: link } },
            requiredata: { name: 'links' }, columns: columns,
            button: { show: true, click: function() { }}, search: { show: true },
            fetch: {
                row: { 
                    start: function(x, data) { return '<tr data-link-id="' + data.id +'">'; },
                    click: function() { }
                }
            }
        }).loadItems();
    });
});

//loads entity data to get alias (to display in topbar and title)
requiredata.loadAjax('entitydata', { url: "./apis/entities/one.php", data: { type: type, id: id } });
requiredata.request('entityalias', function(alias) { $(".box.title h1").text(alias); });

//selects link in topbar
$("#topbar-link").addClass('active');
