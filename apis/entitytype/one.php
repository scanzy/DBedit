<?php

require_once "../../autoload.php";

//API entitytype/one (gets one entity type data)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(EntityType::one(Params::requiredString('type')));