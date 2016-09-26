<?php

require_once "../autoload.php";

//API errors/send (logs error)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//logs message
error_log(" user: '".$_SESSION['username']."' ".Params::requiredString("err"));