//gets data about entities and stores it and then setups page with entitytype data (and inits table)
requiredata.request('typesdata', function (typesdata) {

    var typedata = typesdata[type]; //gets data of this type
    $(".box.title h1").text(typedata.displayname); //sets title

    $("#topbar-type").addClass('active'); //select entity type in topbar

    var columns = []; //gets columns (only columns to show)
    for (var col in typedata.columns) if (typedata.columns[col].showinlist) 
        columns[col] = typedata.columns[col].displayname;

    //requires userlevel to show/hide new entity button
    requiredata.request('userdata', function(userdata) {

        //setups table
        entitiestable = $("#entities-table").scanzytable({ columns: columns,
            request: { url: "./apis/entities/get.php", data: { type: type} },            
            fetch: { 
                rows: { 
                    start: function (col, data) { return "<tr data-entity-id='" + data.id + "'>"; }, 
                    click: function () { changeUrl({ type: type, id: $(this).attr('data-entity-id')}); },
                    hoverClass: 'hover' 
                }, 
                contents: function(col, data) { return raw2display(data, typesdata[type].columns[col]); },                                  
            }, 
            search: { show: true, text: typesdata[type].searchhint, minRows: typesdata[type].searchminrows }, 
            button: { show: (userdata.userlevel < 2), text: typedata.add, click: function () { changeUrl({ type: type, action: "edit"}); } } 
        });

        //sets entities count in title
        requiredata.request('scanzytable-entities-table', function(data) {
            $(".box.title h1").html(typesdata[type].displayname + ' <span class="badge badge-light">' + data.length + '</span>');
        });

        //loads data
        entitiestable.loadItems();
    });
});