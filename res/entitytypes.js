//setups load
var entitytypes = $("#entitytypes").scanzyload({
    request: { url: "./apis/entitytypes/info.php" },
    fetch: function(name, data) {
        return '<a href="./?type=' + name + '"><div class="col-lg-3 col-md-4 col-xs-6 center"> \
            <h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2> \
            <div class="line"></div> \
            <p class="txt-grey">' + data.description + '</p></div></a>';
    },
    error: $("#entities-load-error"), loading: $("#entities-loading"),
    always: function () { translate(document.getElementById("entitytypes")); } //translates
});

//binds retry link
$("#entities-load-retry").click(function () { entitytypes.loadItems(); });

//loads items
entitytypes.loadItems();

//selects title in topbar
$("#topbar-title").addClass('active');