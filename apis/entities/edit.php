<?php

require_once "../../autoload.php";

//API entities/edit (edits entity or creates a new one if id param not specified)

Errors::setModeAjax();
Auth::requireLevel(Auth::EDITOR);

//gets helper
$entities = Entities::helper(Params::requiredString('type'));
if ($entities == NULL) Errors::send(400, "Unknown entity type");

//gets optional param id (new entity if no id, edit entity if found id param)
$id = Params::optionalInt('id', NULL);

//gets data
$data = Params::requiredArray('data');

//checks columns
$unknowncol = $entities->checkColumns($data);
if ($unknowncol !== FALSE) Errors::send(400, "Unknown column '$unknowncol'");

//checks types
$wrongtypecol = $entities->checkTypes($data);
if ($wrongtypecol !== FALSE) Errors::send(400, "Wrong type for column '$wrongtypecol'");

//checks nonempty columns
$emptycol = $entities->checkEmpties($data, ($id == NULL));
if ($emptycol !== FALSE) Errors::send(400, "Column '$emptycol' can't be empty");

//checks bounds
$outofboundcol = $entities->checkBounds($data);
if ($outofboundcol !== FALSE) Errors::send(400, "Value of column '$outofboundcol' out of bounds");

//checks unique columns
$duplicatecol = $entities->checkUniques($id, $data);
if ($duplicatecol !== FALSE) Errors::send(400, "Invalid value for column '$duplicatecol': found record with same value");

if ($id === NULL) //new entity
    $id = $entities->insert($data);
else //edit entity
    $entities->update($id, $data);

echo $id; //sends id of created/edited entity