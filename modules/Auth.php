<?php

//MODULE Auth (login and authentication)

class Auth
{
    //user types
    const ADMIN = 0;
    const EDITOR = 1;
    const VIEWER = 2;

    //and privilege levels
    public static $userlevels = array(
        "admins" => self::ADMIN,
        "editors" => self::EDITOR,
        "viewers" => self::VIEWER
    );

    //tries login from post parameters
    public static function login($username, $password) 
    {
        $users = Users::get(); //gets users data
        
        //checks if finds user
        foreach($users as $type => $usergroup)
            
            //check if user exists
            if(isset($usergroup[$username])) 

                //checks password
                if ($usergroup[$username]['pwd'] == $password) 
                {
                    //saves username, usertype and level
                    $_SESSION['username'] = $username;
                    $_SESSION['usergroup'] = $type;
                    $_SESSION['userlevel'] = self::$userlevels[$type];

                    return TRUE; //success!
                }

        return FALSE; //login failed
    }

    //checks if there was login
    public static function isLogged() { return isset($_SESSION['username']); } //checks data from session

    //checks if current user has privileges of that certain user (has lower or equal level)
    public static function requireLevel($level) 
    { 
        $code = 401; //sends 401 if no login
        if (self::isLogged()) 
        {
            $code = 403; //sends 403 if no required level
            if ($level >= $_SESSION['userlevel']) return;             
        }
        Errors::send($code, "Required user level $level (".array_search($level, self::$userlevels).")"); 
    }

    //gets data about current user
    public static function username() { return isset($_SESSION['username']) ? $_SESSION['username'] : ""; }
}