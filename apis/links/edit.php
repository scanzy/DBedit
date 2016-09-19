<?php

require_once "../../autoload.php";

//API links/edit (edits link or creates a new one if linkid param not specified)

Errors::setModeAjax();
Auth::requireLevel(Auth::EDITOR);

//gets helper
$links = Links::helper(Params::requiredString('type'), Params::requiredString('link'));
if ($links == NULL) Errors::send(400, "No linktypes found");

//gets optional param linkid (new link if no linkid, edit link if found linkid param)
$linkid = Params::optionalInt('linkid', NULL);

//gets data
$data = Params::requiredArray('data');

//checks columns
$unknowncol = $links->checkColumns($data);
if ($unknowncol !== FALSE) Errors::send(400, "Unknown column '$unknowncol'");

//checks types
$wrongtypecol = $links->checkTypes($data);
if ($wrongtypecol !== FALSE) Errors::send(400, "Wrong type for column '$wrongtypecol'");

//checks nonempty columns
$emptycol = $links->checkEmpties($data, ($linkid == NULL));
if ($emptycol !== FALSE) Errors::send(400, "Column '$emptycol' can't be empty");

//checks bounds
$outofboundcol = $links->checkBounds($data);
if ($outofboundcol !== FALSE) Errors::send(400, "Value of column '$outofboundcol' out of bounds");

//checks unique columns
$duplicatecol = $links->checkUniques($linkid, $data);
if ($duplicatecol !== FALSE) Errors::send(400, "Invalid value for column '$duplicatecol': found record with same value");

//gets id and linkedid and inerts them into data as id1 or id2
$data[$links->mainFiltCol] = Params::requiredInt('id');
$data[$links->auxFiltCol] = Params::requiredInt('linkedid');

if ($linkid === NULL) //new entity
    $linkid = $links->insert($data);
else //edit entity
    $links->update($linkid, $data);

echo $linkid; //sends id of created/edited link