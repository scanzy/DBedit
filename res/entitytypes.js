requiredata.set('title', "Dashboard"); //sets title

//setups load
var entitytypes = $("#entitytypes").scanzyload({
    request: { url: "./apis/entitytypes/info.php" },
    fetch: function(name, data) {        

        //basic container
        var html = '<div class="link-box col-lg-3 col-md-4 col-sm-6 col-xs-12 center" href="./?type=' + name + '"><div> \
            <h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2>';
        
        //description
        if (data.description != undefined && data.description != "")
            html += '<div class="line"></div><p class="txt-grey">' + data.description + '</p>';

        //random entities
        for (var i in data.somerandom) 
            html += '<button class="btn btn-xs btn-info" href="./' + urlParams({ type: name, id : data.somerandom[i].id }) + '">'
                 + getAlias(data.somerandom[i], data.columns, data.alias) + '</button> ';

        return html + '</div></div>';
    },
    error: $("#entities-load-error"), loading: $("#entities-loading"), retry: $("#entities-load-retry"),
    always: function () { $("#entitytypes").translate(); setLinkBoxHandlers(); } //translates
}).loadItems();