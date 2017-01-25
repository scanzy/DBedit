requiredata.request('linktypedata', function(linktypedata) {
    requiredata.request('linkdata', function(linkdata) {        

        //retrieves linkedid
        linkedid = (linktypedata.link1 == type) ? linkdata.id2 : linkdata.id1;

        //gets data about linked and sets alias to get displayname
        requiredata.request('typesdata', function(typesdata) {
            ajax("./apis/entities/one.php", { type: link, id: linkedid }, function(data) { 
                requiredata.set('linkedalias', getAlias(data, typesdata[link].columns, typesdata[link].alias)); 
            });
        });
        
        requiredata.request('userdata', function(userdata) {
            requiredata.request('linkdisplayname', function(linkdisplayname) { 
                requiredata.set('title', linkdisplayname); //sets title 

                //inits form
                var builder = $("#link-details").formbuilder({
                    fields: typecols2fieldinfo(linktypedata.columns, linkdata), //converts data from entities (columns) to data about fields
                    confirmExit: { enabled: true, msg: "Are you sure you want to exit without saving? Changes will be lost" }, cancel: goBack,
                    save: { 
                        url: "./apis/links/edit.php", success: goBack, //goes back
                        getpostdata: function(data) { //collects post data from form    
                            return { type: type, id: id, link: link, linkedid: linkedid, data: data, linkid: linkid }; 
                        }                   
                    },
                    altbtn: { text: (userdata.userlevel >= 2) ? undefined : '<span class="glyphicon glyphicon-trash"></span> <span>Delete</span>', //delete button
                        click: function() { 
                            showConfirm("<p><span>Are you sure you really want to delete</span> <b>" + linkdisplayname + "</b>?", "md", 
                                function (x) { //deletes link and goes back
                                    if (x == true) ajax("./apis/links/del.php", { type: type, link: link, linkid: linkid }, goBack ); 
                                }, "danger", "default", "Yes, delete", undefined, "Warning!"
                            );
                        }, style: 'danger'
                    },
                    done: function(form) { form.root.translate(); } //translates form  
                });
            });
        });
    });
});

//gets data about link
requiredata.loadAjax('linkdata', { url: './apis/links/one.php', data: { type: type, link: link, linkid: linkid }, error: errorPopup });