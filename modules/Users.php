<?php

//MODULE Users

class Users extends XMLhelper
{
    public static $XML_FILE = __DIR__."/../config/users.xml";
    public static $VAR_NAME = "DBedit-users";

    //gets userdata from username
    public static function one($username)
    {
        //gets all users
        $users = Users::get();

        //gets desired user searching into types
        foreach($users as $groupname => $usergroup) 
            if(isset($usergroup[$username]))
            {
                //saves also userlevel
                $usergroup[$username]['userlevel'] = Auth::$userlevels[$groupname];
                return $usergroup[$username]; 
            }

        Errors::send(400, "Unknown username");
    }

    //gets info about user
    public static function info($username)
    {
        $data = Users::one($username); //gets data
        return array(
            'username'  => $username,
            'userlevel' => $data['userlevel'],
            'name'      => $data['name'],
            'surname'   => $data['surname']);
    }
}

?>