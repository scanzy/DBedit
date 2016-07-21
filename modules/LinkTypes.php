<?php
    
//MODULE LikTypes (manages link types)

class LinkTypes extends XMLhelper
{
    public static $XML_FILE;
    public static $VAR_NAME = "DBedit-links";

    //called on load
    public static function init() { self::$XML_FILE = __DIR__."/../config/links.xml"; }

    //gets links type data 
    public static function filter($type)
    {
        //gets all types
        $linktypes = static::get();

        $data = array();
        foreach($linktypes as $linkname => $linkdata) //searches link types
            if ($linkdata['link1'] == $type || $linkdata['link2'] == $type)
                $data[$linkname] = $linkdata;
                 
        return $data;
    }

    //gets specific link type data 
    public static function one($type, $link)
    {
        //gets all types
        $linktypes = static::get();

        //finds type
        foreach($linktypes as $linkinfo)
            if ((($linkinfo['link1'] == $type) && ($linkinfo['link2'] == $link)) || 
            (($linkinfo['link2'] == $type) && ($linkinfo['link1'] == $link)))
                return $linkinfo;

        return NULL;
    }

    //gets info about links that connect something    
    public static function info($type, $id)
    {
        //gets data from xml files
        $linktypes = static::get(); 
        $types = EntityTypes::get();

        $data = array(); //gets additional data
        foreach($linktypes as $linktype => $typedata)
            if ($typedata['link1'] == $type || $typedata['link2'] == $type)
            {
                $h = new Links($typedata); //gets helper
                $h->mainFiltCol = ($typedata['link1'] == $type) ? "id1" : "id2";

                $displayname = $types[$typedata['link1']]['displayname']; //gets display name
                if ($displayname == $types[$type]['displayname']) $displayname = $types[$typedata['link2']]['displayname'];

                $data[$linktype] = array(
                    'displayname' => $displayname,
                    'type' => $type,
                    'link' => ($typedata['link1'] == $type) ? $typedata['link2'] : $typedata['link1'],
                    'linkedidcol' => ($typedata['link1'] == $type) ? "id2" : "id1",
                    'description' => $typedata['description'],
                    'itemscount' => $h->countFiltered($id), //counts items
                    'somerandom' => $h->getRandomFiltered($id) //some random elements
                );
        }

        return $data;
    }
}
