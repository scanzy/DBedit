<?php
    
session_start();
date_default_timezone_set('GMT');
spl_autoload_register(function($class) //autoload modules
 { 
     require_once __DIR__."/modules/$class.php"; //loads module
     
     if (method_exists($class, "init")) //inits class
        call_user_func(array($class, 'init'));
 }); 