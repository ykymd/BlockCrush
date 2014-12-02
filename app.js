var rightkey = false;
var leftkey = false;

var HelloWorldLayer = cc.Layer.extend({
	ball:null,
	blocks:null,
	block:null,
	bar:null,
	size:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        
        this.scheduleUpdate();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        size = cc.winSize;
        
        this.ball = new cc.Sprite(res.ball_png);
        this.ball.attr({
        	x: size.width / 2,
        	y: size.height / 2,        	
        	speed: cc.p(4.0,4.0),
        	size: this.ball.getContentSize(),
        });
        this.addChild(this.ball);
        
        blocks = [];
        
        for (var i=0; i<5; i++){
        	var row = [];
        	for (var j=0; j<16; j++){
		        var block = new cc.Sprite(res.block_png);
		        block.attr({
		        	x: 20+j*(30+10),
		        	y: size.height - 20 - i*(10+10),
		        	size: block.getContentSize(),
		        })
		        this.addChild(block);
		        row.push(block)
        	}
        	
        	blocks.push(row);
        }
        
        this.bar = new cc.Sprite(res.block_png);
        this.bar.attr({
        	x: size.width / 2,
        	y: 50,
        	size: this.bar.getContentSize(),
        });
        this.addChild(this.bar);
        
        cc.eventManager.addListener(cc.EventListener.create({
        	event: cc.EventListener.KEYBOARD,
        	onKeyPressed: function(key) {
        		switch(key){
        		case 23:
        			//LEFT
        			leftkey = true;
        			break;
        		case 24:
        			//RIGHT
        			rightkey = true;
        			break;
        		}
        	},
        	onKeyReleased: function(key) {
        		switch(key){
        		case 23:
        			//LEFT
        			leftkey = false;
        			break;
        		case 24:
        			//RIGHT
        			rightkey = false;
        			break;
        		}
        	},
        }), this);
        
        return true;
    },

	update: function() {
		//毎フレーム実行
		
		// ボールの画面外判定
		this.ball.x += this.ball.speed.x;
		this.ball.y += this.ball.speed.y;
		
		if (this.ball.x+this.ball.size.width/2 > size.width) {
			this.ball.speed.x *= -1;
			this.ball.x = size.width-this.ball.size.width / 2;
		}
		
		if (this.ball.x-this.ball.size.width/2 < 0) {
			this.ball.speed.x *= -1;
			this.ball.x = this.ball.size.width / 2;
		}
		
		if (this.ball.y+this.ball.size.height/2 > size.height) {
			this.ball.speed.y *= -1;
			this.ball.y = size.height-this.ball.size.height / 2;
		}
		
		if (this.ball.y-this.ball.size.height/2 < 0) {
			this.ball.speed.y *= -1;
			this.ball.y = this.ball.size.height / 2;
		}
		
		// ボールとブロックの当たり判定
		var ballRect = this.ball.getBoundingBox();

		for (var i=0; i<5; i++){
			for (var j=0; j<16; j++){
				if (!blocks[i][j].visible) continue;
				
				var blockRect = blocks[i][j].getBoundingBox();

				if (ballRect.x < blockRect.x+blockRect.width &&
					blockRect.x < ballRect.x+ballRect.width &&
					ballRect.y < blockRect.y+blockRect.height &&
					blockRect.y < ballRect.y+ballRect.height){
					blocks[i][j].visible = false;
					
					var ballpos = cc.p(ballRect.x+ballRect.width/2,ballRect.y+ballRect.height/2);
					var blockpos = cc.p(blockRect.x+blockRect.width/2,blockRect.y+blockRect.height/2);
					
					if (ballpos.y > blockRect.y+blockRect.height ||
						ballpos.y < blockRect.y) {
						this.ball.speed.y *= -1;
					}
					
					if (ballpos.x > blockRect.x+blockRect.width ||
							ballpos.x < blockRect.x) {
						this.ball.speed.x *= -1;
					}
				}
			}
		}
		
		// キーボードの入力判定と動作
		if (rightkey)
			this.bar.x+=5;
		
		if (leftkey)
			this.bar.x-=5;
		
		if (this.bar.x+this.bar.size.width/2 > size.width)
			this.bar.x = size.width-this.bar.size.width / 2;

		if (this.bar.x-this.bar.size.width/2 < 0)
			this.bar.x = this.bar.size.width / 2;
		
		// バーとボールの当たり判定
		var barRect = this.bar.getBoundingBox();
		if (ballRect.x < barRect.x+barRect.width &&
				barRect.x < ballRect.x+ballRect.width &&
				ballRect.y < barRect.y+barRect.height &&
				barRect.y < ballRect.y+ballRect.height){
			var ballpos = cc.p(ballRect.x+ballRect.width/2,ballRect.y+ballRect.height/2);
			var blockpos = cc.p(barRect.x+barRect.width/2,barRect.y+barRect.height/2);

			if (ballpos.y > barRect.y+barRect.height ||
					ballpos.y < barRect.y) {
				this.ball.speed.y *= -1;
			}

			if (ballpos.x > barRect.x+barRect.width ||
					ballpos.x < barRect.x) {
				this.ball.speed.x *= -1;
			}
		}
	},
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});
