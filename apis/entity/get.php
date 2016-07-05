<?php

require_once "../../autoload.php";

//API entity/get (gets entities)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

Shared::sendJSON(Entity::helper(Params::requiredString('type'))->get());