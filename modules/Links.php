<?php
    
//MODULE Links

class Links extends SQLhelper
{
    //gets helper for specified link type
    public static function helper($type, $link)
    {
        //gets info
        $typeinfo = LinkTypes::one($type, $link);
        if ($typeinfo == NULL) return NULL;        

        //creates helper and initializes it
        $links = new Links($typeinfo); 
        $links->mainFiltCol = ($typeinfo['link1'] == $type) ? "id1" : "id2";

        return $links;
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