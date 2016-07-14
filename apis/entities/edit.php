<?php

require_once "../../autoload.php";

//API entities/edit (edits entity or creates a new one if id param not specified)

Errors::setModeAjax();
Auth::requireLevel(Auth::VIEWER);

//gets helper
$entities = Entities::helper(Params::requiredString('type'));
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//gets optional param id (new entity if no id, edit entity if found id param)
$id = Params::optionalInt('id', NULL);

if ($id == NULL) //new entity
{
    //validates params data
}
else //edit entity
{
    //validates params data
}