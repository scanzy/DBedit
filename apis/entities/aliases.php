<?php

require_once "../../autoload.php";

//API entities/aliases (gets aliases)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets helper
$entities = Entities::helper(Params::requiredString('type'));
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//sends data
Shared::sendJSON($entities->aliases());