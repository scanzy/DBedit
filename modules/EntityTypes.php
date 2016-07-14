<?php

//MODULE EntityTypes (manages entity types)

class EntityTypes extends XMLhelper
{
    public static $XML_FILE = __DIR__."/../config/entities.xml";
    public static $VAR_NAME = "DBedit-entities";

    //gets info about entity of specified type
    public static function one($type)
    {
        //gets all types
        $entitytypes = static::get();

        if(!isset($entitytypes[$type])) return NULL;
        return $entitytypes[$type]; //gets desired type
    }

    //gets info about entity types 
    public static function info()
    {
        $types = static::get(); //gets data from xml file
        
        $data = array(); //gets additional data
        foreach($types as $type => $typedata)
        {
            $h = Entities::helper($type); //gets helper

            $data[$type] = array(
                'displayname' => $typedata['displayname'],
                'description' => $typedata['description'],
                'itemscount' => $h->count(), //counts items
                'somerandom' => $h->getRandom() //some random elements
            );
        }

        return $data;
    }
}