<?php

require_once "../../autoload.php";

//API auth/login (tries log in)

Errors::setModeAjax();

//check parameters
$user = Params::requiredString('username');
$pwd = Params::requiredString('password');
        
if (Auth::login($user, $pwd) == FALSE) exit(); //login failed

Shared::sendJSON(Users::info($user)); //sends user data