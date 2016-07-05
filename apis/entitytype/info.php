<?php

require_once "../../autoload.php";

//API entitytype/info (gets entity types with additional info)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(EntityType::info());