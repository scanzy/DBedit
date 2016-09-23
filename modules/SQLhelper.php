<?php

//MODULE SQLhelper (for easier database management)

class SQLhelper
{
    public $typedata; //type data
    public $table; //table name
    public $columns; //coumns
    public $mainFiltCol; //columns used by filter()

    //creates helper instance 
    public function __construct($info) { 
        $this->typedata = $info; 
        $this->table = $info['table']; 
        $this->columns = $info['columns']; 
    }

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
        $stmt = Shared::connect()->query("SELECT * FROM \x60".$this->table."\x60;");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //gets one element in table
    public function one($id)
    {
        $stmt = Shared::connect()->query("SELECT * FROM \x60".$this->table."\x60 WHERE id=$id LIMIT 1;");
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    //gets random elements in table
    public function getRandom($count = 3)
    {
        //uses count from typedata if specified
        if (isset($this->typedata['random'])) $count = $this->typedata['random'];

        $stmt = Shared::connect()->query("SELECT * FROM \x60".$this->table."\x60 ORDER BY RAND() LIMIT $count;");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //gets random elements in table using a filter
    public function getRandomFiltered($val, $count = 3)
    {
        //uses count from typedata if specified
        if (isset($this->typedata['random'])) $count = $this->typedata['random'];

        $stmt = Shared::connect()->prepare("SELECT * FROM \x60".$this->table."\x60 WHERE \x60".$this->mainFiltCol."\x60=:x ORDER BY RAND() LIMIT $count;");
        $stmt->execute(array(":x" => $val));
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //counts elements
    public function count()
    {
        $stmt = Shared::connect()->query("SELECT COUNT(*) FROM \x60".$this->table."\x60;");
        return $stmt->fetch()[0];
    }

    //counts elements with filter
    public function countFiltered($val)
    {
        $stmt = Shared::connect()->prepare("SELECT COUNT(*) FROM \x60".$this->table."\x60 WHERE \x60".$this->mainFiltCol."\x60=:x;");
        $stmt->execute(array(":x" => $val));
        return $stmt->fetch()[0];
    }

    //gets elements with one where clause 
    public function filter($val)
    {
        $stmt = Shared::connect()->prepare("SELECT * FROM \x60".$this->table."\x60 WHERE \x60".$this->mainFiltCol."\x60=:x;");
        $stmt->execute(array(":x" => $val));
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //gets elements with not in clause
    public function filterNotIn($helper2, $val)
    {
        $stmt = Shared::connect()->prepare("SELECT * FROM \x60".$this->table."\x60 WHERE id NOT IN (SELECT \x60".$helper2->auxFiltCol
            ."\x60 FROM \x60".$helper2->table."\x60 WHERE \x60".$helper2->mainFiltCol."\x60=:x);");
        $stmt->execute(array(":x" => $val));
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    //inserts element (check columns, types and nulls before calling this)
    public function insert($data)
    {
        //prepares query
        $columns = $values = "";
        foreach($data as $col => $val) { $columns .= "\x60".$col."\x60,"; $values .= ":".$col.","; }
        $columns = rtrim($columns, ","); $values = rtrim($values, ","); //removes last commas

        //prepares statement
        $conn = Shared::connect();
        $stmt = $conn->prepare("INSERT INTO \x60".$this->table."\x60 ($columns) VALUES ($values)");

        foreach($data as $col => $val) $stmt->bindValue(":".$col, Types::smartCast($val)); //binds values
        $stmt->execute(); //executes

        return $conn->lastInsertId(); //returns id of created/edited entity
    }

    //updates element (check types and nulls before calling this)
    public function update($id, $data)
    {
        //prepares query
        $set = "";
        foreach($data as $col => $val) { $set .= "\x60".$col."\x60=:".$col.","; }
        $set = rtrim($set, ","); //removes last comma

        //prepares statement
        $stmt = Shared::connect()->prepare("UPDATE \x60".$this->table."\x60 SET $set WHERE id=$id");

        foreach($data as $col => $val) $stmt->bindValue(":".$col, Types::smartCast($val)); //binds values
        return $stmt->execute(); //executes
    }

    //deletes element(s)
    public function del($id) { return Shared::connect()->exec("DELETE FROM \x60".$this->table."\x60 WHERE id=$id;"); }
    public function delEx($where) { return Shared::connect()->exec("DELETE FROM \x60".$this->table."\x60 WHERE $where"); }
   
    //checks if data has only columns of this table
    public function checkColumns($data)
    { foreach($data as $colname => $val) if (!isset($this->columns[$colname])) return $colname; return FALSE;}

    //checks if data has data of correct type
    public function checkTypes($data)
    { 
        foreach($data as $col => $val)
            switch($this->columns[$col]['type'])
            {
                case "text":
                case "string": if (!Types::is_str($val)) return $col; break;
                case "int": if (!Types::is_int($val)) return $col; break;
                case "date": if (!Types::is_date($val)) return $col; break;
                case "bool": if ($val != "0" && $val != "1") return $col; break;
            }
        return FALSE;
    }

    //checks not null columns in data
    public function checkEmpties($data, $forinsert)
    { 
        foreach($this->nonEmptyColumns() as $colname => $col)
            if (!isset($data[$colname])) //checks if is set
            {
                if ($forinsert === TRUE) return $colname; //if for insert all non empty fields must be specified
            }
            else 
            {
                if ($data[$colname] === NULL) return $colname; //checks if is null
                if ($col['type'] == "string")
                    if (trim($data[$colname]) == "") return $colname; //checks if is empty string
            }
        return FALSE;
    }

    //check bounds (min max)
    public function checkBounds($data)
    {
        foreach($this->columns as $colname => $col)
        {
            if (isset($col['max'])) if ($data[$colname] > $col['max']) return $colname;
            if (isset($col['min'])) if ($data[$colname] < $col['min']) return $colname;
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
                $where = "\x60$colname\x60=:$colname";

                //if updating row, it doesn't check this row
                if ($id != NULL) $where = "id<>$id AND $where";

                $stmt = Shared::connect()->prepare("SELECT COUNT(*) FROM \x60".$this->table."\x60 WHERE $where;");
                $stmt->execute(array(":$colname" => $data[$colname]));
                if ($stmt->fetch()[0] > 0) return $colname;
            }
        return FALSE;
    }

    //gets unique values
    public function uniques($id)
    {
        //prepares columns list
        $cols = ""; foreach($this->uniqueColumns() as $colname => $col) $cols .= " \x60$colname\x60,";

        //no query if no uniques
        if ($cols == "") return array();

        //executes query
        $stmt = Shared::connect()->query("SELECT" . rtrim($cols, ",") . " FROM \x60".$this->table."\x60". (($id === NULL) ? "" : " WHERE id<>$id").";");
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}