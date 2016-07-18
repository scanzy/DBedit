<?php
    
//MODULE XMLhelper (used to easily manage ini files)

class XMLhelper
{
    public static $XML_FILE = ""; //__DIR__."/path/to/file.xml";
    public static $VAR_NAME = "";

    //loads configuration in $_SESSION[$VAR_NAME] reading from xml file
    public static function load()
    {
        $_SESSION[static::$VAR_NAME] = XMLcore::read_xml_file(static::$XML_FILE); //gets data
        if ($_SESSION[static::$VAR_NAME] === FALSE) 
        {
            unset($_SESSION[static::$VAR_NAME]); //ON ERROR
            Errors::send(500, "Error while parsing xml file");            
        }
    }

    //gets configuration (using session cache if possible)
    public static function get()
    {
        //loads config if needed
        if (!isset($_SESSION[static::$VAR_NAME])) static::load();
        return $_SESSION[static::$VAR_NAME];
    }

    //writes configuration in $_SESSION[VAR_NAME] to XML_FILE
    public static function save()
    {
        if(XMLcore::write_xml_file(static::$XML_FILE, $_SESSION[static::$VAR_NAME]) == FALSE)
            Errors::send(500, "Error while saving to xml file");
    }
}