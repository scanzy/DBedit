<?php

//MODULE EntityType (manages entity types)

class EntityType extends XMLhelper
{
    public static $XML_FILE = __DIR__."/../config/entities.xml";
    public static $VAR_NAME = "DBedit-entities";

    //gets info about entity of specified type
    public static function one($type)
    {
        //gets all types
        $entitytypes = EntityType::get();

        if(!isset($entitytypes[$type])) Errors::send(400, "Unknown entity type");
        return $entitytypes[$type]; //gets desired type
    }

    //gets info about entity types 
    public static function info()
    {
        $types = static::get(); //gets data from xml file
        
        $data = array(); //gets additional data
        foreach($types as $type => $typedata)
        {
            $h = Entity::helper($type); //gets helper

            $data[$type] = array(
                'displayname' => $typedata['displayname'],
                'description' => $typedata['description'],
                'itemscount' => $h->count(), //counts items
                'somerandom' => $h->getRandom() //some random elements
            );
        }

        Shared::sendJSON($data);
    }
}