//setups load
var entitytypes = $("#entitytypes").scanzyload({
    request: { url: "./apis/entitytypes/info.php" },
    fetch: function(name, data) {

        var random = ""; //random entities
        for (var i in data.somerandom) 
            random += '<button class="btn btn-xs btn-info" href="./' + urlParams({ type: name, id : data.somerandom[i].id }) + '">'
                 + getAlias(data.somerandom[i], data.columns, data.alias) + '</button> ';

        //basic container
        return '<div class="link-box col-lg-3 col-md-4 col-sm-6 col-xs-12 center" href="./?type=' + name + '"><div> \
            <h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2> \
            <div class="line"></div><p class="txt-grey">' + data.description + '</p>' + random + '</div></div>';
    },
    error: $("#entities-load-error"), loading: $("#entities-loading"), retry: $("#entities-load-retry"),
    always: function () { translate(document.getElementById("entitytypes")); setLinkBoxHandlers(); } //translates
}).loadItems();

//selects title in topbar
$("#topbar-title").addClass('active');