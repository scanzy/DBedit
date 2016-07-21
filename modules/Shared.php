<?php

//MODULE Shared (connection and output functions)

class Shared
{
    //CONNECTION

    const VAR_NAME = 'DBedit-conn';

    //if not already connected, connects to database, returning the pdo object
    public static function connect()
    {
        //returns previous connection if already connected
        if (isset($GLOBALS[self::VAR_NAME])) return $GLOBALS[self::VAR_NAME];

        //reads configuration from config.xml if needed
        $conf = Config::get()['DB'];

        //connects to database
        return $GLOBALS[self::VAR_NAME] = new PDO("mysql:". 
            "host=" . $conf['host'] . (isset($conf['port']) ? $conf['port'] : "")
            .";dbname=". $conf['name'] . ";charset=utf8", 
            $conf['user'], $conf['pwd'],

            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
        );    
    }

    //OUTPUT

    //redirects to some page
    public static function redirect($url){ echo "<script>window.location = '".$url."'</script>"; exit(); }

    //sends script tag
    public static function loadJS($url) { echo "<script src='$url'></script>"; }

    //sends json to client
    public static function sendJSON($obj)
    {
        header("Content-Type: application/json; charset:utf-8;");
        echo json_encode($obj);
        exit();
    }
}

?>