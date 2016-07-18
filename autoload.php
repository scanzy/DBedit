<?php
    
session_start();
spl_autoload_register(function($class) //autoload modules
 { 
     require_once __DIR__."/modules/$class.php"; //loads module
     
     if (method_exists($class, "init")) //inits class
        call_user_func(array($class, 'init'));
 }); 