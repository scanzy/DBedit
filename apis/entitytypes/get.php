<?php

require_once "../../autoload.php";

//API entitytypes/get (gets entity types)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(EntityTypes::get());