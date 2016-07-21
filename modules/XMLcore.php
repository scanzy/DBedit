<?php
    
//MODULE XMLcore (used to easy get/set data from/to xml file to/from array)

class XMLcore
{
    //reads xml from file into array
    public static function read_xml_file($file)  { return self::xml2arr(simplexml_load_file($file)); }

    //converts SimpleXMLElement to array
    public static function xml2arr($xml)
    {
        $arr = array(); //loops through object properties
        foreach($xml->children() as $key => $value)
            if ($value->count() > 0) //if there is some child element
                $arr[$key] = self::xml2arr($value); //recursively sets it

            //add simple child otherwise
            else $arr[$key] = Types::smartCast((string) $value[0]); 
        return $arr;
    }

    //writes array to xml
    public static function write_xml_file($file, $data)
    { 
        //creates document for formatting
        $dom = new DOMDocument('1.0');
        $dom->preserveWhiteSpace = FALSE;
        $dom->formatOutput = TRUE;
        
        $dom->loadXML(self::arr2xml(data)->asXML()); //loads xml
        return $dom->save($file); //saves to file
    }

    //converts an array to SimpleXMLElement
    public static function arr2xml($data)
    { return self::xmlAddChildrenArray(new SimpleXMLElement(), data); }

    public static function xmlAddChildrenArray($xml, $data)
    {
        //loops through array items
        foreach($data as $key => $value)
            
            if (is_array($value)) //if there is some nested array
                self::xmlAddChildrenArray($xml->addChild($key), $value); //recursively set children

            //add simple child otherwise
            else $xml->addChild($key, $value); 
        return $xml;
    }
}