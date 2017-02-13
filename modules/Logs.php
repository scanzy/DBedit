<?php

//MODULE Logs (logs errors/accesses)

class Logs
{
    public static $ERRORS_FILE, $ACCESSES_FILE;

    //called on load
    public static function init() { 
        self::$ERRORS_FILE   = __DIR__."/../logs/errors.log";
        self::$ACCESSES_FILE = __DIR__."/../logs/accesses.log";
    }

    //logs error
    public static function Error($msg, $isServerError = TRUE)
     { self::AppendWithTime(self::$ERRORS_FILE, Auth::username(), (($isServerError) ? "SERVER" : "CLIENT")." ERROR: ".$msg."\n"); }

    //logs access
    public static function Login($user, $ok = TRUE) 
    { self::AppendWithTime(self::$ACCESSES_FILE, $user, "LOGIN ".(($ok) ? "OK" : "FAIL")); }

    //logs generic string 
    static function AppendWithTime($file, $user, $msg) { self::Append($file, date('Y-m-d H:i:s')." user: '$user' \t\t message: $msg\n"); }
    static function Append($file, $newline) { @file_put_contents($file, $newline.PHP_EOL, FILE_APPEND | LOCK_EX); }
}