/**
 * GLOBAL Variable Setup
 */
var canvas = document.getElementById("canvasMain");
var canvasTimeMachine = document.getElementById("canvasTimeMachine");
var ctx = canvas.getContext("2d");
var ctxTimeMachine = canvasTimeMachine.getContext("2d");

var ticksPerSecond = 20;

var maxCanvasWidth = 1300;
var minCanvasWidth = 1000;


/**
 * Map Variables
 */
var time = 0
var secondsPerDay = 120;

var timeState = 0;
var timeStateDay = 0;
var timeStateNight = 1;

var maxTime = secondsPerDay*ticksPerSecond;

var sunX = 0;
var sunY = 0;
var moonX = 0;
var moonY = 0;

var isRaining = false;
var rainOpacity = 0;

//x, y, length, vX
var rainParticles = [];
var maxRain = 300;

var mapObjects = [];


/**
 * Initial Setup
 */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


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
    //Shadow Settings
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgb(0,0,0,0.3)';
    ctxTimeMachine.shadowBlur = 10;
    ctxTimeMachine.shadowColor = 'rgb(0,0,0,0.3)';
    
    //render sky
    ctx.fillStyle = 'hsl(210, 100%,' + Math.abs(maxTime/2 - time)/(maxTime/120) + '%)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctxTimeMachine.fillStyle = 'hsl(207, 90%,' + Math.abs(maxTime/2 - time)/(maxTime/120) + '%)';
    ctxTimeMachine.fillRect(0,0,canvas.width,canvas.height);

    //render Stars
    let starAlpha = (timeState == timeStateNight)? Math.abs(Math.abs(0.5 -time/maxTime)-0.25)*10 : 0;
    data.stars.forEach(function(star){
        ctx.beginPath();
        ctx.arc(canvas.width*star[0], canvas.height*star[1], star[2], 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(255,255,255," + starAlpha + ")";
        ctx.fill();
        ctxTimeMachine.beginPath();
        ctxTimeMachine.arc(canvas.width*star[0], canvas.height*star[1], star[2], 0, 2*Math.PI, false);
        ctxTimeMachine.fillStyle = "rgba(255,255,255," + starAlpha + ")";
        ctxTimeMachine.fill();
    });

    //Render Sun and moon
    ctx.beginPath();
    ctx.arc(sunX, sunY, 75, 0, 2*Math.PI, false);
    ctx.fillStyle = 'rgb(255, 235, 59)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX, moonY, 50, 0, 2*Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctxTimeMachine.beginPath();
    ctxTimeMachine.arc(sunX, sunY, 75, 0, 2*Math.PI, false);
    ctxTimeMachine.fillStyle = 'rgb(255, 235, 59)';
    ctxTimeMachine.fill();
    ctxTimeMachine.beginPath();
    ctxTimeMachine.arc(moonX, moonY, 50, 0, 2*Math.PI, false);
    ctxTimeMachine.fillStyle = 'white';
    ctxTimeMachine.fill();

    /*
    //Rain Clouds
    if(rainOpacity > 0){
        //ctx.shadowColor='hsl(233,46%,' + (51 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
        ctx.fillStyle='hsla(0,0%,' + (47 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%,' + rainOpacity*0.8 + ')';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    ctx.strokeStyle = 'rgba(174,194,224,0.8)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    rainParticles.forEach(function(rain){
        ctx.beginPath();
        ctx.moveTo(rain.x, rain.y);
        ctx.lineTo(rain.x+ rain.velX/2, rain.y+ rain.velY/2)
        //ctx.moveTo(rain.x + 400*Math.cos(rainParticles.indexOf(rain)), rain.y);
        //ctx.lineTo(rain.x + 400*Math.cos(rainParticles.indexOf(rain)) + rain.velX/2, rain.y+rain.velY/2);
        ctx.stroke();
    });
    */

    mapObjects.forEach(function(mo){
        mo.render();
    });

    buildings.forEach(function(b){
        b.render();
    });

    citizens.forEach(function(c){
        c.render();
    });


    prehistoricObjects.forEach(function(pO){
        pO.render();
    });

    //rendering ground
    ctx.fillStyle = 'hsl(122, 50%, ' + (32 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
    ctx.fillRect(0, canvas.height - canvas.height/4, canvas.width, canvas.height/2);
    ctxTimeMachine.fillStyle = 'hsl(122, 50%, ' + (32 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
    ctxTimeMachine.fillRect(0, canvas.height - canvas.height/4, canvas.width, canvas.height/2);


    windows.forEach(function(w){
        w.render();
    });
}

function tick(){
    time++;

    //Clock wrap handle
    if(time > maxTime){
        time = 0;
    }else if(time < 0){
        time = maxTime;
    }

    //Time state Handle
    if(time > maxTime/4 && time < maxTime*3/4){
        timeState = timeStateNight;
    }else{
        if(timeState == timeStateNight){
            if(Math.floor(Math.random()*2) == 0){
                //isRaining = true;
            }else{
                isRaining = false;
            }
        }
        timeState = timeStateDay;
    }

    //Canvas Size Adjust
    if(window.innerWidth < minCanvasWidth){
        canvas.width = minCanvasWidth;
    }else if(window.innerWidth > maxCanvasWidth){
        canvas.width = maxCanvasWidth;
    }else{
        canvas.width = window.innerWidth;
    }
    canvas.height = canvas.width * 3/5;

    canvasTimeMachine.width = canvas.width;
    canvasTimeMachine.height = canvas.height;

    sunX = (canvas.width/2) - canvas.height/1.5*Math.cos(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    sunY = (canvas.height - canvas.height/4) + canvas.height/1.5*Math.sin(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    moonX = (canvas.width/2) + canvas.height/1.5*Math.cos(time/(maxTime/(2*Math.PI)) - Math.PI/2);
    moonY = (canvas.height - canvas.height/4) - canvas.height/1.5*Math.sin(time/(maxTime/(2*Math.PI)) - Math.PI/2);

    /*//New Rain
    if(rainParticles.length < maxRain && isRaining){
        for(let i = 0 ; i < 5; i++){
            let newRain = {'x': Math.random()*canvas.width, 'y': 0, 'velY': (Math.random()*10 + 40), 'velX': (Math.random()*3 + 1)*(Math.random()*2 - 1)}
            rainParticles.push(newRain);
        }
    }

    //Handling Rain
    rainParticles.forEach(function(rain){
        if(rain.y > canvas.height*3/4){
            rainParticles.splice(rainParticles.indexOf(rain),1);
        }

        rain.y += rain.velY;
        rain.x += rain.velX;
    });



    if(isRaining && rainOpacity < 1){
        rainOpacity+=0.05;
    }
    else if(!isRaining && rainOpacity > 0)
        rainOpacity-=0.05;

    */


    mapObjects.forEach(function(mo){
        mo.tick();
    });

    buildings.forEach(function(b){
        b.tick();
    });

    citizens.forEach(function(c){
        c.tick();
    });

    prehistoricObjects.forEach(function(pO){
        pO.tick();
    });
    
    windows.forEach(function(w){
        w.tick();
    });


}

/**
 * 
 * 
 *  MOUNTAIN
 * 
 * 
 */

class Mountain{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render(){
        let mapX = this.x * canvas.width;
        let mapY = this.y * canvas.height;
        let angle = Math.atan(this.height/(this.width/2));
        let peakHeight = this.height/4;

        ctx.beginPath();
        ctx.fillStyle = 'hsl(0, 0%, ' + (40 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
        ctx.moveTo(mapX, mapY);
        ctx.lineTo(mapX + this.width/2, mapY - this.height);
        ctx.lineTo(mapX + this.width, mapY);
        ctx.fill();


        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.fillStyle = 'hsl(100, 0%, ' + (100 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
        ctx.moveTo(mapX + this.width/2 - (peakHeight)/Math.tan(angle), mapY - this.height + peakHeight);
        ctx.bezierCurveTo(mapX + this.width/2, mapY - this.height + peakHeight + 20, mapX + this.width/2, mapY - this.height + peakHeight - 20, mapX + this.width/2 + (peakHeight)/Math.tan(angle), mapY - this.height + peakHeight);
        ctx.lineTo(mapX + this.width/2, mapY - this.height);
        ctx.fill();
        

        ctx.shadowBlur = 10;

        //TIME MACHINE RENDER
        ctxTimeMachine.shadowBlur = 10;

        ctxTimeMachine.beginPath();
        ctxTimeMachine.fillStyle = 'hsl(0, 0%, ' + (40 + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
        ctxTimeMachine.moveTo(mapX, mapY);
        ctxTimeMachine.bezierCurveTo(mapX + this.width/6, mapY - this.height/2, mapX + this.width - this.width/6, mapY - this.height/2, mapX + this.width, mapY);
        //ctxTimeMachine.lineTo(mapX + this.width/2, mapY - this.height/2);
        //ctxTimeMachine.lineTo(mapX + this.width, mapY);
        ctxTimeMachine.fill();

        //t = o/a
    }

    tick(){

    }
}

/**
 * 
 *    BUILDING
 * 
 * 
 */

class Building{
    constructor(x, y, type, h, s, l){
        this.x = x;
        this.y = y;
        this.type = type;
        this.h = h;
        this.s = s;
        this.l = l;
    }

    render(){

        let mapX = this.x * canvas.width;
        let mapY = this.y * canvas.height;

        ctx.fillStyle = 'hsl(' + this.h + ',' + this.s +  '%,' + (this.l + 10*(Math.cos(time/(maxTime/(2*Math.PI))))) + '%)';
        if(this.type == 0){
            ctx.fillRect(mapX, mapY, 50, -50);
        }else if(this.type == 1){
            ctx.fillRect(mapX, mapY, 40, -40);
        }
    }

    tick(){

    }
}

/**
 * 
 *  CITIZEN
 * 
 * 
 */

class Citizen{
    constructor(building){
        this.building = building;

        this.x = building.x;
        this.y = building.y;
        this.width = 10;
        this.height = 20;

        this.wait = 0;

        this.target = {"x": building.x, "y": building.y};
    }

    render(){
        let mapX = this.x * canvas.width;
        let mapY = this.y * canvas.height;

        ctx.fillStyle = 'white';
        ctx.shadowBlur = 0;

        if(timeState != timeStateNight && !isRaining || (Math.abs(this.x - this.building.x) >= 0.001)){
            if(this.wait <= 0){
                ctx.save();
                ctx.translate(mapX + this.width/2, mapY + this.height/2);
                ctx.rotate(Math.cos((this.x - this.building.x)*150)/5);
                
                //ctx.fillRect(-this.width/2, -this.height/2, this.width, -this.height);

                ctx.beginPath();
                ctx.arc(0, -this.height*1.5 + this.height/5, this.height/5, 0, 2*Math.PI,false);//head
                ctx.arc(0, -this.height/1.25, this.width/2, 0, 2*Math.PI, false); //torso
                ctx.fill();
                ctx.fillRect(-this.width/2, -this.height/2, this.width, -this.height/3);
                ctx.restore();
            }else{
                //ctx.fillRect(mapX, mapY, this.width, -this.height);
                ctx.beginPath();
                ctx.arc(mapX + this.width/2, mapY - this.height+this.height/5, this.height/5, 0, 2*Math.PI,false); //head
                ctx.arc(mapX + this.width/2, mapY - this.height/4, this.width/2, 0, 2*Math.PI, false); //torso
                ctx.fill();
                ctx.fillRect(mapX, mapY, this.width, -this.height/4);
            }
        }

        ctx.shadowBlur = 12;

        //render target
        /*
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.arc(this.target.x*canvas.width, this.target.y*canvas.height - 5, 3, 0, 2*Math.PI, false);
        ctx.fill();
        */
    }

    tick(){
        if(timeState == timeStateDay && !isRaining){
            if(Math.abs(this.x - this.target.x) <= 0.005){
                this.wait = Math.floor(Math.random()*40 + 1);
                var newX = -0;
                do{
                    newX = this.x + Math.random()/4 * ((Math.floor(Math.random()*2 + 1) == 1)? 1:-1);
                    
                }while(newX < 0.0 || newX > 1.0);
                this.target.x = newX;
            }
            if(this.wait > 0)
                this.wait--;
            else
                this.x += (this.target.x - this.x)/Math.abs(this.target.x - this.x)*0.002;
        }else if(timeState == timeStateNight){
            if(Math.abs(this.x - this.building.x) >= 0.001){
                this.x += (this.building.x - this.x)/Math.abs(this.building.x - this.x)*0.002;
                this.target.x = this.building.x;
            }
        }
    }
}

class Dinosaur{
    constructor(x,y){
        this.x = x;
        this.y = y;

        this.width = 50;
        this.height = 100;

        this.world = "prehistoric";

        this.citizenTarget = null;
        this.target = {"x": 0.5, "y": 0.5};
    }

    render(){
        let mapX = this.x * canvas.width;
        let mapY = this.y * canvas.height;

        var ctx = (this.world == "prehistoric" ? ctxTimeMachine: ctx);

        ctx.fillStyle = 'red';
        ctx.shadowBlur = 0;

        if(this.wait <= 0){
            ctx.save();
            ctx.translate(mapX + this.width/2, mapY + this.height/2);
            ctx.rotate(Math.cos((this.x - this.target.x)*150)/5);
            
            
            ctx.fillRect(-this.width/2, -this.height/2, this.width, -this.height);
            ctx.restore();
        }else{
            //ctx.fillRect(mapX, mapY, this.width, -this.height);
            ctx.fillRect(mapX, mapY, this.width, -this.height);
        }

        ctx.shadowBlur = 10;
    }

    tick(){
        if(Math.abs(this.x - this.target.x) <= 0.005){
            if(this.world == "prehistoric"){
                this.wait = Math.floor(Math.random()*40 + 1);
                this._randomTarget();
                
            }else if(this.world == "present"){
                if(this.citizenTarget != null){
                    citizens.shift();
                    this.citizenTarget = null;
                }

                this.wait = Math.floor(Math.random()*40 + 1);
                if(citizens.length > 0){
                    this.citizenTarget = citizens[0];
                }else{
                    this._randomTarget();
                }
            }
        }

        if(this.citizenTarget!= null){
            this.target.x = this.citizenTarget.x;
            this.target.y = this.citizenTarget.y;
        }

        if(this.wait > 0)
            this.wait--;
        else
            this.x += (this.target.x - this.x)/Math.abs(this.target.x - this.x)*0.002;


    }

    _randomTarget(){
        var newX = -0;
        do{
            newX = this.x + Math.random()/4 * ((Math.floor(Math.random()*2 + 1) == 1)? 1:-1);
            
        }while(newX < 0.0 || newX > 1.0);
        this.target.x = newX;
    }
}

class Tree{
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        var imgName = "";
        switch(type){
            case 1:
                imgName = "tree2";
                break;
            case 2:
                imgName = "tree3";
                break;
            case 3:
                imgName = "tree4";
                break;
            default:
                imgName = "tree1"
                break;

        }

        this.image = document.getElementById(imgName);
        this.height = this.image.height;
    }

    render(){
            ctxTimeMachine.drawImage(this.image, this.x*canvasTimeMachine.width, this.y*canvasTimeMachine.height-this.height);
    }

    tick(){

    }
}


class WindowController{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.childWindow = null;
        windows.push(this);
        this.openWindow();
    }

    render(){
        
    }

    tick(){
        if(this.childWindow.innerWidth != this.width || this.childWindow != this.height){
            this.childWindow.resizeTo(this.width, this.height);
        }
    }

    openWindow(){
        this.childWindow = open("","Cloud","width=" + this.width + ",height=" + this.height + ",menubar=0,resizable=0,status=0,scrollbars=0,toolbar=no,titlebar=0", false);
        this.childWindow.onbeforeunload = function(){this.childWindow = null;}
    }
}

class TimeMachine extends WindowController{
    constructor(){
        super(150,150);
        this.childWindow.document.head.innerHTML += "<title>Time Machine</title>";
        this.childWindow.document.head.innerHTML += "<style>body{margin: 0;}</style>"
        this.childWindow.document.body.innerHTML += "<canvas id='timemachine' width='" + this.childWindow.innerWidth + "' height='" + this.childWindow.innerHeight + "'></canvas>";
        this.tmCanvas = this.childWindow.document.getElementById("timemachine");
        this.ctx = this.tmCanvas.getContext('2d');
        
    }

    render(){
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0,0,this.tmCanvas.width, this.tmCanvas.height);
        this.ctx.drawImage(canvasTimeMachine, this.childWindow.screenX + this.tmCanvas.offsetLeft - (window.screenX + canvas.offsetLeft), this.childWindow.screenY + this.tmCanvas.offsetTop + (this.childWindow.outerHeight - this.childWindow.innerHeight) - (window.screenY + canvas.offsetTop + (window.outerHeight - window.innerHeight)), this.childWindow.innerWidth, this.childWindow.innerHeight, 0, 0,  this.childWindow.innerWidth, this.childWindow.innerHeight);
    }

    tick(){
        super.tick();

        this.tmCanvas.width = this.childWindow.innerWidth;
        this.tmCanvas.height = this.childWindow.innerHeight;
        
    }
}


var data = {
    "stars":[
        [0.2,0.2,1],[0.15923076923076923, 0.23846153846153847, 1],[0.17615384615384616, 0.2858974358974359, 1],[0.2153846153846154, 0.25384615384615383, 1],[0.21307692307692308, 0.1358974358974359, 1],[0.24615384615384617, 0.08974358974358974, 1],[0.29307692307692307, 0.08974358974358974, 1],[0.39, 0.18461538461538463, 1],[0.4176923076923077, 0.24871794871794872, 1],[0.45384615384615384, 0.2012820512820513, 1],
        [0.4876923076923077, 0.25, 1],[0.52, 0.18974358974358974, 1],[0.28923076923076924, 0.36025641025641025, 1],[0.6292307692307693, 0.46153846153846156, 1],[0.6892307692307692, 0.12051282051282051, 1],[0.8192307692307692, 0.23076923076923078, 1],[0.61, 0.26666666666666666, 1],[0.4369230769230769, 0.4948717948717949, 1],[0.1076923076923077, 0.10384615384615385, 1],
        [0.04153846153846154, 0.49743589743589745, 1],[0.23076923076923078, 0.5076923076923077, 1],[0.7661538461538462, 0.3641025641025641, 1],[0.7446153846153846, 0.5576923076923077, 1],
        [0.9192307692307692, 0.4166666666666667, 1],[0.8638461538461538, 0.07948717948717948, 1],[0.5561538461538461, 0.5717948717948718, 1],[0.5715384615384616, 0.591025641025641, 1],[0.5884615384615385, 0.6064102564102564, 1],[0.6692307692307692, 0.5423076923076923, 1],[0.68, 0.47307692307692306, 1],[0.5130769230769231, 0.6038461538461538, 1],[0.5753846153846154, 0.6602564102564102, 1]
    ],
    "mountains":[
        [0.07,0.75,300,300], [0.2,0.75,200,200]
    ],
    "buildings":[
        [0.8,0.75,0, 0, 70, 40],[0.82, 0.75, 1, 240, 67, 58]
    ]
}
//


var citizens = [];
var buildings = [];
var windows = [];

var prehistoricObjects = [];

var timemachine = null;



window.onload = function(){
    var pTreeX = 0;
    while(pTreeX < 1){
        prehistoricObjects.push(new Tree(pTreeX , 0.75, Math.floor(Math.random()*4)));
        pTreeX += Math.random()*0.05;
    }
    
    data.mountains.forEach(function(m){
        mapObjects.push(new Mountain(m[0], m[1], m[2], m[3]));
    });
    
    data.buildings.forEach(function(b){
        let build = new Building(b[0], b[1], b[2], b[3], b[4], b[5]);
        buildings.push(build);
        citizens.push(new Citizen(build));
    });
       

    mapObjects.push(new Mountain(0.07, 0.75, 300, 300));
    mapObjects.push(new Mountain(0.2, 0.75, 200, 200));


    prehistoricObjects.push(new Dinosaur(0.5, 0.75));

    //timemachine = new TimeMachine();
}