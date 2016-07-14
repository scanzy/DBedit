<?php

require_once "../../autoload.php";

//API auth/info (gets data for this user)

Errors::setModeAjax();

//checks login
if (!Auth::isLogged()) Errors::send(401, "Login required"); //no login

Shared::sendJSON(Users::info(Auth::username())); //sends user data