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
    
    //gets array of aliases
    public function aliases()
    {
        //gets all entities
        $entities = $this->get();

        $data = array(); //builds alias
        foreach($entities as $entity)
            $data[] = array('id' => $entity['id'], 'alias' => $this->alias($entity));

        return $data;
    }

    //gets alias from data
    public function alias($entitydata)
    {
        $alias = $this->typedata['alias'];
        foreach($this->columns as $col => $colinfo) 
            $alias = str_ireplace("%$col%", $entitydata[$col], $alias);

        return $alias;
    }
}