<?php

require_once "../../autoload.php";

//API entitytype/get (gets entity types)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(EntityType::get());