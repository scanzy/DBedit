<?php
    
//MODULE Links

class Links extends SQLhelper
{
    //gets helper for specified types
    public static function helper($type1, $type2)
    {
        $typeinfo = LinkTypes::one($type1, $type2);
        return ($typeinfo == NULL) ? NULL : new Links($typeinfo); 
    }

    //gets helpers for specified type
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