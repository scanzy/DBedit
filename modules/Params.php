<?php

//MODULE Params (request params processing)

class Params
{
    //gets value (error if not found)
    public static function requiredInt($name)
    {
        if (!isset($_REQUEST[$name])) Errors::send(400, "Required int param '$name'");
        return intval($_REQUEST[$name]);
    }

    //gets value (error if not found)
    public static function requiredString($name)
    {
        if (!isset($_REQUEST[$name])) Errors::send(400, "Required string param '$name'");
        return strval($_REQUEST[$name]);
    }

    //gets value (error if not found)
    public static function requiredArray($name)
    {
        if (!isset($_REQUEST[$name])) Errors::send(400, "Required object/array param '$name'");
        if (!is_array($_REQUEST[$name])) Errors::send(400, "Required object/array param '$name' is not object/array");
        return $_REQUEST[$name];
    }

    //gets value (default if not found)
    public static function optionalInt($name, $default)
    {
        if (!isset($_REQUEST[$name])) return $default;
        return intval($_REQUEST[$name]);
    }

    //gets value (default if not found)
    public static function optionalString($name, $default)
    {
        if (!isset($_REQUEST[$name])) return $default;
        return strval($_REQUEST[$name]);
    }

    //gets value (default if not found)
    public static function optionalBool($name, $default)
    {
        if (!isset($_REQUEST[$name])) return $default;        
        if (in_array(trim(strtolower($_REQUEST[$name])), array('true', '1', 'on', 'yes'))) return TRUE; //checks true        
        if (in_array(trim(strtolower($_REQUEST[$name])), array('false', '0', 'off', 'no'))) return FALSE; //checks false 
        return $default; //fallback
    }
}