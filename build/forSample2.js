let elementOfWave;
const theUrl = "http://www.w3.org/2000/svg";
let nC = 0;

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
        addBallCore(svg, stx1 + i*70, sty1, 30, colors[n++]);
    }
    for(let i=0; i<4; i++){
        addBallCore(svg, stx1 + 35 + i*70, sty1 + 60, 30, colors[n++]);
    }
    for(let i=0; i<4; i++){
        addBallCore(svg, stx1 + i*70, sty1 + 120, 30, colors[n++]);
    }
    
}