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
                         .mousedown(onMounseDown)
                         .mouseout(onMouseUp);
    };
    function onMouseMove(e)
    {
        var canvasPoint = canvas2d.getCanvasPoint(e.pageX, e.pageY);
        showCoordinates(canvasPoint);
    }
    function showCoordinates(point)
    {
        $('#coords').text(point.x + ", " + point.y);
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
}

$(function() {
    window.CanvasPadApp = new CanvasPadApp();
    window.CanvasPadApp.start();
});