var PTM_RATIO = 32.0;
var kMoveLeft = 1;
var kMoveRight = 2;
var kStop = 0;


cc.Player = cc.Sprite.extend({
    _typeObject:0,
    velocity:cc.PointMake(0, 0),
    desiredPosition:cc.PointMake(0, 0),
    onGround:false,
    moveType:kStop,
    mightAsWellJump:false,
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
    },

    update:function (dt) {
        var jumpForce = cc.PointMake(0.0, 350.0);
        var jumpCutoff = 150.0;
    
        if (this.mightAsWellJump && this.onGround) {
            this.velocity = cc.pAdd(this.velocity, jumpForce);
            //[[SimpleAudioEngine sharedEngine] playEffect:@"jump.wav"];
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
        var maxMovement = cc.PointMake(120.0, 260.0);
        this.velocity = cc.pClamp(this.velocity, minMovement, maxMovement);
    
        this.velocity = cc.pAdd(this.velocity, gravityStep);
    
        var stepVelocity = cc.pMult(this.velocity, dt);
    
        this.desiredPosition = cc.pAdd(this.getPosition(), stepVelocity);
    },

    collisionBoundingBox:function () {
        var collisionBox = cc.rectInset(this.getBoundingBox(), 3, 0);
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
    },

    update:function (dt) {
        var jumpForce = cc.PointMake(0.0, 310.0);
        var jumpCutoff = 200.0;
    
        if (this.mightAsWellJump && this.onGround) {
            this.velocity = cc.pAdd(this.velocity, jumpForce);
            //[[SimpleAudioEngine sharedEngine] playEffect:@"jump.wav"];
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
        var collisionBox = cc.rectInset(this.getBoundingBox(), 3, 0);
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
    enemy:null,
    walls:null,
    walls2:null,
    hazards:null,
    gameOver:null,
    hideMode:true,
    back:null,
    elementsCount:0,
    hidedCount:0,

    ctor:function () {
        //cc.associateWithNative( this, cc.Layer );
    },
    
    init:function () 
    {
        var bRet = false;
        gameOver = false;
        hideMode = true;
        hidedCount = 0;

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

            this.player = cc.Player.createWithSpriteFrameName("char.png"); 
            //this.player.setAnchorPoint(cc.p(0.0, 0.0));
            this.player.setPosition(cc.PointMake(64 + 16, 96 + 16));
            this.map.addChild(this.player, 15);

            this.enemy = cc.Enemy.createWithSpriteFrameName("char.png");
            this.enemy.setPosition(cc.PointMake(500 + 16, 96 + 16));
            this.enemy.moveType = kMoveLeft;
            this.map.addChild(this.enemy, 15);

            this.walls = this.map.getLayer("walls");
            this.walls2 = this.map.getLayer("walls2");
            this.hazards = this.map.getLayer("hazards");
            elementsCount = this.walls2._children.length;

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
        }
        else if(e == cc.KEY.right) 
        {
            this.player.moveType = kMoveRight;
        }
        else if(e == cc.KEY.left) 
        {
            this.player.moveType = kMoveLeft;
        }
        else if(e == cc.KEY.space) 
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
        }
        else if(e == cc.KEY.left) 
        {
            this.player.moveType = kStop;
        }
        else if(e == cc.KEY.space) 
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
        this.enemy.update(dt);
        this.checkForWin();
        this.checkForAndResolveCollisions(this.player);
        this.checkForAndResolveCollisions(this.enemy);
        this.handleHazardCollisions(this.player);
        this.setViewpointCenter(this.player.getPosition());
    },

    tileCoordForPosition:function (position) {
        var x = Math.floor(position.x / this.map.getTileSize().width);
        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var y = Math.floor((levelHeightInPixels - position.y) / this.map.getTileSize().height);
        return cc.PointMake(x, y);
    },

    tileRectFromTileCoords:function (tileCoords) {
        var levelHeightInPixels = this.map.getMapSize().height * this.map.getTileSize().height;
        var origin = cc.PointMake(tileCoords.x * this.map.getTileSize().width, levelHeightInPixels - ((tileCoords.y + 1) * this.map.getTileSize().height));
        return cc.RectMake(origin.x, origin.y, this.map.getTileSize().width, this.map.getTileSize().height);
    },

    getSurroundingTilesAtPosition:function (p, layer) {

        var position = p.getPosition();
        var plPos = this.tileCoordForPosition(position); //1    
        var gids = []; //2
    
        for (var i = 0; i < 9; i++) { //3
            var c = i % 3;
            var r =  Math.floor(i / 3);
            var tilePos = cc.PointMake(plPos.x + (c - 1), plPos.y + (r - 1));
        
            if (tilePos.y >= (this.map.getMapSize().height)) {
                //fallen in a hole
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
                    } else if (tileIndx == 3) {
                        p.moveType = kMoveLeft;
                    } 
                }
            } else {
                // falling for enemyes
                p.mightAsWellJump = false;
                // chanse 1/3 for jump, left, or fall
                var chanse = cc.RANDOM_MINUS1_1();
                cc.log(chanse);
                if (p._typeObject == 2) {
                    // falling
                    if (chanse < -0.33) {
                        //nothing but the blues
                    } else if (chanse < 0.33) {
                        // jump
                        if (tileIndx == 7) {
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
        var tiles = this.getSurroundingTilesAtPosition(p, this.hazards);
        for (var i = 0; i < tiles.length; i++) {
            var dic = tiles[i];
            var tileRect = cc.RectMake(parseFloat(dic["x"]), parseFloat(dic["y"]), this.map.getTileSize().width, this.map.getTileSize().height);
            var pRect = p.collisionBoundingBox();
        
            if (parseInt(dic["gid"]) && cc.rectIntersectsRect(pRect, tileRect)) {
                this.gameOver(0);
            }
        }
    },

    gameOver:function (won) {
        gameOver = true;
        //this.restartGame();
    },

    checkForWin:function () {
        if(this.player.getPosition().x > 3130.0) {
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
        this.map.setPosition(viewPoint); 

        this.back.setPosition(cc.PointMake(viewPoint.x / 4.0, viewPoint.y));
    },

    hideColorForTile:function (position) {
        if(hideMode) {
            if(this.walls2.hideTileAt(position)) {
                ++hidedCount;
                this.back.setOpacity(255 * (1 - hidedCount / elementsCount));
            }
        }
        else {
            this.walls2.showTileAt(position);
        }
    },

    restartGame:function (pSender) 
    {
        var scene = cc.Scene.create();
        scene.addChild(GameField.create());
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
