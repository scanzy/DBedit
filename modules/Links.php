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
}