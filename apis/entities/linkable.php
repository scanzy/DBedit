<?php

require_once "../../autoload.php";

//API entities/linkable (gets entities that can be linked)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets entities SQLhelper
$entities = Entities::helper(Params::requiredString('link'));
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//gets links helper
$links = Links::helper(Params::requiredString('type'), Params::requiredString('link'));
if ($links == NULL) Errors::send(400, "No linktypes found");

//sends data
Shared::sendJSON($entities->filterNotIn($links, Params::requiredInt('id')));