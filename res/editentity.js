requiredata.request('typesdata', function (typesdata) {
    
    var typedata = typesdata[type]; //gets type data

    requiredata.set('title', typedata['edit']); //sets page title
    $("#topbar-entity").addClass('active'); //selects alias in topbar

    //loads current values
    requiredata.request('entitydata', function (data) { 
                        
        //inits form
        var builder = $("#entity-details").formbuilder({
            fields: typecols2fieldinfo(typedata.columns, data), //converts data from entities (columns) to data about fields
            confirmExit: { enabled: true, msg: "Are you sure you want to exit without saving? Changes will be lost" },
            cancel: function() { changeUrl({ type: type, id: id }); },
            save: { 
                url: "./apis/entities/edit.php", 
                getpostdata: function(data) { return { type: type, id: id, data: data }; }, //gets data from form and collects post data
                success: function(id) { changeUrl({ type: type, id: id }); } //redirects to details page
            },
            done: function(form) { form.root.translate(); } //translates form            
        });
    });   
});