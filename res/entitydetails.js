requiredata.request('typesdata', function (typesdata) { //requires types data

    //details table
    var detailstable = $("#details-table").scanzytable({
        request: { url: "./apis/entities/one.php", data: { type: type, id: id } },
        requiredata: { name: 'entitydata' },
        fetch: {
            row: {
                start: function (col, data) {
                    if (!(col in typesdata[type].columns)) return ""; //skips row if no column in typesdata
                    return "<tr><td>" + typesdata[type].columns[col].displayname + "</td><td><b>" + data + "</b></td>";
                }
            }
        }
    });

    //when entity alias loaded
    requiredata.request('entityalias', function (alias) {

        $(".box.title h1").text(alias); //sets page title
        $("#topbar-entity").addClass('active'); //selects alias in topbar

        //edit and delete button 
        requiredata.request('userdata', function(userdata) { if (userdata.userlevel >= 2) return; // (do not show if user is viewer)

            $("#entity-edit").removeClass('hidden').click(function() { changeUrl({ type: type, id: id, action: "edit" }); });
            $("#entity-delete").removeClass('hidden').click(function () {
                showConfirm("<p>Are you sure you really want to delete <b>" + alias + "</b> from <b>" + typesdata[type].displayname + "</b>?", function (x) {
                    if (x == true) ajax("./apis/entities/del.php", { type: type, id: id }, function () { changeUrl({ type: type }); });  });
            });
        });
    });

    //links info
    var linksloader = $("#linktypes").scanzyload({
        request: { url: "./apis/linktypes/info.php", data: { type: type, id: id } },
        fetch: function (name, data) {
            return '<a href="./' + urlParams({ type: type, id: id, link: name }) + '">\
            <div class="col-lg-4 col-md-12 col-sm-6 col-xs-6 center"> \
            <h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2> \
            <div class="line"></div> \
            <p class="txt-grey">' + data.description + '</p></div></a>';
        },
        error: $("#linktypes-load-error"), empty: $("#linktypes-empty"), loading: $("#linktypes-loading"), retry: $("#linktypes-load-retry"),
        always: function () { translate(document.getElementById("linktypes")); } //translates
    });
    
    //gets data
    linksloader.loadItems();
    detailstable.loadItems();
});