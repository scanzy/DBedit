<?php

require_once __DIR__."/autoload.php"; //starts session and autoloads classes

//sets error handler
Errors::setModeHtml();

//gets configuration
$conf = Config::get();
$appname = $conf['global']['appname'];
$landpage = (isset($conf['global']['landpage'])) ? $conf['global']['landpage'] : "";
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title><?php echo $appname; ?> - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

        <link rel="stylesheet" type="text/css" href="res/bootstrap-ex.css" />
        <link rel="stylesheet" type="text/css" href="res/style.css" />

        <script src="res/libs/requiredata.js"></script>
        <script src="res/libs/translate.js"></script>
        <script src="res/libs/shake.js"></script>
    </head>
    <body>

        <div style="height: 6em;"></div>

        <div id="header" class="center container noselect">
            <h1 class="inline"><?php echo $appname; ?></h1>
        </div>

        <div class="container">
            <div class="row noselect">
                <div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                    <form id="login" class="box" role="form">
                        <div class="form-group">
                            <label for="username">Username:</label>
                            <input type="text" class="form-control" id="username">
                        </div>
                        <div class="form-group">
                            <label for="password">Password:</label>
                            <input type="password" class="form-control" id="password">
                        </div>
                        <p class="center"><span id="wrongpassword" class="label label-danger hidden">Wrong username or password</span></p>
                        <button id="submit" type="submit" class="btn btn-info btn-block disabled">Login</button>
                    </form>
                </div>
            </div>
        </div>

        <div id="landpage-url" class="hidden"><?php echo $landpage; ?></div>

        <script src="res/libs/messages.js"></script>
        <script>
            //disables login button if empty fields
            function checkEmptyFields() {
                $("#submit").toggleClass('disabled', ($("#username").val().trim() == "" || $("#password").val().trim() == ""));
            }

            $(document).ready(checkEmptyFields);
            $("#username, #password").on('input', checkEmptyFields);

            //shows error on submit (overrides default behaviour using ajax post request)
            $("#login").on('submit', function (e) {
                e.preventDefault();
                if ($("#submit").hasClass('disabled')) return false;

                $.post("./apis/auth/login.php", { username: $("#username").val(), password: $("#password").val() }, 
                function (data) {

                    //shakes on error
                    if (data == null || data == "") { $("#wrongpassword").removeClass('hidden'); shake($("#login")); }    

                    else { 
                        sessionStorage.setObject('userdata', data); //saves userdata
                    
                        var landpage = $("#landpage-url").text(); //and redirects on success
                        window.location.href = "./" + ((landpage == "") ? "" : ("?type=" + landpage)); 
                    }
                });
            });
        </script>        
    </body>
</html>
