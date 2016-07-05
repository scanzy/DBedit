<?php

//MODULE Entity (manages entities and details)

class Entity extends SQLhelper
{
    //gets helper for specified type
    public static function helper($type) { return new Entity(EntityType::one($type)); }
}