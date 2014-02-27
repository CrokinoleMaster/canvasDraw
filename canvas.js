"use strict";

function CanvasPadApp(){
    var version = "v1.0",
        canvas2d = new Canvas2D($('#main>canvas')),
        toolbar = new Toolbar($('#toolbar')),
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
        toolbar.toolbarButtonClicked = toolbarButtonClicked;
        toolbar.menuItemClicked = menuItemClicked;
    };
    function showCoordinates(point)
    {
        $('#coords').text(Math.round(point.x) + ", " + Math.round(point.y));
    }
    //toolbar
    function toolbarButtonClicked(action)
    {
        switch (action)
        {
            case "clear":
                if (confirm('Clear the canvas?')){
                    actions = [];
                    redraw();
                }
                break;
            case "undo":
                actions.pop();
                redraw();
                break;
        }
    }
    function menuItemClicked(option, value)
    {
        canvas2d[option](value);
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
    context.lineWidth = 4;
    context.strokeStyle = "black";
    context.fillStyle = "black";
    context.globalAlpha = 1.0;
    context.lineJoin = "round";
    context.lineCap = "round";
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
    this.penWidth = function(newWidth)
    {
        if (arguments.length)
        {
            context.lineWidth = newWidth;
            return this;
        }
        return context.lineWidth
    };
    this.penColor = function(newColor)
    {
        if (arguments.length)
        {
            context.strokeStyle = newColor;
            context.fillStyle = newColor;
            return this;
        }
        return context.strokeStyle;
    };
    this.penOpacity = function(newOpacity)
    {
        if (arguments.length)
        {
            context.globalAlpha = newOpacity;
            return this;
        }
        return context.globalAlpha;
    };
}

$(function() {
    window.CanvasPadApp = new CanvasPadApp();
    window.CanvasPadApp.start();
});