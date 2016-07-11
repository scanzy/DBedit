//stores params
var type = GetParam('type');
var id = GetParam('id');

requiredata.request('typesdata', function (typesdata) { //requires types data

    //gets details (ajax)
    ajax("./apis/entity/one.php?type=" + encodeURIComponent(type) + "&id=" + encodeURIComponent(id), null, function (data) {

        //gets display name for this object
        var alias = typesdata[type].alias;
        for (var col in typesdata[type].columns) alias = alias.replace("%" + col + "%", data[col]);

        $(".box.title h1").text(alias); //sets title

        //updates topbar
        $("#topbar-type").text(typesdata[type].displayname).attr('href', './?type=' + encodeURIComponent(type)).removeClass('hidden');
        $("#topbar-entity").text(alias).attr('href', './?type=' + encodeURIComponent(type) + "&id=" + encodeURIComponent(id))
        .removeClass('hidden').addClass('active');

        //fetches details table
        var columns = typesdata[type].columns; var html = "";
        for (var col in columns) html += "<tr><td>" + columns[col].displayname + "</td><td><b>" + data[col] + "</b></td></tr>";
        $("#details-table tbody").append(html);
    })
    .fail(function() { $("#details-load-error").removeClass('hidden'); });

    //gets links info
    var loader = scanzyload({
        request: {},
        fetch: {},
        error: $("#linktypes-load-error")
    });
});