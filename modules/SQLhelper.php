<?php

//MODULE SQLhelper (for easier database management)

class SQLhelper
{
    public $table; //table name
    public $columns; //coumns

    //creates helper instance 
    public function __construct($info) { $this->table = $info['table']; $this->columns = $info['columns']; }

    //gets unique columns 
    function uniqueColumns()
    {
        $uniquecols = array(); 
        foreach($this->columns as $colname => $col) 
            if ($col['unique'] === TRUE) 
                $uniquecols[$colname] = $col; 
        return $uniquecols;        
    }

    //gets non-empty columns()
    function nonEmptyColumns()
    {
        $nonemptycols = array(); 
        foreach($this->columns as $colname => $col) 
            if ($col['allowempty'] === FALSE) 
                $nonemptycols[$colname] = $col; 
        return $nonemptycols;
    }

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

    //inserts element (check columns, types and nulls before calling this)
    public function insert($data)
    {
        //prepares query
        $columns = $values = "";
        foreach($data as $col => $val) { $columns .= $col.","; $values .= ":".$col.","; }
        $columns = rtrim($columns, ","); $values = rtrim($values, ","); //removes last commas

        //prepares statement
        $conn = Shared::connect();
        $stmt = $conn->prepare("INSERT INTO ".$this->table." ($columns) VALUES ($values)");

        foreach($data as $col => $val) $stmt->bindValue(":".$col, $val); //binds values
        $stmt->execute(); //executes

        return $conn->lastInsertId(); //returns id of created/edited entity
    }

    //updates element (check types and nulls before calling this)
    public function update($id, $data)
    {
        //prepares query
        $set = "";
        foreach($data as $col => $val) { $set .= $col."=:".$col.","; }
        $set = rtrim($set, ","); //removes last comma

        //prepares statement
        $stmt = Shared::connect()->prepare("UPDATE ".$this->table." SET $set WHERE id=$id");

        foreach($data as $col => $val) $stmt->bindValue(":".$col, $val); //binds values
        return $stmt->execute(); //executes
    }

    //deletes element(s)
    public function del($id) { return Shared::connect()->exec("DELETE FROM ".$this->table." WHERE id=$id;"); }
    public function delEx($where) { return Shared::connect()->exec("DELETE FROM ".$this->table." WHERE $where"); }
   
    //checks if data has only columns of this table
    public function checkColumns($data)
    { foreach($data as $col => $val) if (!isset($this->columns[$col])) return $colname; return FALSE;}

    //checks if data has data of correct type
    public function checkTypes($data)
    { 
        foreach($data as $col => $val)
            switch($this->columns[$col]['type'])
            {
                case "varchar": if (!is_string($val)) return $colname; break;
                case "int": if (!is_int($val)) return $colname; break;
            }
        return FALSE;
    }

    //checks not null columns in data
    public function checkEmpties($data, $forinsert)
    { 
        foreach($this->nonEmptyColumns() as $colname => $col)
            if (!isset($data[$colname])) //checks if is set
            {
                if (forinsert === TRUE) return $colname; //if for insert all non empty fields must be specified
            }
            else 
            {
                if ($data[$colname] === NULL) return $colname; //checks if is null
                if ($col['type'] == "varchar") //checks if is empty string
                    if (trim($data[$colname]) == "") return $colname;
            }
        return FALSE;
    }

    //checks unique columns in data (used for inserts and edits)
    //if updating row, pass row id, NULL otherwise
    public function checkUniques($id, $data)
    {        
        foreach($this->uniqueColumns() as $colname => $col)        
            if (isset($data[$colname]))
            {
                $where = "$colname=".$data[$colname];

                //if updating row, it doesn't check this row
                if ($id != NULL) $where = "id<>$id AND $where";

                $stmt = Shared::connect()->query("SELECT COUNT(*) FROM ".$this->table." WHERE $where;");
                if ($stmt->fetch()[0] > 0) return $colname;
            }
        return FALSE;
    }
}