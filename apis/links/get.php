<?php

require_once "../../autoload.php";

//API links/get (gets links)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets helper
$links = Links::helper(Params::requiredString('type'), Params::requiredString('link'));
if ($links == NULL) Errors::send(400, "No linktypes found");

//sends data
Shared::sendJSON($links->get());