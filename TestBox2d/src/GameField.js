var PTM_RATIO = 32.0;
var kMoveLeft = 1;
var kMoveRight = 2;
var kStop = 0;


cc.MySprite = cc.Sprite.extend({
    _typeObject:0,
    /**
     * Constructor
     */
    ctor:function () {
            this._super();
            this._typeObject = 1;
            this._stateObject = 1;
    },

    /**
     * HACK: optimization
     */
    SET_DIRTY_RECURSIVELY:function () {
        if (this._batchNode && !this._recursiveDirty) {
            this._recursiveDirty = true;
            //this.setDirty(true);
            this._dirty = true;
            if (this._hasChildren)
                this.setDirtyRecursively(true);
        }
    },

    /**
     * position setter (override cc.Node )
     * @param {cc.Point} pos
     * @override
     */
    setPosition:function (pos) {
        cc.Node.prototype.setPosition.call(this, pos);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * Rotation setter (override cc.Node )
     * @param {Number} rotation
     * @override
     */
    setRotation:function (rotation) {
        cc.Node.prototype.setRotation.call(this, rotation);
        this.SET_DIRTY_RECURSIVELY();
    },

        /**
     * <p>The scale factor of the node. 1.0 is the default scale factor. <br/>
     * It modifies the X and Y scale at the same time. (override cc.Node ) <p/>
     * @param {Number} scale
     * @override
     */
    setScale:function (scale, scaleY) {
        cc.Node.prototype.setScale.call(this, scale, scaleY);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * VertexZ setter (override cc.Node )
     * @param {Number} vertexZ
     * @override
     */
    setVertexZ:function (vertexZ) {
        cc.Node.prototype.setVertexZ.call(this, vertexZ);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * AnchorPoint setter  (override cc.Node )
     * @param {cc.Point} anchor
     * @override
     */
    setAnchorPoint:function (anchor) {
        cc.Node.prototype.setAnchorPoint.call(this, anchor);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * visible setter  (override cc.Node )
     * @param {Boolean} visible
     * @override
     */
    setVisible:function (visible) {
        cc.Node.prototype.setVisible.call(this, visible);
        this.SET_DIRTY_RECURSIVELY();
    },

    setFlipX:function (flipX) {
        cc.Sprite.prototype.setFlipX.call(this, flipX);
        this.SET_DIRTY_RECURSIVELY();
    }

});

/**
 * Creates a sprite with a sprite frame.
 * @param {cc.SpriteFrame|String} spriteFrame or spriteFrame name
 * @return {cc.Sprite}
 * @example
 * //get a sprite frame
 * var spriteFrame = cc.SpriteFrameCache.getInstance().spriteFrameByName("grossini_dance_01.png");
 *
 * //create a sprite with a sprite frame
 * var sprite = cc.Sprite.createWithSpriteFrameName(spriteFrame);
 *
 * //create a sprite with a sprite frame
 * var sprite = cc.Sprite.createWithSpriteFrameName('rossini_dance_01.png');
 */
cc.MySprite.createWithSpriteFrameName = function (spriteFrame) {
    if (typeof(spriteFrame) == 'string') {
        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrame);
        if (pFrame) {
            spriteFrame = pFrame;
        } else {
            cc.log("Invalid spriteFrameName: " + spriteFrame);
            return null;
        }
    }
    var sprite = new cc.MySprite();
    if (sprite && sprite.initWithSpriteFrame(spriteFrame)) {
        return sprite;
    }
    return null;
};


// 1111ßPlayer

cc.Player = cc.Sprite.extend({
    _typeObject:0,
    velocity:cc.PointMake(0, 0),
    desiredPosition:cc.PointMake(0, 0),
    onGround:false,
    moveType:kStop,
    mightAsWellJump:false,
    _isAnimationStarted:false,    
    _myAnimation:null,

    /**
     * Constructor
     */
    ctor:function () {
            this._super();
            this._typeObject = 1;
            this.velocity = cc.PointMake(0, 0);
            this.onGround = false;
            this.moveType = kStop;
            this.mightAsWellJump = false;
            this._isAnimationStarted = false;
            this._myAnimation = null;
},

    initPlayerAnimation:function (type) {
        var animFrames = [];
        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("hero_1.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("hero_2.png");

        animFrames.push(frame0);
        animFrames.push(frame1);
        // animate
        this._myAnimation = cc.Animation.create(animFrames, 0.2);
    },

    playPayerAnimation:function () {
        if(this._isAnimationStarted == false)
        {
            this._isAnimationStarted = true;
            var animate = cc.Animate.create(this._myAnimation);
            this.runAction(cc.RepeatForever.create(animate));
        }
    },

    stopPlayerAnimation:function () {
        if(this._isAnimationStarted == true)
        {
            this.stopAllActions();
            this._isAnimationStarted = false;
        }
    },

    update:function (dt) {
        var jumpForce = cc.PointMake(0.0, 310.0);
        var jumpCutoff = 250.0;
    
        if (this.mightAsWellJump && this.onGround) {
            this.velocity = cc.pAdd(this.velocity, jumpForce);
            cc.AudioEngine.getInstance().playEffect(s_jumpEffect);
        } 
        else if (!this.mightAsWellJump && this.velocity.y > jumpCutoff) {
            this.velocity = cc.PointMake(this.velocity.x, jumpCutoff);
        }
    
        var gravity = cc.PointMake(0.0, -450.0);
        var gravityStep = cc.pMult(gravity, dt);
        
        this.velocity = cc.PointMake(this.velocity.x * 0.90, this.velocity.y); //2
    
        if(this.moveType == kMoveRight) {
            var forwardMove = cc.PointMake(800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);
            this.setFlipX(false);
        }
        else if(this.moveType == kMoveLeft) {

            var forwardMove = cc.PointMake(-800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);
            this.setFlipX(true);
        }
    
        var minMovement = cc.PointMake(-120.0, -450.0);
        var maxMovement = cc.PointMake(120.0, 560.0);
        this.velocity = cc.pClamp(this.velocity, minMovement, maxMovement);
    
        this.velocity = cc.pAdd(this.velocity, gravityStep);
    
        var stepVelocity = cc.pMult(this.velocity, dt);
    
        this.desiredPosition = cc.pAdd(this.getPosition(), stepVelocity);
    },

    collisionBoundingBox:function () {
        var collisionBox = cc.rectInset(this.getBoundingBox(), 10, 4);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

    /**
     * HACK: optimization
     */
    SET_DIRTY_RECURSIVELY:function () {
        if (this._batchNode && !this._recursiveDirty) {
            this._recursiveDirty = true;
            //this.setDirty(true);
            this._dirty = true;
            if (this._hasChildren)
                this.setDirtyRecursively(true);
        }
    },

    /**
     * position setter (override cc.Node )
     * @param {cc.Point} pos
     * @override
     */
    setPosition:function (pos) {
        cc.Node.prototype.setPosition.call(this, pos);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * Rotation setter (override cc.Node )
     * @param {Number} rotation
     * @override
     */
    setRotation:function (rotation) {
        cc.Node.prototype.setRotation.call(this, rotation);
        this.SET_DIRTY_RECURSIVELY();
    },

        /**
     * <p>The scale factor of the node. 1.0 is the default scale factor. <br/>
     * It modifies the X and Y scale at the same time. (override cc.Node ) <p/>
     * @param {Number} scale
     * @override
     */
    setScale:function (scale, scaleY) {
        cc.Node.prototype.setScale.call(this, scale, scaleY);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * VertexZ setter (override cc.Node )
     * @param {Number} vertexZ
     * @override
     */
    setVertexZ:function (vertexZ) {
        cc.Node.prototype.setVertexZ.call(this, vertexZ);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * AnchorPoint setter  (override cc.Node )
     * @param {cc.Point} anchor
     * @override
     */
    setAnchorPoint:function (anchor) {
        cc.Node.prototype.setAnchorPoint.call(this, anchor);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * visible setter  (override cc.Node )
     * @param {Boolean} visible
     * @override
     */
    setVisible:function (visible) {
        cc.Node.prototype.setVisible.call(this, visible);
        this.SET_DIRTY_RECURSIVELY();
    },

    setFlipX:function (flipX) {
        cc.Sprite.prototype.setFlipX.call(this, flipX);
        this.SET_DIRTY_RECURSIVELY();
    }

});

/**
 * Creates a sprite with a sprite frame.
 * @param {cc.SpriteFrame|String} spriteFrame or spriteFrame name
 * @return {cc.Sprite}
 * @example
 * //get a sprite frame
 * var spriteFrame = cc.SpriteFrameCache.getInstance().spriteFrameByName("grossini_dance_01.png");
 *
 * //create a sprite with a sprite frame
 * var sprite = cc.Sprite.createWithSpriteFrameName(spriteFrame);
 *
 * //create a sprite with a sprite frame
 * var sprite = cc.Sprite.createWithSpriteFrameName('rossini_dance_01.png');
 */
cc.Player.createWithSpriteFrameName = function (spriteFrame) {
    if (typeof(spriteFrame) == 'string') {
        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrame);
        if (pFrame) {
            spriteFrame = pFrame;
        } else {
            cc.log("Invalid spriteFrameName: " + spriteFrame);
            return null;
        }
    }
    var sprite = new cc.Player();
    if (sprite && sprite.initWithSpriteFrame(spriteFrame)) {
        return sprite;
    }
    return null;
};

//////////////////////////////////////////////////////////////////////////////////

cc.Enemy = cc.Sprite.extend({
    _typeObject:0,
    velocity:cc.PointMake(0, 0),
    desiredPosition:cc.PointMake(0, 0),
    onGround:false,
    moveType:kStop,
    mightAsWellJump:false,
    _isAnimationStarted:false,    
    _myAnimation:null,
    /**
     * Constructor
     */
    ctor:function () {
            this._super();
            this._typeObject = 2;
            this.velocity = cc.PointMake(0, 0);
            this.onGround = false;
            this.moveType = kStop;
            this.mightAsWellJump = false;
            _isAnimationStarted = false;
            _myAnimation = null;

    },

    initEnemyAnimation:function (type) {
        var animFrames = [];
        // set frame
        var frame0 = cc.SpriteFrameCache.getInstance().getSpriteFrame("rabbit_1.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("rabbit_2.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("rabbit_3.png");
        var frame1 = cc.SpriteFrameCache.getInstance().getSpriteFrame("rabbit_4.png");

        animFrames.push(frame0);
        animFrames.push(frame1);
        // animate
        this._myAnimation = cc.Animation.create(animFrames, 0.2);
    },

    playEnemyAnimation:function () {
        if(this._isAnimationStarted == false)
        {
            this._isAnimationStarted = true;
            var animate = cc.Animate.create(this._myAnimation);
            this.runAction(cc.RepeatForever.create(animate));
        }
    },

    stopEnemyAnimation:function () {
        if(this._isAnimationStarted == true)
        {
            this.stopAllActions();
            this._isAnimationStarted = false;
        }
    },

    update:function (dt) {
        var jumpForce = cc.PointMake(0.0, 310.0);
        var jumpCutoff = 200.0;
    
        if (this.mightAsWellJump && this.onGround) {
            this.velocity = cc.pAdd(this.velocity, jumpForce);
        } 
        else if (!this.mightAsWellJump && this.velocity.y > jumpCutoff) {
            this.velocity = cc.PointMake(this.velocity.x, jumpCutoff);
        }
    
        var gravity = cc.PointMake(0.0, -450.0);
        var gravityStep = cc.pMult(gravity, dt);
        
        this.velocity = cc.PointMake(this.velocity.x * 0.90, this.velocity.y); //2
    
        if(this.moveType == kMoveRight) {
            var forwardMove = cc.PointMake(800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);

            // cc.log('бяка хуяка');
        }
        else if(this.moveType == kMoveLeft) {
            var forwardMove = cc.PointMake(-800.0, 0.0);
            var forwardStep = cc.pMult(forwardMove, dt);
            this.velocity = cc.pAdd(this.velocity, forwardStep);

            // this.setPosition(cc.p(this._position.x - 3, this._position.y));

            // cc.log('хуяка бяка');
        }
    
        var minMovement = cc.PointMake(-120.0, -450.0);
        var maxMovement = cc.PointMake(120.0, 250.0);
        this.velocity = cc.pClamp(this.velocity, minMovement, maxMovement);
    
        this.velocity = cc.pAdd(this.velocity, gravityStep);
    
        var stepVelocity = cc.pMult(this.velocity, dt);
    
        this.desiredPosition = cc.pAdd(this.getPosition(), stepVelocity);
    },

    collisionBoundingBox:function () {
        var collisionBox = cc.rectInset(this.getBoundingBox(), 3, 2);
        var diff = cc.pSub(this.desiredPosition, this.getPosition());
        var returnBoundingBox = cc.rectOffset(collisionBox, diff.x, diff.y);
        return returnBoundingBox;
    },

    /**
     * HACK: optimization
     */
    SET_DIRTY_RECURSIVELY:function () {
        if (this._batchNode && !this._recursiveDirty) {
            this._recursiveDirty = true;
            //this.setDirty(true);
            this._dirty = true;
            if (this._hasChildren)
                this.setDirtyRecursively(true);
        }
    },

    /**
     * position setter (override cc.Node )
     * @param {cc.Point} pos
     * @override
     */
    setPosition:function (pos) {
        cc.Node.prototype.setPosition.call(this, pos);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * Rotation setter (override cc.Node )
     * @param {Number} rotation
     * @override
     */
    setRotation:function (rotation) {
        cc.Node.prototype.setRotation.call(this, rotation);
        this.SET_DIRTY_RECURSIVELY();
    },

        /**
     * <p>The scale factor of the node. 1.0 is the default scale factor. <br/>
     * It modifies the X and Y scale at the same time. (override cc.Node ) <p/>
     * @param {Number} scale
     * @override
     */
    setScale:function (scale, scaleY) {
        cc.Node.prototype.setScale.call(this, scale, scaleY);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * VertexZ setter (override cc.Node )
     * @param {Number} vertexZ
     * @override
     */
    setVertexZ:function (vertexZ) {
        cc.Node.prototype.setVertexZ.call(this, vertexZ);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * AnchorPoint setter  (override cc.Node )
     * @param {cc.Point} anchor
     * @override
     */
    setAnchorPoint:function (anchor) {
        cc.Node.prototype.setAnchorPoint.call(this, anchor);
        this.SET_DIRTY_RECURSIVELY();
    },

    /**
     * visible setter  (override cc.Node )
     * @param {Boolean} visible
     * @override
     */
    setVisible:function (visible) {
        cc.Node.prototype.setVisible.call(this, visible);
        this.SET_DIRTY_RECURSIVELY();
    },

    setFlipX:function (flipX) {
        cc.Sprite.prototype.setFlipX.call(this, flipX);
        this.SET_DIRTY_RECURSIVELY();
    }

});

cc.Enemy.createWithSpriteFrameName = function (spriteFrame) {
    if (typeof(spriteFrame) == 'string') {
        var pFrame = cc.SpriteFrameCache.getInstance().getSpriteFrame(spriteFrame);
        if (pFrame) {
            spriteFrame = pFrame;
        } else {
            cc.log("Invalid spriteFrameName: " + spriteFrame);
            return null;
        }
    }
    var sprite = new cc.Enemy();
    if (sprite && sprite.initWithSpriteFrame(spriteFrame)) {
        return sprite;
    }
    return null;
};

///////////////////////////////////////////////////////////////////////////////////

var GameField = cc.Layer.extend(
{
    map:null,
    player:null,
    enemies:null,
    walls:null,
    walls2:null,
    hazards:null,
    gameOver:null,
    hideMode:true,
    back:null,
    elementsCount:0,
    hidedCount:0,
    listOfPictures:null,

    ctor:function () {
        //cc.associateWithNative( this, cc.Layer );
    },
    
    init:function () 
    {
        this.listOfPictures = [];
        var bRet = false;
        gameOver = false;
        hideMode = true;
        hidedCount = 0;
        this.enemies = [];

        if (this._super) 
        {
            var screenSize = cc.Director.getInstance().getWinSize();

            this.back = cc.Sprite.create(s_bg1);
            this.back.setAnchorPoint(cc.PointZero());
            this.back.setScaleX(1.5);
            this.back.setPosition(cc.PointZero());
            this.addChild(this.back, -10);

            // Load atlas with sprites
            cc.SpriteFrameCache.getInstance().addSpriteFrames(s_objects_plist, s_objects);

            this.map = cc.TMXTiledMap.create("TestBox2d/res/TileMaps/land1.tmx");
            this.addChild(this.map, 10, 123);

            this.map.setScale(1.0);
            this.map.setAnchorPoint(cc.p(0.0, 0.0));
            this.map.setPosition(cc.p(0, 0));

            this.player = cc.Player.createWithSpriteFrameName("hero_1.png"); 
            //this.player.setAnchorPoint(cc.p(0.0, 0.0));
            this.player.setPosition(cc.PointMake(100, 180));
            this.map.addChild(this.player, 15);
            this.player.initPlayerAnimation();

            var enemies_tmx = this.map.getObjectGroup("objects");
            var enemies_obj = enemies_tmx.getObjects();
            

            for (var i = 0; i < enemies_obj.length; ++i) {
                if (enemies_obj[i].id == 100) {
                    var enemy = cc.Enemy.createWithSpriteFrameName("rabbit_1.png");
                    enemy.setPosition(cc.PointMake(enemies_obj[i].x, enemies_obj[i].y));
                    enemy.moveType = kMoveRight;
                    enemy.initEnemyAnimation();
                    enemy.playEnemyAnimation();
                    this.map.addChild(enemy, 15);
                    cc.ArrayAppendObject(this.enemies, enemy);
                }
            }
            
            this.walls = this.map.getLayer("walls");
            this.walls2 = this.map.getLayer("walls2");
            this.hazards = this.map.getLayer("hazards");
            elementsCount = this.walls2._children.length;

            this.loadPictureObject();

            // accept touch now!
            this.setTouchEnabled(true);

            // schedule
            this.schedule(this.update);
            
            //accept keypad
            this.setKeyboardEnabled(true);

            bRet = true;

        }
        return bRet;
    },
    
    onEnter:function() {
        this._super();
    },

    onTouchesBegan:function (touches, event) 
    {
        var touch = touches[0];
        var location = touch.getLocation();
    },

    onTouchesMoved:function (touches, event) 
    {
    },

    onTouchesEnded:function () 
    {
    },

    onKeyDown:function (e) 
    {        
        if(e == cc.KEY.r)
        {
            this.restartGame();     
            //this.gameOver(1);
        }
        else if(e == cc.KEY.right) 
        {
            this.player.moveType = kMoveRight;
            this.player.playPayerAnimation();
        }
        else if(e == cc.KEY.left) 
        {
            this.player.moveType = kMoveLeft;
            this.player.playPayerAnimation();
        }
        else if(e == cc.KEY.space) 
        {
            this.player.mightAsWellJump = true;
        }
        else if(e == cc.KEY.up) 
        {
            this.player.mightAsWellJump = true;
        }
        else if(e == cc.KEY.shift) 
        {
            hideMode = false;
        }
    },
    
    onKeyUp:function (e) 
    {
        if(e == cc.KEY.right) 
        {
            this.player.moveType = kStop;
            this.player.stopPlayerAnimation();
        }
        else if(e == cc.KEY.left) 
        {
            this.player.moveType = kStop;
            this.player.stopPlayerAnimation();
        }
        else if(e == cc.KEY.space) 
        {
            this.player.mightAsWellJump = false;
        }
        else if(e == cc.KEY.up) 
        {
            this.player.mightAsWellJump = false;
        }
        else if(e == cc.KEY.shift) 
        {
            hideMode = true;
        }
    },

    draw:function() {
    },

    update:function (dt) {
        if (gameOver) {
            return;
        }
        this.player.update(dt);
        this.checkForWin();
        this.checkForAndResolveCollisions(this.player);
        this.handleHazardCollisions(this.player);
        this.setViewpointCenter(this.player.getPosition());

        for (var i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].update(dt);
            this.checkForAndResolveCollisions(this.enemies[i]);
        }

        this.checkPictureObjects();
    },

    tileCoordForPosition:function (position) {
        if (gameOver) {
            return;
        }
        
        var x = Math.floor(position.x / this.map.getTileSize().width);
        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var y = Math.floor((levelHeightInPixels - position.y) / this.map.getTileSize().height);
        return cc.PointMake(x, y);
    },

    tileRectFromTileCoords:function (tileCoords) {
        if (gameOver) {
            return;
        }

        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var origin = cc.PointMake(tileCoords.x * this.map.getTileSize().width, levelHeightInPixels - ((tileCoords.y + 1) * this.map.getTileSize().height));
        return cc.RectMake(origin.x, origin.y, this.map.getTileSize().width, this.map.getTileSize().height);
    },

    getSurroundingTilesAtPosition:function (p, layer) {
        if (gameOver) {
            return;
        }
        var position = p.getPosition();
        var plPos = this.tileCoordForPosition(position); //1    
        var gids = []; //2
    
        for (var i = 0; i < 9; i++) { //3
            var c = i % 3;
            var r =  Math.floor(i / 3);
            var tilePos = cc.PointMake(plPos.x + (c - 1), plPos.y + (r - 1));
        
            if (tilePos.y > (this.map.getMapSize().height)) {
                //fallen in a hole

                if (p._typeObject == 1) {
                    this.unschedule(this.update);
                }

                if (p._typeObject == 1) {
                    this.gameOver(0);
                    return null;    
                } else {
                    p.removeFromParentAndCleanup(false);
                }
            } 
        
            var tgid = layer.getTileGIDAt(tilePos); //4
        
            var tileRect = this.tileRectFromTileCoords(tilePos); //5
        
            var tileDict = {};
            tileDict["gid"] = tgid;
            tileDict["x"] = tileRect.origin.x;
            tileDict["y"] = tileRect.origin.y;
            tileDict["tilePos"] = tilePos;

            cc.ArrayAppendObject(gids, tileDict);
        }

        cc.ArrayRemoveObjectAtIndex(gids, 4);

        var obj1 = gids[0];        
        var obj2 = gids[1];        
        var obj3 = gids[2];        
        var obj4 = gids[3];        
        var obj5 = gids[4];        
        var obj6 = gids[5];        
        var obj7 = gids[6];        
        var obj8 = gids[7];        

        var gids2 = []; 
        cc.ArrayAppendObject(gids2, obj7);
        cc.ArrayAppendObject(gids2, obj2);
        cc.ArrayAppendObject(gids2, obj4);
        cc.ArrayAppendObject(gids2, obj5);
        cc.ArrayAppendObject(gids2, obj1);
        cc.ArrayAppendObject(gids2, obj3);
        cc.ArrayAppendObject(gids2, obj6);
        cc.ArrayAppendObject(gids2, obj8);

        return gids2;
    },

    checkForAndResolveCollisions:function (p) {

        if (gameOver) {
            return;
        }
        var tiles = this.getSurroundingTilesAtPosition(p, this.walls); //1
        p.onGround = false;

        for (var i = 0; i < tiles.length; i++) {
            var dic = tiles[i];
            var pRect = p.collisionBoundingBox(); //3
            var gid = parseInt(dic["gid"]); //4
      
            if (gid) {
                
                var tileRect = cc.RectMake(parseFloat(dic["x"]), parseFloat(dic["y"]), this.map.getTileSize().width, this.map.getTileSize().height); //5

                if (cc.rectIntersectsRect(pRect, tileRect)) {
                    var intersection = cc.rectIntersection(pRect, tileRect);
                    var tileIndx = cc.ArrayGetIndexOfObject(tiles, dic);

                    if (tileIndx == 0) {
                        //tile is directly below player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        p.onGround = true;
                        // this.hideColorForTile(dic["tilePos"]);
                    } 
                    else if (tileIndx == 1) {
                        //tile is directly above player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y - intersection.size.height);
                        p.velocity = cc.PointMake(p.velocity.x, 0.0);
                        // this.hideColorForTile(dic["tilePos"]);
                    } 
                    else if (tileIndx == 2) {
                        //tile is left of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x + intersection.size.width, p.desiredPosition.y);
                        // this.hideColorForTile(dic["tilePos"]);
                    } 
                    else if (tileIndx == 3) {
                        //tile is right of player
                        p.desiredPosition = cc.PointMake(p.desiredPosition.x - intersection.size.width, p.desiredPosition.y);
                        // this.hideColorForTile(dic["tilePos"]);
                    } 
                    else {
                        if (intersection.size.width > intersection.size.height) {
                            //tile is diagonal, but resolving collision vertially
                            p.velocity = cc.PointMake(p.velocity.x, 0.0);
                            var resolutionHeight;
                            if (tileIndx > 5) {
                                resolutionHeight = -intersection.size.height;
                                p.onGround = true;
                            } else {
                                resolutionHeight = intersection.size.height;
                            }                        
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x, p.desiredPosition.y + resolutionHeight );
                            // this.hideColorForTile(dic["tilePos"]);                        
                        } 
                        else {
                            var resolutionWidth;
                            if (tileIndx == 6 || tileIndx == 4) {
                                resolutionWidth = intersection.size.width;
                            } 
                            else {
                                resolutionWidth = -intersection.size.width;
                            }
                            p.desiredPosition = cc.PointMake(p.desiredPosition.x + resolutionWidth , p.desiredPosition.y);
                        }
                        // this.hideColorForTile(dic["tilePos"]);    
                    }
                    if (p._typeObject == 1) {
                        this.hideColorForTile(dic["tilePos"]);
                    }  
                }

                // enemy
                if (p._typeObject == 2) {
                    if (tileIndx == 2) {
                        p.moveType = kMoveRight;
                        p.setFlipX(true);
                    } else if (tileIndx == 3) {
                        p.moveType = kMoveLeft;
                        p.setFlipX(false);
                    } 
                }
            } else {
                // falling for enemyes
                p.mightAsWellJump = false;
                var chanse = cc.RANDOM_MINUS1_1();
                if (p._typeObject == 2) {
                    // falling
                    if (chanse < -0.33) {
                        //nothing but the blues
                    } else if (chanse < 0.33) {
                        // jump
                        if (tileIndx == 5) {
                            if (p.moveType == kMoveLeft) {
                                p.mightAsWellJump = true;
                            } else {
                                p.moveType = kMoveLeft;    
                            }
                        } else if (tileIndx == 6) {
                            if (p.moveType == kMoveRight) {
                                p.mightAsWellJump = true;
                            } else {
                                p.moveType = kMoveRight;    
                            }
                        }
                    } else {
                        // left
                        if (tileIndx == 7) {
                                p.moveType = kMoveRight;    
                        } else if (tileIndx == 6) {
                                p.moveType = kMoveLeft;    
                        }
                    }    
                }
            }  
        }
        p.setPosition(p.desiredPosition); //8
    },

    handleHazardCollisions:function (p) {
        if (gameOver) {
            return;
        }
        var tiles = this.getSurroundingTilesAtPosition(p, this.hazards);

        for (var i = 0; i < tiles.length; i++) {
            var dic = tiles[i];
            var tileRect = cc.RectMake(parseFloat(dic["x"]), parseFloat(dic["y"]), this.map.getTileSize().width, this.map.getTileSize().height);
            var pRect = p.collisionBoundingBox();
        
            if (parseInt(dic["gid"]) && cc.rectIntersectsRect(pRect, tileRect)) {
                this.unschedule(this.update);
                this.gameOver(0);
            }
        }
    },

    gameOver:function (won) {
        gameOver = true;
        if(won == 0) {
            var goback = cc.Sprite.create(s_backFailed);

            goback.setPosition(cc.PointMake(480, 320));
            this.addChild(goback, 100);

            var restartNormal = cc.Sprite.createWithSpriteFrameName("replay_s.png");
            var restartSelected = cc.Sprite.createWithSpriteFrameName("replay_s.png");
            var restartDisabled = null;
            var restartGame = cc.MenuItemSprite.create(restartNormal, restartSelected, restartDisabled, this.restartGame, this);

            var menu = cc.Menu.create(restartGame);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 102, 200);
            menu.setPosition(480, 150);
            cc.AudioEngine.getInstance().playEffect(s_deathEffect);
        }
        else {
     //        this.runAction(cc.Sequence.create(cc.DelayTime.create(1),
     //                        cc.Spawn.create(cc.MoveBy.create(2, cc.PointMake(-100, 100)),    
     //                                        cc.ScaleTo.create(2, 2), null), null));
            this.finishGame();

     //        this.player.runAction(cc.Sequence.create(cc.DelayTime.create(3),
     //                        cc.CallFunc.create(this, this.finishGame), null));
        }
    },

    checkForWin:function () {
        if (gameOver) {
            return;
        }
        if(this.player.getPosition().x > 3130.0) {
            this.unschedule(this.update);
            this.gameOver(1);
        }
    },

    setViewpointCenter:function (position) {
        if(gameOver) {
            return;
        }
        var winSize = cc.Director.getInstance().getWinSize();
    
        var x = Math.max(position.x, winSize.width / 2);
        var y = Math.max(position.y, winSize.height / 2);
        x = Math.min(x, (this.map.getMapSize().width * this.map.getTileSize().width) - winSize.width / 2);
        y = Math.min(y, (this.map.getMapSize().height * this.map.getTileSize().height) - winSize.height/2);
        var actualPosition = cc.PointMake(x, y);
    
        var centerOfView = cc.PointMake(winSize.width/2, winSize.height/2);
        var viewPoint = cc.pSub(centerOfView, actualPosition);

        if(viewPoint.x > 0) {
            viewPoint.x = 0;
        }
        if(viewPoint.y > 0) {
            viewPoint.y = 0;
        }        
        this.map.setPosition(viewPoint); 

        this.back.setPosition(cc.PointMake(viewPoint.x / 4.0, viewPoint.y));
    },

    hideColorForTile:function (position) {
        if(hideMode) {
            if(this.walls2.hideTileAt(position)) {
                ++hidedCount;
                var op = 255 * (1 - (hidedCount * 2.5) / elementsCount);
                if(hidedCount * 2.5 >= elementsCount) {
                    op = 0;
                }
                this.back.setOpacity(op);
            }
        }
        else {
            this.walls2.showTileAt(position);
        }
    },

    loadPictureObject:function () {
        var picture_objects = this.map.getObjectGroup("objects");
        var objects = picture_objects.getObjects();
        for(var i = 0; i < objects.length; ++i) {
            var object = objects[i];
            var pos = cc.PointMake(object.x, object.y);
            if(object.id == 1) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_1_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 1;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 2) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_2_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 2;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 3) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_3_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 3;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 4) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_4_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 4;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 5) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_5_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 5;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 6) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_6_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 6;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 7) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_7_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 7;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 8) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_8_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 8;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 9) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_9_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 9;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 10) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_10_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 10;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 11) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_11_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 11;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 12) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_12_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 12;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 13) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_13_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 13;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 14) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_14_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 14;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 15) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_15_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 15;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 16) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_16_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 16;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 17) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_17_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 17;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 18) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_18_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 18;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
            else if(object.id == 19) {
                var sprite = cc.MySprite.createWithSpriteFrameName("objects_19_c.png");
                sprite.setPosition(pos);
                sprite.setAnchorPoint(cc.PointMake(0.5, 0));
                this.map.addChild(sprite, 3);
                sprite._typeObject = 19;
                cc.ArrayAppendObject(this.listOfPictures, sprite);
            }
        }
    },

    checkPictureObjects:function () {
        for(var i = this.listOfPictures.length; i > 0; --i) {
            var sprite = this.listOfPictures[i - 1];

            if(cc.pDistance(this.player.getPosition(), sprite.getPosition()) < 70) {
                cc.ArrayRemoveObjectAtIndex(this.listOfPictures, i - 1);
                sprite.runAction(cc.FadeOut.create(1));

                if(sprite._typeObject == 1) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_1_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 2) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_2_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 3) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_3_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 4) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_4_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 5) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_5_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 6) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_6_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 7) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_7_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 8) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_8_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 9) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_9_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 10) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_10_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 11) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_11_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 12) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_12_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 13) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_13_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 14) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_14_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 15) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_15_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 16) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_16_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 17) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_17_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 18) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_18_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
                else if(sprite._typeObject == 19) {
                    var sprite2 = cc.MySprite.createWithSpriteFrameName("objects_19_d.png");
                    sprite2.setPosition(sprite.getPosition());
                    sprite2.setAnchorPoint(cc.PointMake(0.5, 0));
                    sprite2.setOpacity(0);
                    this.map.addChild(sprite2, 2);
                    sprite2.runAction(cc.FadeIn.create(1));
                }
            }
        }
    },

    restartGame:function (pSender) 
    {
        this.unschedule(this.update);
        var scene = cc.Scene.create();
        scene.addChild(GameField.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    finishGame:function (pSender) 
    {
        var scene = cc.Scene.create();
        scene.addChild(FinalMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

});

GameField.create = function () 
{
    var sg = new GameField();
    if (sg && sg.init()) 
    {
        return sg;
    }                             
    return null;
};

GameField.scene = function () 
{
    var scene = cc.Scene.create();
    var layer = GameField.create();
    layer.setAnchorPoint(cc.PointZero());
    scene.addChild(layer);
    return scene;
};
