<?php

require_once __DIR__."/autoload.php"; //starts session and autoloads classes

//sets error handler
Errors::setModeHtml();

//redirects to login page if no login 
if (!Auth::isLogged()) Shared::redirect("./login.php");

//default page
$url = Params::optionalString('url', "");
if ($url == "") Shared::redirect("./dashboard");

//gets configuration
$conf = Config::get();
$appname = $conf['Global']['appname'];

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

<?php 

//sfanfani

?>

                    <li><a href="dashboard"><span>Dashboard</span></a></li>
                    </li><li><a href="files">Files</a>
                    </li><li><a href="templates">Templates</a>
                    </li><li><a href="settings">Settings</a>
                    </li><li class="right"><a href="#" id="logout">Logout</a>
                    </li><li class="right"><a href="help">Help</a>
                    </li>
                </ul>
            </div>
        </nav>

        <div id="header" class="center container noselect">
            <h1 class="inline"><?php echo $appname; ?></h1>
            <h2 class="inline">admin</h2>
        </div>

        <?php switch ($url) { case "dashboard": ?>
        <div class="container page">
            <div class="box title"><h1>Dashboard</h1></div>

            <div class="box">
                <h2>Heading</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ipsum sed dolor vehicula congue quis egestas risus. Cras tortor felis, convallis eget euismod et, varius nec sapien. Pellentesque quis augue sit amet justo faucibus condimentum id non metus. Nullam maximus molestie ex sit amet sagittis. Vivamus non neque tellus. Phasellus tincidunt tellus sit amet nulla pellentesque feugiat. In augue metus, dignissim at egestas vel, ornare sed nibh. Aliquam elementum, purus ut consectetur accumsan, ex nibh efficitur orci, quis maximus augue elit quis libero. Vestibulum feugiat, purus id volutpat sodales, lacus arcu varius neque, ut rutrum mauris magna a leo. </p>                
            </div>
        </div>

        <?php break; case "entity": ?>

        <div class="container page">
            <div class="box title"><h1>Entity</h1></div>

            <div class="box">
                <h2>Heading</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et ipsum sed dolor vehicula congue quis egestas risus. Cras tortor felis, convallis eget euismod et, varius nec sapien. Pellentesque quis augue sit amet justo faucibus condimentum id non metus. Nullam maximus molestie ex sit amet sagittis. Vivamus non neque tellus. Phasellus tincidunt tellus sit amet nulla pellentesque feugiat. In augue metus, dignissim at egestas vel, ornare sed nibh. Aliquam elementum, purus ut consectetur accumsan, ex nibh efficitur orci, quis maximus augue elit quis libero. Vestibulum feugiat, purus id volutpat sodales, lacus arcu varius neque, ut rutrum mauris magna a leo. </p>                
            </div>
        </div>

        <?php break; default: ?><script>window.location.href = "./";</script><?php echo "</body></html>"; exit(); break; } ?>

        <div id="footer">
            <span>Powered by <b>ScanzySoftware</b></span>
        </div>  

        <script src="res/libs/messages.js"></script>
        <script src="res/libs/confirm.js"></script>
        <script src="res/libs/scanzytable.js"></script>
        <script src="res/shared.js"></script>
        
        <script src="res/pages-<?php echo $url; ?>.js"></script>
    </body>
</html>
