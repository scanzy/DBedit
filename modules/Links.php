<?php
    
//MODULE Links

class Links extends SQLhelper
{
    //gets helper for specified link type
    public static function helper($type)
    {
        $typeinfo = LinkTypes::one($type);
        return ($typeinfo == NULL) ? NULL : new Links($typeinfo); 
    }

    //gets helpers for specified entity type
    public static function helpers($type)
    {
        $typesinfo = LinkTypes::filter($type); //filters types
        $helpers = array(); //gets helpers
        foreach($typesinfo as $info) $helpers[] = new Links($info);
        return $helpers;
    }

    //USE TRIGGERS INSTEAD OF THIS
    //deletes all links that link an entity
    public function delAll($id) { return $this->del("id1=$id OR id2=$id"); }
}