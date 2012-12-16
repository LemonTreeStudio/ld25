//image
var s_backMenu 	    = "TestBox2d/res/bg_mm.png";
var s_backFailed    = "TestBox2d/res/bg_go.png";
var s_backComplete  = "TestBox2d/res/bg_finish.png";
var s_objects 		= "TestBox2d/res/gameObjectsAtl.png";
var s_bg1           = "TestBox2d/res/bg_land1_color.png";

//music
var s_bgMusic = "TestBox2d/res/sounds/L2_BM.mp3";

//effect
var s_jumpEffect = "TestBox2d/res/sounds/jump1.mp3";
var s_deathEffect = "TestBox2d/res/sounds/death_boss.mp3";

// tilemaps resource
var s_tmwDesertSpacingPng = "TestBox2d/res/TileMaps/land1.png";

//plist
var s_objects_plist = "TestBox2d/res/gameObjectsAtl.plist";
var s_object_bodies_plist = "TestBox2d/res/objectsBodies.plist";


var g_ressources = [
    //image
    {type:"image", src:s_backMenu},
    {type:"image", src:s_backFailed},
    {type:"image", src:s_backComplete},
    {type:"image", src:s_objects},    
    {type:"image", src:s_tmwDesertSpacingPng},
    {type:"image", src:s_bg1},

    //tmx ressources
    {type:"tmx", src:"TestBox2d/res/TileMaps/land1.tmx"},

    //plist
    {type:"plist", src:s_objects_plist},
    {type:"plist", src:s_object_bodies_plist},

    //music
    {type:"bgm", src:s_bgMusic},
        
    //effect
    {type:"effect",src:s_jumpEffect},
    {type:"effect",src:s_deathEffect}, 
];
