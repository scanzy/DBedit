<?php

require_once "../../autoload.php";

//API auth/login (tries log in)

Errors::setModeAjax();

//checks login
if (!Auth::isLogged()) Errors::send(401, "Login required"); //no login

Shared::sendJSON(Users::info(Auth::username())); //sends user data