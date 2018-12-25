/**
 * Variable Setup
 */
var canvas = document.getElementById("canvasMain");
var ctx = canvas.getContext("2d");

var ticksPerSecond = 20;

/**
 * Map Variables
 */
var time = 0
var secondsPerDay = 120;

var maxTime = secondsPerDay*ticksPerSecond;


/**
 * Initial Setup
 */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Shadow Settings
ctx.shadowBlur = 10;
ctx.shadowColor = 'rgb(0,0,0,0.5)';

//var childWindow = open('','PopUp','width=200,height=200');
//childWindow.focus();
//console.log(childWindow);

/*
childWindow.onload = function(){
    childWindow.document.body.insertAdjacentHTML('afterbegin', "<div style='width:20px;height:20px;background-color:red;'></div>");
};

*/
//20 ticks per second
setInterval(function(){tick();render();}, 1000/ticksPerSecond);

/**
 *  Events
 */

document.addEventListener("wheel", function(e){   
    time += e.deltaY/5;
});



function render(){
    //render sky
    ctx.fillStyle = 'hsl(210, 100%,' + Math.abs(maxTime/2 - time)/(maxTime/120) + '%)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //render


    //Render Sun and moon
    ctx.beginPath();
    let sunX = (canvas.width/2) - 500*Math.cos(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    let sunY = (canvas.height - canvas.height/4) + 500*Math.sin(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    let moonX = (canvas.width/2) + 500*Math.cos(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    let moonY = (canvas.height - canvas.height/4) - 500*Math.sin(time/(maxTime/(2*Math.PI)) - Math.PI/2);

    ctx.arc(sunX, sunY, 75, 0, 2*Math.PI, false);
    ctx.fillStyle = 'rgb(255, 235, 59)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX, moonY, 50, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();


    ctx.fillStyle = 'hsl(122, 39%, ' + (32 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';

    ctx.fillRect(0, canvas.height - canvas.height/4, canvas.width, canvas.height/2);
}

function tick(){
    time++;

    if(time > maxTime){
        time = 0;
    }else if(time < 0){
        time = maxTime;
    }
}