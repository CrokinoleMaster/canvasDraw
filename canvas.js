"use strict";

function CanvasPadApp(){
    var version = "v1.0",
        canvas2d = new Canvas2D($('#main>canvas')),
        drawing = false,
        points = [],
        actions = [];
    this.start = function()
    {
        $("#app>header").append(version);
        $('#main>canvas').mousemove(onMouseMove)
                         .mouseup(onMouseUp)
                         .mousedown(onMouseDown)
                         .mouseout(onMouseUp);
    };
    function showCoordinates(point)
    {
        $('#coords').text(point.x + ", " + point.y);
    }
    //mouse move
    function onMouseMove(e)
    {
        penMoved(e.pageX, e.pageY);
    }
    function penMoved(pageX, pageY)
    {
        var canvasPoint = canvas2d.getCanvasPoint(pageX, pageY);
        showCoordinates(canvasPoint);
        if (drawing)
        {
            points.push(canvasPoint);
            redraw();
        }
    }
    function redraw()
    {
        canvas2d.clear();
        for (var i in actions)
        {
            canvas2d.drawPoints(actions[i]);
        }
    }
    //mouse down
    function onMouseDown(e)
    {
        e.preventDefault();
        penDown(e.pageX, e.pageY);
    }
    function penDown(pageX, pageY)
    {
        drawing = true;
        points = [];
        points.push(canvas2d.getCanvasPoint(pageX, pageY));
        actions.push(points);
    }
    //mouse up
    function onMouseUp(e)
    {
        penUp();
    }
    function penUp()
    {
        drawing = false;
    }

}


function Canvas2D($canvas){
    var context = $canvas[0].getContext("2d"),
        width = $canvas[0].width,
        height = $canvas[0].height;
    var pageOffset = $canvas.offset();
    $(window).resize(function() {pageOffset = $canvas.offset(); });
    this.getCanvasPoint = function (pageX, pageY)
    {
        return {
            x: pageX - pageOffset.left,
            y: pageY - pageOffset.top
        }
    }
    this.clear = function()
    {
        context.clearRect(0, 0, width, height);
        return this;
    };
    this.drawPoints = function(points)
    {
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (var i =1; i< points.length; i++)
        {
            context.lineTo(points[i].x, points[i].y);
        }
        context.stroke();
        return this;
    };
}

$(function() {
    window.CanvasPadApp = new CanvasPadApp();
    window.CanvasPadApp.start();
});