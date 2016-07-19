<?php

require_once "../../autoload.php";

//API linktypes/get (gets link types)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets optional type 
$type = Params::optionalString('type', NULL);

//sends all link types or filtered
if ($type === NULL) Shared::sendJSON(LinkTypes::get());
else Shared::sendJSON(LinkTypes::filter($type));