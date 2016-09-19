requiredata.request('typesdata', function (typesdata) { //requires types data

    //details table
    var detailstable = $("#details-table").scanzytable({
        request: { url: undefined }, requiredata: { name: 'entitydata' }, //passive mode
        fetch: {
            rows: {
                start: function (col, data) {
                    if (!(col in typesdata[type].columns)) return ""; //skips row if no column in typesdata
                    return "<tr><td>" + typesdata[type].columns[col].displayname + "</td>\
                            <td><b>" + raw2display(data, typesdata[type].columns[col]) + "</b></td>";
                }
            }
        }
    }).loadItems();

    //when entity alias loaded
    requiredata.request('entityalias', function (alias) {

        $(".box.title h1").text(alias); //sets page title        

        //edit and delete button 
        requiredata.request('userdata', function(userdata) { if (userdata.userlevel >= 2) return; // (do not show if user is viewer)

            //edit button
            $('<button class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span> <span>Edit</span></button>').appendTo('.details-box')
            .translate().click(function() { changeUrl({ type: type, id: id, action: "edit" }); });

            //delete button
            $('<button class="btn btn-danger right"><span class="glyphicon glyphicon-trash"></span> <span>Delete</span></button>')
            .appendTo('.details-box').translate().click(function () {
                showConfirm("<p><span>Are you sure you really want to delete</span> <b>" + alias + "</b> from <b>" + typesdata[type].displayname + "</b>?", "md", 
                function(x) { if (x == true) ajax("./apis/entities/del.php", { type: type, id: id }, function() { changeUrl({ type: type }); }); });
            });
        });    

        //links info
        var linksloader = $("#linktypes").scanzyload({
            request: { url: "./apis/linktypes/info.php", data: { type: type, id: id } },
            fetch: function (name, data) {

                var random = ""; //random entities
                for (var i in data.somerandom) 
                    random += '<button class="btn btn-xs btn-info alias" href="./' + 
                        urlParams({ type: type, id : id, link: data.link, linkid: data.somerandom[i].id }) + '" \
                        data-entity-type="' + data.link + '" data-entity-id="' + data.somerandom[i][data.linkedidcol] + '"></button> ';

                return '<div class="link-box col-lg-6 col-md-12 col-sm-6 col-xs-12 center" href="./' + urlParams({ type: type, id: id, link: data.link }) + '">\
                    <div><h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2><div class="line"></div>\
                    <p class="txt-grey">' + getAlias({ alias: alias }, { alias: alias }, data.description[type]) + '</p>' + random + '</div></div>';
            },
            error: $("#linktypes-load-error"), empty: $("#linktypes-empty"), loading: $("#linktypes-loading"), retry: $("#linktypes-load-retry"),
            always: function () { $("#linktypes").translate(); setLinkBoxHandlers(); loadAliases(); } //translates
        }).loadItems();
    });
});