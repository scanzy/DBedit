requiredata.set('title', "Error"); //sets title

if (id != undefined) //if there is some page for back
    $("#topbar .navbar-back").clone().removeClass("navbar-back") //copies back button
    .addClass("btn-lg btn btn-primary").prependTo(".box h5"); //and places it in page