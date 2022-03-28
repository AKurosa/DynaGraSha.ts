let elementOfWave;

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