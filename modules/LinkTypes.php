<?php
    
//MODULE LikTypes (manages link types)

class LinkTypes extends XMLhelper
{
    public static $XML_FILE;
    public static $VAR_NAME = "DBedit-links";

    //called on load
    public static function init() { self::$XML_FILE = __DIR__."/../config/links.xml"; }

    //gets links type data 
    public static function filter($type)
    {
        //gets all types
        $linktypes = static::get();

        $data = array();
        foreach($linktypes as $linkname => $linkdata) //searches link types
            if ($linkdata['link1'] == $type || $linkdata['link2'] == $type)
                $data[$linkname] = $linkdata;
                 
        return $data;
    }

    //gets specific link type data 
    public static function one($type)
    {
        //gets all types
        $linktypes = static::get();

        //finds type
        if (!isset($linktypes[$type])) return NULL;
        return $linktypes[$type];
    }

    //gets info about links that connect something    
    public static function info($type)
    {
        //gets data from xml files
        $linktypes = static::get(); 
        $types = EntityTypes::get();

        $data = array(); //gets additional data
        foreach($linktypes as $linktype => $typedata)
            if ($typedata['link1'] == $type || $typedata['link2'] == $type)
            {
                $h = new Links($typedata); //gets helper

                $displayname = $types[$typedata['link1']]['displayname']; //gets display name
                if ($displayname == $types[$type]['displayname']) $displayname = $types[$typedata['link2']]['displayname'];

                $data[$linktype] = array(
                    'displayname' => $displayname,
                    'description' => $typedata['description'],
                    'itemscount' => $h->count(), //counts items
                    'somerandom' => $h->getRandom() //some random elements
                );
        }

        return $data;
    }
}
