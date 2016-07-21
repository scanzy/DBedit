//gets alias from data and type data
function getAlias(data, columns, alias) {
    for (var col in columns) alias = alias.replace("%" + col + "%", data[col]);
    return alias;
}

//stores params
var params = GetParams();
var type = params['type'];
var id = params['id'];
var link = params['link'];
var action = params['action'];

//logout button
$("#logout").click(function () { sessionStorage.clear(); //erases session data
    ajax("./apis/auth/logout.php", null, function () { window.location = "./login.php" }); });

//sets requiredata options
requiredata.options('userdata', { useSessionStorage: true });
requiredata.options('typesdata', { useSessionStorage: true });

//and loads data if needed
requiredata.loadAjax('userdata', { url: "./apis/auth/info.php" }); //gets data about users
requiredata.loadAjax('typesdata', { url: "./apis/entitytypes/get.php" }); //gets data about entities

//sets topbar elements  
$("#topbar-title").text(document.title).removeClass('hidden'); //sets title in topbar

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
if (id != undefined) requiredata.request('entityalias', function(alias) {       
    $("#topbar-entity").text(alias).attr('href', './' + urlParams({ type: type, id: id })).removeClass('hidden');
});

//shows linktype in topbar
if (link != undefined) requiredata.request('typesdata', function(typesdata) {
        $("#topbar-link").text(typesdata[link].displayname).removeClass('hidden')
        .attr('href', './' + urlParams({ type: type, id: id, link: link }));
});

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