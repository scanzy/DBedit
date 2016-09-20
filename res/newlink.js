requiredata.request('linktypedata', function(linktypedata) {
    requiredata.request('entityalias', function(alias) {

        //shows entities table popup
        linkableEntitiesPopup(getAlias({ alias: alias }, { alias: alias }, linktypedata.add[type]), undefined, function(selectedid) { 
            if (selectedid == undefined) { changeUrl({ type: type, id: id, link: link }); return; } //if action canceled
            linkedid = selectedid; 

            //gets data about linked and sets alias (to get title)
            requiredata.request('typesdata', function(typesdata) {
                requiredata.request('linkabledata', function(data) { 
                    var linkeddata; for (var i in data) { if (data[i].id == linkedid) { linkeddata = data[i]; break; } }
                    requiredata.set('linkedalias', getAlias(linkeddata, typesdata[link].columns, typesdata[link].alias)); 
                });
            });

            //inits form
            var builder = $("#link-details").formbuilder({
                fields: typecols2fieldinfo(linktypedata.columns), //converts data from entities (columns) to data about fields
                confirmExit: { enabled: true, msg: "Are you sure you want to exit without saving? New inserted data will be lost" },
                cancel: function() { changeUrl({ type: type, id: id, link: link }); },
                save: { 
                    url: "./apis/links/edit.php", 
                    getpostdata: function(data) { return { type: type, id: id, link: link, linkedid: linkedid, data: data }; }, //gets data from form and collects post data
                    success: function(linkid) { changeUrl({ type: type, id: id, link: link }); } //redirects to links page
                },
                done: function(form) { form.root.translate(); } //translates form  
            }).options.change_first(); //enables save button
        });  
    });
});

//sets title
requiredata.request('linkdisplayname', function(name) { requiredata.set('title', name); }); 