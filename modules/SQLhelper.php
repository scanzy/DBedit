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
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //gets one element in table
    public function one($id)
    {
        $stmt = Shared::connect()->query("SELECT * FROM ".$this->table." WHERE id=$id LIMIT 1;");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    //gets random elements in table
    public function getRandom($count = 3)
    {
        $stmt = Shared::connect()->query("SELECT * FROM ".$this->table." ORDER BY RAND() LIMIT $count;");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //counts elements
    public function count()
    {
        $stmt = Shared::connect()->query("SELECT COUNT(*) FROM ".$this->table.";");
        return $stmt->fetch()[0];
    }

    //inserts element
    public function insert($data)
    {
        
    }

}