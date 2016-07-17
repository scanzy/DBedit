<?php

require_once "../../autoload.php";

//API entities/del (deletes entity)

Errors::setModeAjax();
Auth::requireLevel(Auth::EDITOR);

//gets params
$type = Params::requiredString('type');
$id = Params::requiredInt('id');

//gets helper for entity
$entities = Entities::helper($type);
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//gets helpers for links 
$links = Links::helpers($type);

//USE TRIGGERS INSTEAD OF THIS
foreach($links as $link) $link->delAll($id); //deletes links
$entities->del($id); //deletes entity