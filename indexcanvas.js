var botJSON = null;

$.getJSON("res/data/bots.json", function(file){
    botJSON = file;
});


console.log(botJSON);


var canvas = document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');


var rovImage = new Image();
rovImage.src = "res/flo1.png"

rovWidth = 400;
rovHeight = rovWidth * 0.685;
rovPosX = (innerWidth / 2) - (rovWidth / 2);
rovPosY = -rovHeight;
rovVelX = 0;
rovVelY = 0;
rovAccelerationY = 0.1;
rovFinalY = innerHeight-150;
const maxMovementSpeed = 3;
const movementAcceleration = 0.05;
const flyMax = 3;
botID = 0;


var currentKeys = [];
var validKeys = [119,97,115,100,102];
const KEY_W = 119;
const KEY_A = 97;
const KEY_S = 115;
const KEY_D = 100;
const KET_F = 102;


setInterval(function(){
    tick();
    render();
}, 10);



function render(){
    c.clearRect(0, 0, innerWidth, innerHeight);
    

    c.drawImage(rovImage, rovPosX, rovPosY, rovWidth, rovHeight);

    //Primary Tether
    c.beginPath();
    c.lineWidth = 8;
    c.strokeStyle = '#ffd800';
    c.moveTo(rovPosX + rovWidth/2, rovPosY + 15);
    c.bezierCurveTo(innerWidth/2 - 50, 2*rovPosY/3, innerWidth/2 + 50,rovPosY/3, innerWidth/2,-10);
    c.stroke();
    
    //Secondary Tether
    c.beginPath();
    c.lineWidth = 4;
    c.strokeStyle = '#000000';
    c.moveTo(rovPosX + rovWidth/2 + 5, rovPosY + 15);
    c.bezierCurveTo(innerWidth/2 - 50 + 5, 2*rovPosY/3, innerWidth/2 + 50 + 5,rovPosY/3 + 5, innerWidth/2 +5,-10);
    c.stroke();
}



var animationStep = 0;
var animationTick = 0;

const animationMax = 1000;

function tick(){
    if(animationStep == 0){
        if(rovPosY + rovHeight < rovFinalY/2){
            rovVelY += rovAccelerationY;
        }else{
            if(rovVelY <= 0){
                rovVelY = 0;
                animationStep = 2;
            }else{
                rovVelY -= rovAccelerationY;
            }
        }
    }else if(animationStep == 3){
        if(animationTick < animationMax){
            animationTick += 1;
        }else{
            animationTick = 0;
            animationStep = 1;
        }
    }else if(animationStep == 1){
        if(rovPosY + rovHeight < rovFinalY/2 && rovPosY + rovHeight < 0){
            if(rovPosY + rovHeight < 0){
                rovVelY = 0;
            }
            if(rovVelY >= 0){
                rovVelY = 0;
                switchBot();
                animationStep = 0;

            }else{
                rovVelY += rovAccelerationY;
            }
        }else{
            rovVelY -= rovAccelerationY;
        }
    }
    
    
    else if(animationStep == 2){
        if(currentKeys.includes(KEY_S)){
            if(rovVelY < maxMovementSpeed){
                rovVelY += movementAcceleration;
                
            }
        }else if(currentKeys.includes(KEY_W)){
            if(rovVelY > -maxMovementSpeed){
                rovVelY -= movementAcceleration;
                
            }
        }
        
        if(currentKeys.length <= 0){
            
            if(Math.abs(rovVelY) < 0.4){
                rovVelY = 0;
            }else if(rovVelY > 0){
                rovVelY -= movementAcceleration;
            }else{
                rovVelY += movementAcceleration;
            }
            
        }

        
    }

    if(currentKeys.includes(KEY_A)){
        if(rovVelX > -maxMovementSpeed){
            rovVelX -= movementAcceleration;
            
        }
    }else if(currentKeys.includes(KEY_D)){
        if(rovVelX < maxMovementSpeed){
            rovVelX += movementAcceleration;
            
        }
    }
    if(currentKeys.length <= 0){
        if(Math.abs(rovVelX) < 0.4){
            rovVelX = 0;
        }else if(rovVelX > 0){
            rovVelX -= movementAcceleration;
        }else{
            rovVelX += movementAcceleration;
        }
        
    }


    rovPosX += rovVelX;
    rovPosY += rovVelY;
}


function switchBot(){
    if(botID==0){
        botID = 1;
        rovImage.src = "res/vimmy1.png";
    }else{
        botID = 0;
        rovImage.src = "res/flo1.png";
    }
}



$(document).keypress(function(e){
    var key = e.which;
    $('#key' + key).toggleClass("on", true);
    //if(animationStep == 2){
        console.log(key);
        if(key == 102){
            animationStep = 1;
        }else if(!currentKeys.includes(key) && validKeys.includes(key)){
            currentKeys.push(key);
        }
    //}
});

$(document).keyup(function(e){
    var key = e.which + 32;
    $('#key' + key).toggleClass("on", false);
    if(currentKeys.includes(key) && validKeys.includes(key)){
        for(var i = currentKeys.length - 1; i >= 0; i--) {
            if(currentKeys[i] == key) {
               currentKeys.splice(i, 1);
            }
        }
    }
});



console.log(canvas);

