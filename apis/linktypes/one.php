<?php

require_once "../../autoload.php";

//API linktypes/one (gets one link type)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);
Shared::sendJSON(LinkTypes::one(Params::requiredString('link'));