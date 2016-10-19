<?php
    
session_start();
date_default_timezone_set('GMT');
spl_autoload_register(function($class) //autoload modules
{ 
    require_once __DIR__."/modules/$class.php"; //loads module
    
    if (method_exists($class, "init")) //inits class
    call_user_func(array($class, 'init'));
}); 

//to display when js disabled
function noScript() { ?>
<noscript>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2 col-sm-12">
                <div class="box center">
                    <h2><span class="label label-danger">Javascript is disabled or not supported</span></h2>
                    <div class="line"></div>
                    <div style="height:2em"></div>
                    <h4>Probably your browser is too old, you should try updating it</h4>
                    <h5>We recommend Mozilla Firefox or Google Chrome</h5>
                    <div style="height:2em"></div>
                    <h3>
                        <a href="https://www.mozilla.org/firefox/" class="btn btn-success">Download Firefox</a>
                        <a href="https://www.google.com/chrome/" class="btn btn-info">Download Chrome</a>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</noscript> 
<?php } ?>