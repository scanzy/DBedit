requiredata.set('title', "Dashboard"); //sets title

//setups load
var entitytypes = $("#entitytypes").scanzyload({
    request: { url: "./apis/entitytypes/info.php" },
    fetch: function(name, data) {   
        
        var sizeclasses = ""; //sets classes for linkbox size
        switch(data.badgesize) {
            case 3: sizeclasses = "col-lg-12"; break;
            case 2: sizeclasses = "col-lg-6 col-md-8 col-sm-12"; break;
            case 1: default: sizeclasses = "col-lg-3 col-md-4 col-sm-6"; break; 
        }

        //basic container with number badge
        var html = '<div class="link-box ' + sizeclasses + ' col-xs-12 center" href="./?type=' + name + '"><div><h2>' + data.displayname + 
            ((data.itemscount != null) ? (' <span class="badge badge-light">' + data.itemscount + '</span>') : "") + '</h2>';
        
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