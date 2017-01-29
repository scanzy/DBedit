//shows table modal
function linkableEntitiesPopup(title, selectedid, callback) {
    requiredata.request('typesdata', function(typesdata) { 
        var typedata = typesdata[link]; //gets data about linked type

        showModal('<div class="modal-header"><button data-dismiss="modal" class="close">&times;</button><h2 class="title">' + title + '</h2></div>\
            <div class="modal-body"><div id="entities"></div></div>', "lg", function(root) {

            var columns = []; //gets columns (only columns to show)
            for (var col in typedata.columns) if (typedata.columns[col].showinlist) 
                columns[col] = typedata.columns[col].displayname;

            var t = root.find("#entities").scanzytable({ columns: columns, loadnow: { enabled: true },
                request: { url: "./apis/entities/linkable.php", data: { type: type, id: id, link: link } }, requiredata: { name: "linkabledata" },
                sort: {  
                        enabled: ('orderby' in typedata), //sort options on data load
                        column: ('orderby' in typedata) ? typedata.orderby.column : undefined,
                        reverse: ('orderby' in typedata) ? typedata.orderby.reverse : false,
                        click: true //enables sort on th click
                    },          
                    fetch: { 
                        rows: { //setups row click
                            start: function (col, data) { return "<tr data-entity-id='" + data.id + "'>"; }, 
                            click: function () { selectedid = $(this).attr('data-entity-id'); root.modal('hide'); },
                            hoverClass: 'hover' 
                        }, 
                        contents: function(col, data) { return raw2display(data, typedata.columns[col]); },                                  
                    }, 
                    empty: typedata.emptysethint,
                    search: { show: true, text: typedata.searchhint, minRows: typedata.searchminrows }, 
                    always: function() { $("#entities").translate(); } //translates table 
            });
            
            //selects active row
            if (selectedid != undefined) t.find("tr[data-entity-id='" + selectedid + "'").addClass("active");        
        }, 
        function() { if (callback != undefined) callback(selectedid); }).translate(); //sends result
    });
}