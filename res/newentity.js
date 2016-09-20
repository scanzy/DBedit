requiredata.request('typesdata', function (typesdata) {
    
    var typedata = typesdata[type]; //gets type data

    requiredata.set('title', typedata['new']); //sets page title 
    $("#topbar-type").addClass('active'); //selects type in topbar    

    //inits form
    var builder = $("#entity-details").formbuilder({
        fields: typecols2fieldinfo(typedata.columns), //converts data from entities (columns) to data about fields
        confirmExit: { enabled: true, msg: "Are you sure you want to exit without saving? New inserted data will be lost" },
        cancel: function() { changeUrl({ type: type }); },
        save: { 
            url: "./apis/entities/edit.php", 
            getpostdata: function(data) { return { type: type, data: data }; }, //gets data from form and collects post data
            success: function(id) { changeUrl({ type: type, id: id }); } //redirects to details page
        },
        done: function(form) { form.root.translate(); } //translates form  
    });
});