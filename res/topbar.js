//gets alias from data and type data
function getAlias(data, columns, alias) {
    for (var col in columns) alias = alias.replace("%" + col + "%", data[col]);
    return alias;
}

//gets data to show aliases
function loadAliases() { 
    requiredata.request('typesdata', function(typesdata) {
        $(".alias[data-entity-type][data-entity-id]").each(function() {       

            //gets type and id to send via ajax, saves element ref for late text update
            var el = $(this), type = $(this).attr('data-entity-type'), id = $(this).attr('data-entity-id'); 
            
            ajax("./apis/entities/one.php", { type: type, id: id }, function(data) { //sends request            
                el.text(getAlias(data, typesdata[type].columns, typesdata[type].alias)); //sets alias
            });
        });
    });
}

// logout function, erases session data (and redirects)
function logout() { sessionStorage.clear(); ajax("./apis/auth/logout.php", null, function () { window.location = "./login.php" }); }
$("#logout").click(logout); //logout button

//sets requiredata options
requiredata.options('userdata', { useSessionStorage: true });
//requiredata.options('typesdata', { useSessionStorage: true });

//and loads data if needed
requiredata.loadAjax('userdata', { url: "./apis/auth/info.php" }); //gets data about users
requiredata.loadAjax('typesdata', { url: "./apis/entitytypes/get.php" }); //gets data about entities

//hides all topbar left elements
$("#topbar li:not(.right)").hide();

//shows title
$("#topbar-title").removeClass("hidden");

//sets user name in topbar
requiredata.request('userdata', function (data) { $("#topbar-user").text(data.name + ' ' + data.surname); });

//shows type in topbar
if (type != undefined) requiredata.request('typesdata', function(typesdata) {      
    $("#topbar-type").text(typesdata[type].displayname).attr('href', './' + urlParams({ type: type })).removeClass('hidden');

    //gets display name for this entity
    requiredata.request('entitydata', function (data) { 
        requiredata.set('entityalias', getAlias(data, typesdata[type].columns, typesdata[type].alias)); //and saves it
    });
});

//shows entity alias in topbar
if (id != undefined) {  
    requiredata.loadAjax('entitydata', { url: "./apis/entities/one.php", data: { type: type, id: id }, error: errorPopup}); //request entity data   
    requiredata.request('entityalias', function(alias) { 
        $("#topbar-entity").text(alias).attr('href', './' + urlParams({ type: type, id: id })).removeClass('hidden'); //sets alias in topbar

        requiredata.request('linktypedata', function(linktypedata) {
            requiredata.request('linkedalias', function(linkedalias) { //gets link alias
                var replace = {}; replace[type] = alias; replace[link] = linkedalias;
                requiredata.set('linkdisplayname', getAlias(replace, replace, linktypedata.displayname));
            });
        });
    });
}

if (link != undefined) {

    //shows linktype in topbar
    requiredata.request('typesdata', function(typesdata) {
        $("#topbar-link").text(typesdata[link].displayname).removeClass('hidden')
        .attr('href', './' + urlParams({ type: type, id: id, link: link }));
    });

    //load links data types 
    requiredata.loadAjax('linktypesdata', { url: "./apis/linktypes/get.php", data: { type: type } });

    //gets linktype from links data
    requiredata.request('linktypesdata', function(linktypesdata) {           
        for(var i in linktypesdata) 
            if (((linktypesdata[i].link1 == type) && (linktypesdata[i].link2 == link))
             || ((linktypesdata[i].link2 == type) && (linktypesdata[i].link1 == link)))
                { requiredata.set('linktypedata', linktypesdata[i]); break; }
    });    
}

//selects (as "active") the right topbar element
if      (type == undefined) $("#topbar-title").addClass('active');  //selects title in topbar
else if (id == undefined)   $("#topbar-type").addClass('active');   //selects entity type in topbar
else if (link == undefined) $("#topbar-entity").addClass('active'); //selects entity alias in topbar
else                        $("#topbar-link").addClass('active');   //selects link type in topbar  

//back button setup (for mobile devices)
if (type == undefined) $("#topbar .navbar-brand").remove(); else 
    requiredata.request('backpage', function(backparams) {
        $("#topbar .navbar-back").attr('href', './' + urlParams(backparams)); //sets page
        requiredata.request('backtext', function(backtext) { $(".back-text").text(backtext).translate(); //sets text (translated)
            $("#topbar .navbar-back-container").removeClass('hidden').hide().fadeIn("slow"); //shows back button with fade
        });
    });

//back page setup and back button name
if (id == undefined && action != "edit") { //page entities
    requiredata.set('backpage', {}); // goes to dashboard
    requiredata.set('backtext', "Dashboard"); // shows "Dashboard"
} 
else if (link == undefined && action != "edit" || id == undefined && action == "edit") { //page entity details or new entity
    requiredata.set('backpage', { type: type }); // goes to entities
    requiredata.request('typesdata', function(data) { requiredata.set('backtext', data[type].displayname); }); //shows entity type name
}
else if (linkid == undefined && action != "edit" || link == undefined && action == "edit") { //page links or edit entity
    requiredata.set('backpage', { type: type, id: id }); //goes to entity details
    requiredata.request('entityalias', function(alias) { requiredata.set('backtext', alias); }); //shows entity alias
}
else { //page edit link   
    requiredata.request('typesdata', function(data) {            

        var hidelinkboxes = (('hidelinkboxes' in data[type]) ? data[type].hidelinkboxes : false); //back page  
        requiredata.set('backpage', hidelinkboxes ? { type: type, id: id } : { type: type, id: id, link: link }); //goes entity details or links 
                  
        requiredata.request('entityalias', function(alias) { //back text
            if (hidelinkboxes) requiredata.set('backtext', alias); else //shows entity alias
            requiredata.request('linktypedata', function(data) { //shows link display name
                requiredata.set('backtext', getAlias({ alias: alias }, { alias: alias }, data.description[type])); 
            });
        });
    });
}

//shows tobar links with animation
$("#topbar li:not(.right):not(.hidden)").fadeIn("slow");

//sets title
requiredata.request('title', function(title) { $(".box.title h1").hide().text(title).fadeIn("slow"); });

//sets handlers for link-box
function setLinkBoxHandlers() {
    
    //activates buttons
    $(".link-box[href], button[href]").on('click', function(e) { 
        e.stopPropagation(); 
        window.location.href = $(this).attr('href');
    });

    //hover effect
    $(".link-box > div").on('mouseenter', function() { $(this).addClass("hover"); })
    $(".link-box > div").on('mouseleave', function() { $(this).removeClass("hover"); });
}