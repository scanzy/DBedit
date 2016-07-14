<?php

require_once "../../autoload.php";

//API linktypes/info (gets entity types with additional info)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets data
$types = LinkTypes::info(Params::requiredString('type'));
if ($types === NULL) Errors::send(400, "Unknown entity type");

//sends data
Shared::sendJSON($types);