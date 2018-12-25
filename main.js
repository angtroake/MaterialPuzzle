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



//ADD STARS
/*canvas.onclick = function(e){
    data.stars.push([e.offsetX/canvas.width, e.offsetY/canvas.height, 1]);
    console.log(data.stars);
}*/

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
    let starAlpha = (time > maxTime/4 && time < maxTime*3/4)? Math.abs(Math.abs(0.5 -time/maxTime)-0.25)*10 : 0;
    data.stars.forEach(function(star){
        ctx.beginPath();
        ctx.arc(canvas.width*star[0], canvas.height*star[1], star[2], 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(255,255,255," + starAlpha + ")";
        ctx.fill();
    });

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


    //rendering ground
    ctx.fillStyle = 'hsl(122, 39%, ' + (32 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';

    ctx.fillRect(0, canvas.height - canvas.height/4, canvas.width, canvas.height/2);
}

function tick(){
    time++;

    if(window.innerWidth < 1000){
        canvas.width = 1000;
    }else if(window.innerWidth > 1300){
        canvas.width = 1300;
    }else{
        canvas.width = window.innerWidth;
    }

    canvas.height = canvas.width * 3/5;

    /*if(window.innerHeight < 750){
        canvas.height = 750;
    }else if(window.innerHeight > 975){
        canvas.height = 975
    }else{
        canvas.height = window.innerHeight;
    }*/
   

    if(time > maxTime){
        time = 0;
    }else if(time < 0){
        time = maxTime;
    }
}


var data = {
    "stars":[
        [0.2,0.2,1],
        [0.15923076923076923, 0.23846153846153847, 1],[0.17615384615384616, 0.2858974358974359, 1],[0.2153846153846154, 0.25384615384615383, 1],[0.21307692307692308, 0.1358974358974359, 1],[0.24615384615384617, 0.08974358974358974, 1],[0.29307692307692307, 0.08974358974358974, 1],[0.39, 0.18461538461538463, 1],[0.4176923076923077, 0.24871794871794872, 1],[0.45384615384615384, 0.2012820512820513, 1],
        [0.4876923076923077, 0.25, 1],[0.52, 0.18974358974358974, 1],[0.28923076923076924, 0.36025641025641025, 1],[0.6292307692307693, 0.46153846153846156, 1],[0.6892307692307692, 0.12051282051282051, 1],[0.8192307692307692, 0.23076923076923078, 1],[0.61, 0.26666666666666666, 1],[0.4369230769230769, 0.4948717948717949, 1],[0.1076923076923077, 0.10384615384615385, 1],
        [0.04153846153846154, 0.49743589743589745, 1],[0.23076923076923078, 0.5076923076923077, 1],[0.7661538461538462, 0.3641025641025641, 1],[0.7446153846153846, 0.5576923076923077, 1],
        [0.9192307692307692, 0.4166666666666667, 1],[0.8638461538461538, 0.07948717948717948, 1],[0.5561538461538461, 0.5717948717948718, 1],[0.5715384615384616, 0.591025641025641, 1],[0.5884615384615385, 0.6064102564102564, 1],[0.6692307692307692, 0.5423076923076923, 1],[0.68, 0.47307692307692306, 1],[0.5130769230769231, 0.6038461538461538, 1],[0.5753846153846154, 0.6602564102564102, 1]
    ]
}