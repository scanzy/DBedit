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

        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/css/bootstrap-select.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.10.0/js/bootstrap-select.min.js"></script>

        <link rel="stylesheet" type="text/css" href="res/bootstrap-ex.css" />
        <link rel="stylesheet" type="text/css" href="res/style.css" />

        <script src="res/libs/translate.js"></script>
        <script src="res/libs/shake.js"></script>
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
                    <li class="right"><a href="#" id="logout">Logout</a>
                    </li><li class="right"><a href="help">Help</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div id="header" class="center container noselect">
            <h1 class="inline"><?php echo $appname; ?></h1>
            <h2 class="inline">admin</h2>
        </div>

        <?php switch($action) { case NULL: if ($type === NULL) { ?>
        <div class="container page">
            <div class="box title"><h1>Dashboard</h1></div>

            <div class="box">
                <div id="entitytypes" class="row"></div>
                <div id="entities-load-error" style="display:none"><p class="grey">Error</p></div>
            </div>
        </div>

        <?php } else if ($id === NULL){ ?>

        <div class="container page">
            <div class="box title"><h1></h1></div>

            <div class="box">
                <div id="entities-table"></div>                
            </div>
        </div>

        <?php } else if ($link === NULL) { ?>

        <div class="container page">
            <div class="box title"><h1>Details</h1></div>

            <div class="box">
                        
            </div>
        </div>

        <?php } break; case "new": ?>

        <div class="container page">
            <div class="box title"><h1>New</h1></div>

            <div class="box">
                        
            </div>
        </div>

        <?php break; } ?>

        <div id="footer">
            <span>Powered by <b>ScanzySoftware</b></span>
        </div>  

        <script src="res/libs/messages.js"></script>
        <script src="res/libs/confirm.js"></script>
        <script src="res/libs/scanzytable.js"></script>
        <script src="res/libs/scanzyload.js"></script>
        <script src="res/shared.js"></script>

        <?php switch($action) { 

            case NULL: 
                if ($type === NULL) { Shared::loadJS("res/entitytypes.js"); } 
                else if ($id === NULL) { Shared::loadJS("res/entities.js"); } 
                else if ($link === NULL) {  } 
            break; 
            
            case "new":  
                                              
            break;
        } ?>
    </body>
</html>