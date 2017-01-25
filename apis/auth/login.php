<?php

require_once "../../autoload.php";

//API auth/login (tries log in)

Errors::setModeAjax();

//check parameters
$user = Params::requiredString('username');
$pwd = Params::requiredString('password');
 
$ok = Auth::login($user, $pwd); //tries login
Logs::Login($user, $ok); //logs access

if ($ok == FALSE) exit(); //login failed
Shared::sendJSON(Users::info($user)); //sends user data