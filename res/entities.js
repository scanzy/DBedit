//gets data about entities and stores it and then setups page with entitytype data (and inits table)
requiredata.request('typesdata', function (typesdata) {

    var typedata = typesdata[type]; //gets data of this type
    requiredata.set('title', typedata.displayname); //sets title    

    var columns = []; //gets columns (only columns to show)
    for (var col in typedata.columns) if (typedata.columns[col].showinlist) 
        columns[col] = ('shortname' in typedata.columns[col]) ? typedata.columns[col].shortname : typedata.columns[col].displayname;

    //requires userlevel to show/hide new entity button
    requiredata.request('userdata', function(userdata) {

        //setups table
        entitiestable = $("#entities-table").scanzytable({ columns: columns,
            request: { url: undefined }, requiredata: { name: 'entitiesdata' }, //passive mode 
            sort: {  
                enabled: ('orderby' in typedata), //sort options on data load
                column: ('orderby' in typedata) ? typedata.orderby.column : undefined,
                reverse: ('orderby' in typedata) ? typedata.orderby.reverse : false,
                click: true //enables sort on th click
            },          
            fetch: { 
                rows: { //setups row click
                    start: function (col, data) { return "<tr data-entity-id='" + data.id + "'>"; }, 
                    click: function () { changeUrl({ type: type, id: $(this).attr('data-entity-id')}); },
                    hoverClass: 'hover' 
                }, 
                contents: function(col, data) { return raw2display(data, typedata.columns[col]); }                                  
            }, 
            empty: typedata.emptysethint,
            search: { show: true, text: typedata.searchhint, minRows: typedata.searchminrows }, 
            button: { show: (userdata.userlevel < 2), text: typedata.add, click: function () { changeUrl({ type: type, action: "edit"}); } },
            done: function(t) { t.root.translate(); } //translates table 
        }).loadItems();        
    });

    //sets entities count in title
    requiredata.request('entitiesdata', function(data) { $(".box.title h1").append(' <span class="badge badge-light">' + data.length + '</span>'); });
});

//loads entities
requiredata.loadAjax('entitiesdata', { url: "./apis/entities/get.php", data: { type: type }, error: errorPopup });