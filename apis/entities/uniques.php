<?php

require_once "../../autoload.php";

//API entities/uniques (gets unique values)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets helper
$entities = Entities::helper(Params::requiredString('type'));
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//sends data
Shared::sendJSON($entities->uniques(Params::optionalInt('id', NULL)));