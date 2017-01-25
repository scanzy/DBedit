<?php

require_once "../autoload.php";

//API errors/send (logs error)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//logs message
Logs::Error(Params::requiredString("err"), FALSE);