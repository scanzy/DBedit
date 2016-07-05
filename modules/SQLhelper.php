<?php

//MODULE SQLhelper (for easier database management)

class SQLhelper
{
    public $table; //table name

    //creates helper instance 
    public function __construct($info) { $this->table = $info['table']; }

    //gets all elements in table
    public function get()
    {
        $stmt = Shared::connect()->query("SELECT * FROM ".$this->table.";");
        return $stmt->fetchAll();
    }

    //gets random elements in table
    public function getRandom($count = 3)
    {
        $stmt = Shared::connect()->query("SELECT * FROM ".$this->table." ORDER BY RAND() LIMIT $count;");
        return $stmt->fetchAll();
    }

    //counts elements
    public function count()
    {
        $stmt = Shared::connect()->query("SELECT COUNT(*) FROM ".$this->table.";");
        return $stmt->fetch()[0];
    }
}