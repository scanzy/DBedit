<?php

//MODULE Entity (manages entities and details)

class Entities extends SQLhelper
{
    //gets helper for specified type
    public static function helper($type)
    {
        $typeinfo = EntityTypes::one($type);
        return ($typeinfo == NULL) ? NULL : new Entities($typeinfo); 
    }
}