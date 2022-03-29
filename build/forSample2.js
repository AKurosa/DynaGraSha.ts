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

let reOverlaped = function(elemA, elemB){
    let dx = elemB.cx - elemA.cx;
    let dy = elemB.cy - elemA.cy;
    let dr = Math.sqrt(dx*dx + dy*dy);
    let rate = dr / (2*ballR);
    let drr = 2*ballR - dr;
    let dx2 = (1 - rate)*dx;
    let dy2 = (1 - rate)*dy;
    //let dy2 = drr;

    return [dx2, dy2];
}

var addBallMove = function(){
    let date = new Date();
    dt = (date.getSeconds() + date.getMilliseconds()/1000) - (dateOld.getSeconds() + dateOld.getMilliseconds()/1000);
    dateOld = date;

    for(let i=0; i<elementPool.length; i++){
        let duy = elementPool[i].rho * dt;
        
        elementPool[i].uy += duy;
        elementPool[i].cy += elementPool[i].uy*dt;

        for(let j=0; j<elementPool.length; j++){
            if(i !== j){
                if(isOverlaped(elementPool[i], elementPool[j])){
                    let deltaT = getDeltaT(elementPool[i], elementPool[j]);
                    elementPool[i].cx -= deltaT * elementPool[i].ux;
                    elementPool[i].cy -= deltaT * elementPool[i].uy;
                    elementPool[i].ux = 0;
                    elementPool[i].uy = 0;


                    elementPool[i].cx -= deltaT * elementPool[j].ux;
                    elementPool[i].cy -= deltaT * elementPool[j].uy;
                    elementPool[j].ux = 0;
                    elementPool[j].uy = 0;

                }
            }
        }
        
        if(elementPool[i].cy < limY[0] + ballR){
            elementPool[i].cy = limY[0] + ballR;
            elementPool[i].uy = 0;
        }

        if(elementPool[i].cx < limX[0] + ballR){
            elementPool[i].cx = limX[0] + ballR;
        }else if(elementPool[i].cx > limX[1] - ballR){
            elementPool[i].cx = limX[1] - ballR;
        }

        elementPool[i].element.setAttribute("cx", elementPool[i].cx);
        elementPool[i].element.setAttribute("cy", elementPool[i].cy);
    }

    setTimeout(addBallMove, 100);
}