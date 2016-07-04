<?php

//MODULE Shared (connection and output functions)

class Shared
{
    //CONNECTION

    const CONN_VAR_NAME = 'DBedit-conn';

    //if not already connected, connects to database, returning the pdo object
    public static function connect()
    {
        //returns previous connection if already connected
        if (isset($GLOBALS[CONN_VAR_NAME])) return $GLOBALS[CONN_VAR_NAME];

        //reads configuration from config.ini if needed
        $conf = Config::get();

        //connects to database
        $GLOBALS[CONN_VAR_NAME] = new PDO("mysql:". 
            "host=".$conf['DB']['host'].(isset($conf['DB']['port']) ? $conf['DB']['port'] : "")
            .";dbname=".$conf['DB']['name'].";charset=utf8", 
            $conf['DB']['user'], $conf['DB']['pwd']);

        $GLOBALS[CONN_VAR_NAME]->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $GLOBALS[CONN_VAR_NAME];      
    }

    //OUTPUT

    //redirects to some page
    public static function redirect($url){ echo "<script>window.location = '".$url."'</script>"; exit(); }

    //sends json to client
    public static function sendJSON($obj)
    {
        header("Content-Type: application/json");
        echo json_encode($obj);
        exit();
    }
}

?>