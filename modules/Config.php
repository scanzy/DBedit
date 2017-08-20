<?php

//MODULE Config (configuration read/write)

class Config extends XMLhelper
{
    public static $VAR_NAME = "DBedit-config";

    //called on load
    public static function init() { self::$XML_FILE = __DIR__."/../config/config.xml"; }

    //used to store last db modification time
    public static function lastMod() { return filemtime(self::$XML_FILE); }

    //called to touch config file (so we know last modification)
    public static function touch() { touch(self::$XML_FILE); }
}