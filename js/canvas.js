;(function(win, doc){
	var Drawing = {
		init: function(id, obj){
			var canvas = doc.getElementById(id);
			var context = null;
			var mode = obj.mode || 'graffiti';
			var size = obj.size || 5;
			var color = obj.color || '#ffffff';
			var startEvt = 'touchstart';
			var moveEvt = 'touchmove';
			var endEvt = 'touchend';
			var pos = {
				left: canvas.offsetLeft,
				top: canvas.offsetTop
			};
			//事件处理类型
			if("ontouchstart" in window){
				startEvt = 'touchstart';
				moveEvt = 'touchmove';
				endEvt = 'touchend';
			}else{
				startEvt = 'mousedown';
				moveEvt = 'mousemove';
				endEvt = 'mouseup';
			}
			if(canvas){
				if((canvas.tagName).toLowerCase() != 'canvas'){
					console.error("dom 标签名必须是 canvas")
					return false;
				}else{
					context = canvas.getContext('2d');
				}
			}else{
				console.error("canvas Can't find")
				return false;
			}
			canvas.width = obj.width;
			canvas.height = obj.height;
			context.strokeStyle = color;
			context.lineWidth = size;
			var data = {
				posX:pos.left,	//canvas的偏移值
				posY:pos.top,	
				startX: 0,		//鼠标或者手指开始x方向的坐标值
				startY: 0,		//鼠标或者手指开始Y方向的坐标值
				endX: 0,		//鼠标或者手指结束x方向的坐标值
				endY: 0,		//鼠标或者手指结束Y方向的坐标值
				moveX: 0,
				moveY: 0,
				touchDown: false,	//是否按下flag
				touchID:-999,		//手指id标识
				ctx: context,		//canvas执行上下文
				mode: mode			//行为方式 graffiti: 涂鸦，fill: 填充
			}
			canvas.addEventListener(startEvt, function(event){
				if ( !data.touchDown ) {
					var t = event.touches ? event.touches[0] : event;
					var tx = t.pageX ;
					var ty = t.pageY;
					if(mode == 'fill'){
						context.strokeStyle = '#00f';
						context.lineWidth = 2;
					}
					data.touchDown = true;
					data.touchID = t.identifier;
					data.startX = tx;
					data.moveX = tx;
					data.startY = ty;
					data.moveY = ty;
					event.preventDefault();
				}
			}, false);
			
			canvas.addEventListener(moveEvt, function(){
				if ( data.touchDown ) {
					var ta = event.touches ? event.touches[0] : event;
					
					if ( ta.identifier == data.touchID ) {
						
						var tx = ta.pageX;
						var ty = ta.pageY;
						data.ctx.beginPath();
						if(mode == 'fill'){
							data.moveX = tx;
							data.moveY = ty;
							data.ctx.fillRect(data.startX,data.startY,tx - data.startX, ty - data.startY);
						}else{
							data.ctx.moveTo( data.startX, data.startY );
							data.moveX = tx;
							data.moveY = ty;
							data.ctx.lineTo( data.startX, data.startY );
							data.ctx.stroke();
						}
						event.preventDefault();
					}
				}
			}, false);
			canvas.addEventListener(endEvt, function(event){
				if ( data.touchDown ) {
					var ta = event.changedTouches ? event.changedTouches[0] : event;
					if ( ta.identifier == data.touchID ) {
						data.touchDown = false;
						data.ctx.closePath();
						event.preventDefault();
					}
				}
			}, false);
		},
		destroy: function(){
			
		}
	};
	win.drawing = Drawing;
})(window, document);