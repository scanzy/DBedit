requiredata.request('typesdata', function (typesdata) {
    var typedata = typesdata[type]; //data about type

    //details table
    var detailstable = $("#details-box").scanzytable({
        request: { url: undefined }, requiredata: { name: 'entitydata' }, //passive mode
        fetch: {
            rows: {
                start: function (col, data) {
                    if (!(col in typedata.columns)) return ""; //skips row if no column in typesdata
                    return "<tr><td>" + typedata.columns[col].displayname + "</td>\
                            <td><b>" + raw2display(data, typedata.columns[col]) + "</b></td>";
                }
            }
        }
    }).loadItems();

    //when entity alias loaded
    requiredata.request('entityalias', function (alias) {

        requiredata.set('title', alias); //sets page title        

        //edit and delete button 
        requiredata.request('userdata', function(userdata) { if (userdata.userlevel >= 2) return; // (do not show if user is viewer)

            //edit button
            $('<button class="btn btn-info"><span class="glyphicon glyphicon-pencil"></span> <span>Edit</span></button>').appendTo('#details-box')
            .translate().click(function() { changeUrl({ type: type, id: id, action: "edit" }); }).hide().fadeIn("slow");

            //delete button
            $('<button class="btn btn-danger right"><span class="glyphicon glyphicon-trash"></span> <span>Delete</span></button>').appendTo('#details-box')
            .translate().click(function () {
                showConfirm(
                    "<p><span>Are you sure you really want to delete</span> <b>" + alias + "</b> <span>from</span> <b>" + typesdata[type].displayname + "</b>?", "md", 
                    function(x) { if (x == true) ajax("./apis/entities/del.php", { type: type, id: id }, function() { changeUrl({ type: type }); }); }, 
                    "danger", "default", "<span>Yes, delete</span> " + alias, undefined, "Warning!"
                );
            }).hide().fadeIn("slow"); 
        });    

        //switches linkboxes/tables modes
        if (('hidelinkboxes' in typedata) ? typedata.hidelinkboxes : false)
        {
            //tables
            var linksloader = $("#linktypes").unwrap().scanzyload({
                requiredata: { name: 'linktypesdata' },
                request: { url: "./apis/linktypes/get.php", data: { type: type } },
                fetch: function (name, data) {

                    //creates table with title
                    var html = '<div class="box"><h3 class="subtitle">' + getAlias({ alias: alias }, { alias: alias }, data.description[type]) + '</h3>';
                    html += '<div class="links-table" data-linktype="' + name + '"></div>'; 
                    return html + '</div>';
                },
                error: $("#linktypes-load-error"), empty: $("#linktypes-empty"), loading: $("#linktypes-loading"), retry: $("#linktypes-load-retry"),
                done: function () {                     
                    requiredata.request('linktypesdata', function(linktypes) { //gets link types info
                        $(".links-table").each(function() { 
                            var linktypedata = linktypes[$(this).attr('data-linktype')]; //gets data about this linktype
                            $(this).loadLinksTable((linktypedata.link1 == type) ? linktypedata.link2 : linktypedata.link1 , linktypedata); //load table
                        });
                    });
                } 
            }).loadItems();
        }
        else
        {     
            //links boxes
            var linksloader = $("#linktypes").addClass('center row').scanzyload({
                request: { url: "./apis/linktypes/info.php", data: { type: type, id: id } },
                fetch: function (name, data) {

                    //basic container with title and description
                    var html = '<div class="link-box col-lg-6 col-md-12 col-sm-6 col-xs-12 center" href="./' + urlParams({ type: type, id: id, link: data.link }) + '">\
                        <div><h2>' + data.displayname + ' <span class="badge badge-light">' + data.itemscount + '</span></h2>\
                        <div class="line"></div><p class="grey">' + getAlias({ alias: alias }, { alias: alias }, data.description[type]) + '</p>';
                        
                    //random entities
                    for (var i in data.somerandom) 
                        html += '<button class="btn btn-xs btn-info alias" href="./' + 
                            urlParams({ type: type, id : id, link: data.link, linkid: data.somerandom[i].id }) + '" \
                            data-entity-type="' + data.link + '" data-entity-id="' + data.somerandom[i][data.linkedidcol] + '"></button> ';

                    return html + '</div></div>';
                },
                error: $("#linktypes-load-error"), empty: $("#linktypes-empty"), loading: $("#linktypes-loading"), retry: $("#linktypes-load-retry"),
                always: function () { $("#linktypes").translate(); setLinkBoxHandlers(); loadAliases(); } //translates
            }).loadItems();
        }
    });
});