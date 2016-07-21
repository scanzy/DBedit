<?php

require_once __DIR__."/autoload.php"; //starts session and autoloads classes

//sets error handler
Errors::setModeHtml();

//redirects to login page if no login 
if (!Auth::isLogged()) Shared::redirect("./login.php");

//gets data from page url
$type = Params::optionalString('type', NULL);
$id = Params::optionalInt('id', NULL); 
$action = Params::optionalString('action', NULL); 
$link = Params::optionalString('link', NULL);

//selects page
switch($action) {
    case NULL:
        if ($type === NULL) $page = "entitytypes";
        else if ($id === NULL) $page = "entities";
        else if ($link === NULL) $page = "entitydetails"; 
        else $page = "links";
    break;

    case "edit":
        if ($type === NULL) $page = "editentitytype";
        else $page = "editentity";
    break;

    case "user": case "help": $page = $action; break;

    //default page if not found action
    default: $page = "entitytypes"; break; 
}

//gets configuration
$conf = Config::get();
$appname = $conf['global']['appname'];

?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title><?php echo $appname; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.alphanum/1.0.24/jquery.alphanum.min.js"></script>
        
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/css/bootstrap-datepicker3.min.css">
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.1/js/bootstrap-datepicker.min.js"></script>

        <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet">
        <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>

        <link rel="stylesheet" type="text/css" href="res/bootstrap-ex.css" />
        <link rel="stylesheet" type="text/css" href="res/style.css" />

        <script src="res/libs/shake.js"></script>
        <script src="res/libs/requiredata.js"></script>
        <script src="res/libs/translate.js"></script>
        <script src="res/libs/scanzyload.js"></script>
        <script src="res/libs/scanzytable.js"></script>        
    </head>
    <body>

        <nav id="topbar" class="navbar-default noselect">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#topbarcontent">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div class="collapse navbar-collapse" id="topbarcontent">
                <ul class="nav">
                    <li><a id="topbar-title" href="./" class="hidden"></a></li>
                    <li><a id="topbar-type" class="hidden"></a></li>
                    <li><a id="topbar-entity" class="hidden"></a></li>
                    <li><a id="topbar-link" class="hidden"></a></li>
                    <li class="right"><a href="#" id="logout">Logout</a>
                    </li><li class="right"><a id="topbar-user" href="./?action=user"></a>
                    </li><li class="right"><a id="topbar-help" href="./?action=help">Help</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div id="header" class="center container noselect">
            <h1 class="inline"><?php echo $appname; ?></h1>
            <h2 class="inline">admin</h2>
        </div>

        <?php switch($page) { case "entitytypes": ?>
        <div class="container page">
            <div class="box title"><h1>Dashboard</h1></div>

            <div class="box">
                <div id="entitytypes" class="row"></div>
                <div id="entities-loading" class="center"><p class="grey">Loading...</p></div>
                <div id="entities-load-error" style="display:none" class="center">
                    <p class="grey">Error while loading types</p><br/>
                    <button class="btn-sm btn btn-default" id="entities-load-retry">
                        <span class="glyphicon glyphicon-repeat"></span> <span>Retry</span>
                    </button>
                </div>
            </div>
        </div>

        <?php break; case "entities": ?>

        <div class="container page">
            <div class="box title"><h1></h1></div>
            <div class="box"><div id="entities-table"></div></div>
        </div>

        <?php break; case "entitydetails": ?>

        <div class="container page">
            <div class="box title"><h1></h1></div>

            <div class="row">
                <div class="col-lg-4 col-md-8">
                    <div class="box">
                        <div id="details-table"></div>
                        <button id="entity-edit" class="btn btn-info hidden"><span class="glyphicon glyphicon-edit"></span> <span>Edit</span></button>
                        <button id="entity-delete" class="btn btn-danger hidden right"><span class="glyphicon glyphicon-trash"></span> <span>Delete</span></button>
                    </div>
                </div>
                <div class="col-lg-8 col-md-4">
                    <div class="box">
                        <div id="linktypes-loading" class="center"><p class="grey">Loading links...</p></div>
                        <div id="linktypes-load-error" class="center" style="display:none">
                            <p class="grey">Error while loading links</p><br/>
                            <button class="btn-sm btn btn-default" id="linktypes-load-retry">
                                <span class="glyphicon glyphicon-repeat"></span> <span>Retry</span>
                            </button>                 
                        </div>
                        <div id="linktypes" class="row"></div>
                        <div id="linktypes-empty" class="center"><p class="grey">No links for this type</p></div>
                    </div>
                </div>
            </div>
        </div>

        <?php break; case "links": ?>

        <div class="container page">
            <div class="box title">
                <h1>Links</h1>
                <div class="line"></div>
                <div id="links-nav" class="center btn-multiline"></div>
                <div class="center">
                    <p id="links-nav-loading" class="grey">Loading...</p>
                    <div id="links-nav-load-error" style="display:none">
                        <p class="grey">Error while loading links</p><br/>
                        <button id="links-nav-load-retry" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-repeat"></span> <span>Retry</span></button>
                    </div>
                </div>
            </div>

            <div class="box">
                
                <div id="links-table"></div>
            </div>
        </div>

        <?php break; case "editentitytype": ?>

        <div class="container page">
            <div class="box title"><h1>Edit entity type</h1></div>

            <div class="box">
                        
            </div>
        </div>

        <?php break; case "editentity": ?>

        <div class="container page">
            <div class="box title"><h1>Edit entity</h1></div>

            <div class="box">
                <div class="row form-horizontal" id="entity-details"></div>
                <div class="right">
                    <button id="details-cancel" class="btn btn-lg btn-default">Cancel</button>
                    <button id="details-save" class="btn btn-lg btn-success disabled">Save</button>
                </div>
            </div>
        </div>

        <?php break; case "user": ?>

        <div class="container page">
            <div class="box title"><h1>User</h1></div>

            <div class="box">
                        
            </div>
        </div>

        <?php break; case "help": ?>

        <div class="container page">
            <div class="box title"><h1>Help</h1></div>

            <div class="box">
                        
            </div>
        </div>

        <?php break; } ?>

        <div id="footer">
            <span>Powered by <b>ScanzySoftware</b></span>
        </div>  

        <script src="res/libs/messages.js"></script>
        <script src="res/libs/confirm.js"></script>
        <script src="res/shared.js"></script>
        <script src="res/topbar.js"></script>

        <?php switch($page) { 

            case "entitytypes": Shared::loadJS("res/entitytypes.js"); break; 
            case "entities": Shared::loadJS("res/entities.js"); break; 
            case "entitydetails": Shared::loadJS("res/entitydetails.js"); break;
            case "links": Shared::loadJS("res/links.js"); break;
            case "editentitytype": break;
            case "editentity": Shared::loadJS("res/editentity.js"); break;
            case "user": break;
            case "help": break;                                            
        } ?>
    </body>
</html>
