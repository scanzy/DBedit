requiredata.request('typesdata', function (typesdata) { //requires types data

    //details table
    var detailstable = $("#details-table").scanzytable({
        request: { url: "./apis/entities/one.php" + urlParams({ type: type, id: id }),
            success: function (data) {

                //gets display name for this object
                var alias = typesdata[type].alias;
                for (var col in typesdata[type].columns) alias = alias.replace("%" + col + "%", data[col]);

                $(".box.title h1").text(alias); //sets title

                //updates topbar
                $("#topbar-type").text(typesdata[type].displayname).attr('href', './' + urlParams({ type: type })).removeClass('hidden');
                $("#topbar-entity").text(alias).attr('href', './' + urlParams({ type: type, id: id })).removeClass('hidden').addClass('active');

                //edit and delete button
                $("#entity-edit").click(function() { changeUrl({ type: type, id: id, action: "edit" }); }).removeClass('hidden');
                $("#entity-delete").removeClass('hidden').click(function () {
                    showConfirm("<p>Are you sure you really want to delete <b>" + alias + "</b> from <b>" + typesdata[type].displayname + "</b>?", function (x) {
                        if (x == true) ajax("./apis/entities/del.php" + urlParams({ type: type, id: id }), null, function () { changeUrl({ type: type }); });  });
                });
            }
        },
        fetch: {
            row: {
                start: function (col, data) {
                    if (!(col in typesdata[type].columns)) return ""; //skips row if no column in typesdata
                    return "<tr><td>" + typesdata[type].columns[col].displayname + "</td><td><b>" + data + "</b></td>";
                }
            }
        }
    });

    //links info
    var linksloader = $("#linktypes").scanzyload({
        request: { url: "./apis/linktypes/info.php", data: { type: type, id: id },
            complete: function () { translate(document.getElementById("linktypes")); } //translates
        },
        fetch: function (name, data) {
            return '<a href="./' + urlParams({ type: type, id: id, link: name }) + '">\
            <div class="col-lg-4 col-md-12 col-sm-6 col-xs-6 center"> \
            <h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2> \
            <div class="line"></div> \
            <p class="txt-grey">' + data.description + '</p></div></a>';
        },
        error: $("#linktypes-load-error"), empty: $("#linktypes-empty"), loading: $("#linktypes-loading")
    });

    //retry link
    $("#linktypes-load-retry").click(function (e) { e.preventDefault(); linksloader.loadItems(); return false; });

    //gets data
    linksloader.loadItems();
    detailstable.loadItems();
});