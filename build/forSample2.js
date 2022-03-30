let elementOfWave;
const theUrl = "http://www.w3.org/2000/svg";
let nC = 0;
let elementPool = new Array();
const limX = [140, 460];
const limY = [210, 650];
const ballR = 30;
let dateOld = new Date();

var getGetElementForWave = function(id){
    elementOfWave = document.getElementById(id);
}

var addWave = function(){
    let date = new Date();
    let theta = (date.getSeconds() + date.getMilliseconds()/1000) * 60 * Math.PI / 180;
    let s = 215 + Math.sin(theta)*5;
    let c = 215 + Math.cos(theta)*5;
    let dText = `M 140 210 Q 220 ${c}, 300 ${s} T 460 210`
    elementOfWave.setAttribute("d", dText);
    setTimeout(addWave, 100);
}

let addBallGrad = function(id, color){
    let stops = [
        {offset: "20%", stop_color: "white"},
        {offset: "100%", stop_color: color}
    ];
    addGradientRadialDynamic(id, "0.5", "0.5", "1", "0.5", "0.5", stops);
}

let addBallCore = function(elem, cx, cy, r, color){
    let c = document.createElementNS(theUrl, "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    
    let id = `cid_${nC++}`;
    c.setAttribute("id", id);

    elem.prepend(c);
    addBallGrad(id, color);

    let forPool = {
        element: c,
        ux: 0, uy: 0,
        ax: 0, ay: 0,
        cx: cx, cy: cy,
        rho: -20
    };
    elementPool.push(forPool);
}

var addBalls = function(idSvg){
    let svg = document.getElementById(idSvg);
    let stx1 = 180;
    let sty1 = 250;
    let colors = ["#fabea7", "#e1eec1", "#aeb5dc",
                    "#fcc9ac", "#c3dcbe", "#b7aed6",
                    "#ffe0b6", "#bad4d1", "#c5b2d6",
                    "#fffac2", "#b4c1d1", "#e5b7be"];
    let n = 0;
    for(let i=0; i<4; i++){
        addBallCore(svg, stx1 + i*70, sty1, ballR, colors[n++]);
    }
    for(let i=0; i<4; i++){
        addBallCore(svg, stx1 + 35 + i*70, sty1 + 120, ballR, colors[n++]);//35
    }
    for(let i=0; i<4; i++){
        addBallCore(svg, stx1 + i*70, sty1 + 240, ballR, colors[n++]);
    }
}

let isOverlaped = function(elemA, elemB){
    let dx = elemA.cx - elemB.cx;
    let dy = elemA.cy - elemB.cy;
    let dr = Math.sqrt(dx*dx + dy*dy);

    if(dr < 2*ballR){
        return true;
    }
    return false;
}

const R = 4*ballR*ballR;

let getDeltaT = function(elemA, elemB){
    let dx = elemA.cx - elemB.cx;
    let dy = elemA.cy - elemB.cy;
    let dux = elemA.ux - elemB.ux;
    let duy = elemA.uy - elemB.uy;

    let dx2 = dx * dx;
    let dy2 = dy * dy;

    let dxdy = dx * dux + dy * duy;
    let dux2duy2 = dux * dux + duy * duy;

    let dt = (dxdy + Math.sqrt(dxdy*dxdy - dux2duy2*(dx2 + dy2 - R)))/dux2duy2;
    if(isNaN(dt)){
        return 0;
    }else{
        return dt;
    }
}

let getTheta = function(elemA, elemB){
    let dx = elemB.cx - elemA.cx;
    let dy = elemB.cy - elemA.cy;
    return Math.atan2(dy, dx);
}

var addBallMove = function(){
    let date = new Date();
    const dt = (date.getSeconds() + date.getMilliseconds()/1000) - (dateOld.getSeconds() + dateOld.getMilliseconds()/1000);
    
    let stopflg = true;
    
    if(dt > 0.09){
        dateOld = date;

        let elementMatrix = [];

        for(let i=0; i<elementPool.length; i++){
            let duy = elementPool[i].rho * dt;
            
            elementPool[i].uy += duy;
            elementPool[i].cy += elementPool[i].uy * dt;

            elementPool[i].ux += elementPool[i].ax * dt;
            elementPool[i].cx += elementPool[i].ux * dt;

            elementPool[i].ax = 0;
            elementPool[i].ay = 0;

            let elemVector = [];
            elemVector.push(elementPool[i]);

            for(let j=i+1; j<elementPool.length; j++){
                if(i !== j){
                    if(isOverlaped(elementPool[i], elementPool[j])){
                        elemVector.push(elementPool[j]);
                    }
                }
            }

            elementMatrix.push(elemVector);

            if(elementPool[i].cy < limY[0] + ballR){
                elementPool[i].cy = limY[0] + ballR;
                if(elementPool[i].uy < 0){
                    elementPool[i].uy *= -0.1;
                }
            }else if(elementPool[i].cy > limY[1] - ballR){
                elementPool.cy = limY[1] - ballR;
                if(elementPool[i].uy > 0){
                    elementPool[i].uy *= -0.1;
                }
            }

            if(elementPool[i].cx < limX[0] + ballR){
                elementPool[i].cx = limX[0] + ballR;
                if(elementPool[i].ux < 0){
                    elementPool[i].ux *= -0.5;
                }
            }else if(elementPool[i].cx > limX[1] - ballR){
                elementPool[i].cx = limX[1] - ballR;
                if(elementPool[i].ux > 0){
                    elementPool[i].ux *= -0.5;
                }
            }
        }

        let targetVector = elementMatrix.filter(vec =>{
            return vec.length > 1;
        });

        if(targetVector.length > 0){
            targetVector.forEach(elems=>{
                for(let i=1; i<elems.length; i++){
                    let deltaT = getDeltaT(elems[0], elems[i]);
                    if(deltaT > dt*10){
                        deltaT = 0;
                    }

                    elems[i].cx -= deltaT * (elems[i].ux + elems[0].ux);
                    elems[i].cy -= deltaT * (elems[i].uy + elems[0].uy);

                    let theta = getTheta(elems[0], elems[i]);

                    if(elems[i].uy < 0){
                        elems[i].ay -= elems[i].rho * Math.cos(theta) * Math.sin(theta) + elems[i].uy*elems[i].uy/2;
                    }else{
                        elems[i].ay += elems[i].rho * Math.cos(theta) * Math.sin(theta) + elems[i].uy*elems[i].uy/2;
                    }

                    if(elems[0].cx < elems[i].cx){
                        elems[i].ax -= elems[i].rho * Math.cos(theta) * Math.cos(theta) + elems[i].ux*elems[i].ux;
                        elems[0].ax += elems[i].rho * Math.cos(theta) * Math.cos(theta) + elems[i].ux*elems[i].ux;
                    }else{
                        elems[i].ax += elems[i].rho * Math.cos(theta) * Math.cos(theta) + elems[i].ux*elems[i].ux;
                        elems[0].ax -= elems[i].rho * Math.cos(theta) * Math.cos(theta) + elems[i].ux*elems[i].ux;
                    }

                    elems[i].ux = 0;
                    elems[i].uy = 0;
                }
            });
        }
    }

    elementPool.forEach(elem=>{
        elem.element.setAttribute("cx", elem.cx);
        elem.element.setAttribute("cy", elem.cy);
    });

    console.log(elementPool[8]);
    
    if(stopflg){
        setTimeout(addBallMove, 100);
    }
    
}