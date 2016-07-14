<?php

require_once "../../autoload.php";

//API linktypes/one (gets one entity)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets data
$types = LinkTypes::one(Params::requiredString('type1'), Params::requiredString('type1'));
if (count($types) <= 0) Errors::send(400, "Unknown link between entity types");

//sends data
Shared::sendJSON($types);