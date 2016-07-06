<?php

require_once "../../autoload.php";

//API entity/one (gets one entity)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

Shared::sendJSON(Entity::helper(Params::requiredString('type'))->one(Params::requiredInt('id')));