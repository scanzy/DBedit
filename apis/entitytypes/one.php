<?php

require_once "../../autoload.php";

//API entitytypes/one (gets one entity type data)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets type data
$typedata = EntityTypes::one(Params::requiredString('type'));
if ($typedata == NULL) Errors::send(400, "Unknown type");

Shared::sendJSON($typedata);