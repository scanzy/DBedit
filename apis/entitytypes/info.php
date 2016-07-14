<?php

require_once "../../autoload.php";

//API entitytypes/info (gets entity types with additional info)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(EntityTypes::info());