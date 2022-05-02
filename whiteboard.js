var socket;
var stage;
var drawingCanvas,
	oldPt,
	oldMidPt,
	color = "#0000FF",
	stroke = 4;
var room;
const app = document.querySelector(".app");

$(function(){
	
	socket = io();

	app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        room = app.querySelector(".join-screen #destination").value;
        console.log(room)
        socket.emit('create', room);
    });

	app.querySelector(".wb #red").addEventListener("click",function(){
        color = "#FF0000"
    });
	app.querySelector(".wb #green").addEventListener("click",function(){
        color = "#00FF00"
    });
	app.querySelector(".wb #blue").addEventListener("click",function(){
        color = "#0000FF"
    });

	socket.on("drawDot", function(data){
		drawDot(data);
	});
	
	socket.on("drawLine",function(data){
		drawLine(data.mpx, data.mpy, data.opx, data.opy, data.ompx, data.ompy, data.color);
	});

	socket.on("clearDrawing", function(){
		clearDrawing();
	});
	
	stage = new createjs.Stage(document.getElementById("whiteboard"));
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = false;
	createjs.Touch.enable(stage);
	stage.autoClear = false;
	
	drawingCanvas = new createjs.Shape();
	stage.addChild(drawingCanvas);
	stage.addEventListener("stagemousedown", mouseDownHandler);
	stage.addEventListener("stagemouseup", mouseUpHandler);

	$("#clear_button").click(function(){
		clearDrawing();
		socket.emit("clearDrawing");
	});
});

function mouseDownHandler(e){
	oldPt = new createjs.Point(e.localX, e.localY);
	oldMidPt = oldPt;
	var midPt = new createjs.Point(oldPt.x + e.localX >> 1, oldPt.y + e.localY >> 1);
	
	drawDot(midPt);
	
	socket.emit("drawDot", midPt);
	
	stage.addEventListener("stagemousemove", mouseMoveHandler);
}

function mouseMoveHandler(e){
	var midPt = new createjs.Point(oldPt.x + e.localX >> 1, oldPt.y + e.localY >> 1);
	
	drawLine(midPt.x, midPt.y, oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y, color);
	
	socket.emit("drawLine", {mpx:midPt.x, mpy:midPt.y, opx:oldPt.x, opy:oldPt.y, ompx:oldMidPt.x, ompy:oldMidPt.y, color});
	
	oldPt.x = e.localX;
	oldPt.y = e.localY;
	
	oldMidPt.x = midPt.x;
	oldMidPt.y = midPt.y;
}

function mouseUpHandler(){
	stage.removeEventListener("stagemousemove", mouseMoveHandler);
}

function drawDot(mp){
	drawingCanvas.graphics.clear().beginFill(color).drawCircle(mp.x, mp.y, stroke >> 1).endFill();
	stage.update();
}

function drawLine(origX, origY, oldX, oldY, oldMidX, oldMidY, senderColor){
	drawingCanvas.graphics.clear().setStrokeStyle(stroke, "round", "round").beginStroke(senderColor).moveTo(origX, origY).curveTo(oldX, oldY, oldMidX, oldMidY).endStroke();
	stage.update();
}

function clearDrawing(){
	stage.clear();
}
