var FinalMenu = cc.Layer.extend(
{
    ctor:function () {
        //cc.associateWithNative( this, cc.Layer );
    },
    
    init:function () 
    {
        var bRet = false;
        if (this._super) 
        {
            var screenSize = cc.Director.getInstance().getWinSize();

            var back = cc.Sprite.create(s_backComplete);
            back.setAnchorPoint(cc.PointZero());
            back.setPosition(cc.PointZero());
            this.addChild(back, -10);

            // Load atlas with sprites
            cc.SpriteFrameCache.getInstance().addSpriteFrames(s_objects_plist, s_objects);

            // accept touch now!
            this.setTouchEnabled(true);

            //accept keypad
            this.setKeyboardEnabled(true);

            var restartNormal = cc.Sprite.createWithSpriteFrameName("replay_n.png");
            var restartSelected = cc.Sprite.createWithSpriteFrameName("replay_s.png");
            var restartDisabled = null;
            var restartGame = cc.MenuItemSprite.create(restartNormal, restartSelected, restartDisabled, this.startGame, this);

            var menu = cc.Menu.create(restartGame);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 102, 200);
            menu.setPosition(750, 70);


            bRet = true;
        }
        return bRet;
    },
    
    onEnter:function() {
        this._super();
    },

    onTouchesBegan:function (touches, event) 
    {
    },

    onTouchesMoved:function (touches, event) 
    {
    },

    onTouchesEnded:function () 
    {
    },

    onKeyDown:function (e) 
    {
    },
    
    onKeyUp:function (e) 
    {
    },

    draw:function() {
    },

    startGame:function (pSender) 
    {
        var scene = cc.Scene.create();
        scene.addChild(MainMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },
});

FinalMenu.create = function () 
{
    var sg = new FinalMenu();
    if (sg && sg.init()) 
    {
        return sg;
    }
    return null;
};

FinalMenu.scene = function () 
{
    var scene = cc.Scene.create();
    var layer = FinalMenu.create();
    layer.setAnchorPoint(cc.PointZero());
    scene.addChild(layer);
    return scene;
};