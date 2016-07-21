<?php

//MODULE Types (cast, parse and type check functions)

class Types 
{
    //casts passed string into correct type
    public static function smartCast($s)
    {
        //numeric (float or int)
        if (is_numeric($s))
        {
            if (strpos($s, '.') === FALSE) return intval($s);
            return floatval($s);
        }

        //boolean
        else if (strtolower(trim($s)) == "true") return TRUE;
        else if (strtolower(trim($s)) == "false") return FALSE;

        //null
        else if (strtolower(trim($s)) == "null") return NULL;

        //date
        else if (($date = DateTime::createFromFormat("Y-m-d", $s)) !== FALSE) return $date->format("Y-m-d");

        return $s; //string
    }

    //checks types
    public static function is_str($s) { return is_string($s); }
    public static function is_int($s) { return is_numeric($s) && (strpos($s, '.') === FALSE); }
    public static function is_bool($s) { return in_array(self::smartCast($s), array(TRUE, FALSE), TRUE); }
    public static function is_date($s) { return ($date = DateTime::createFromFormat('Y-m-d', $s)) !== FALSE; }
}