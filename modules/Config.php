<?php

//MODULE Config (configuration read/write)

class Config extends XMLhelper
{
    public static $XML_FILE = __DIR__."/../config/config.xml";
    public static $VAR_NAME = "DBedit-config";

    //ini data prototype
    public static $proto = array('DB' => array('host', 'name', 'user', 'pwd'), array('global' => array('appname')));

    //used to store last db modification time
    public static function lastMod() { return filemtime(self::$INI_FILE); }

    //called to touch config file (so we know last modification)
    public static function touch() { touch(self::$INI_FILE); }

    //MOVE THIS TO SOME API
    //test config
    public static function test($host, $name, $user, $pwd)
    {
        // host test here
        if (filter_var(gethostbyname($host), FILTER_VALIDATE_IP) === FALSE) Errors::send(400, "Invalid host '$host'");
                
        //tests db connection config
        $c = new PDO("mysql:host=$host;dbname=$name", $user, $pwd);
    }
}
?>
