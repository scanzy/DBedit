<?php

require_once "../../autoload.php";

//API links/del (deletes link)

Errors::setModeAjax();
Auth::requireLevel(Auth::EDITOR);

//gets helper
$links = Links::helper(Params::requiredString('type'), Params::requiredString('link'));
if ($links == NULL) Errors::send(400, "No linktypes found");

//deletes link
$links->del(Params::requiredInt('linkid'));