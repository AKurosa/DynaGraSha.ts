let old_x, old_y;
let moveFlg = false;
let target;
let init_cx, init_cy;
let init_x, init_y;

let focus_x, focus_y;


var getFocus = function(id){
    let elem = document.getElementById(id);

    focus_x = Number(elem.getAttribute("cx"));
    focus_y = Number(elem.getAttribute("cy"));
}

var addShadow = function(element){
    let id = element.getAttribute("id");
    let tagName = element.tagName;
    let center_x, center_y;

    if(tagName == "circle"){
        center_x = Number(element.getAttribute("cx"));
        center_y = Number(element.getAttribute("cy"));
    }
    if(tagName == "rect"){
        center_x = Number(element.getAttribute("x")) + Number(element.getAttribute("width"))/2;
        center_y = Number(element.getAttribute("y")) + Number(element.getAttribute("height"))/2;
    }

    let dx = center_x - focus_x;
    let dy = center_y - focus_y;
    let r = Math.sqrt(dx*dx + dy*dy);

    addDropShadowDynamic(id, (dx/10) + "px", (dy/10) + "px", (r/50) + "px", "black");
}

var addGrad = function(element){
    let id = element.getAttribute("id");
    let tagName = element.tagName;
    let center_x, center_y;

    if(tagName == "circle"){
        center_x = Number(element.getAttribute("cx"));
        center_y = Number(element.getAttribute("cy"));
    }
    if(tagName == "rect"){
        center_x = Number(element.getAttribute("x")) + Number(element.getAttribute("width"))/2;
        center_y = Number(element.getAttribute("y")) + Number(element.getAttribute("height"))/2;
    }

    let dx = center_x - focus_x;
    let dy = center_y - focus_y;

    if(tagName == "circle"){
        let stops = [
            {offset: "0%", stop_color: "white"},
            {offset: "100%", stop_color: "black"}
        ];    
        addGradientRadialDynamic(id, 0.5 - dx/400, 0.5 - dy/400, "100%", 0.5 - dx/400, 0.5 - dy/400, stops);
    }
    if(tagName == "rect"){
        if(dx > 0 && dy > 0){
            let stops = [
                {offset: "0%", stop_color: "white"},
                {offset: "100%", stop_color: "black"}
            ];        
            addGradientLinearDynamic(id, 1.0 - dx/200, 1- dy/200, "100%", "100%", stops);
        }else if(dx < 0 && dy > 0){
            let stops = [
                {offset: "0%", stop_color: "black"},
                {offset: "100%", stop_color: "white"}
            ];        
            addGradientLinearDynamic(id, "0%", "100%", -dx/200, 1 - dy/200, stops); 
        }
        
    }
    
}

let eventMouseDown = function(event){
    event.preventDefault();
    moveFlg = true;

    target = event.target;
    old_x = event.x;
    old_y  = event.y;

    if(target.hasAttribute("cx")){
        init_cx = Number(target.getAttribute("cx"));
    }

    if(target.hasAttribute("cy")){
        init_cy = Number(target.getAttribute("cy"));
    }

    if(target.hasAttribute("x")){
        init_x = Number(target.getAttribute("x"));
    }

    if(target.hasAttribute("y")){
        init_y = Number(target.getAttribute("y"));
    }
}

let eventMouseMove = function(event){
    if(moveFlg){
        let dx = event.x - old_x;
        let dy = event.y - old_y;
    
        if(target.hasAttribute("cx")){
            target.setAttribute("cx", init_cx + dx);
        }
        if(target.hasAttribute("cy")){
            target.setAttribute("cy", init_cy + dy);
        }
        if(target.hasAttribute("x")){
            target.setAttribute("x", init_x + dx);
        }
        if(target.hasAttribute("y")){
            target.setAttribute("y", init_y + dy);
        }

        addShadow(event.target);
        addGrad(event.target);
    }
}

let eventMouseUp = function(event){
    moveFlg = false;
}
document.addEventListener("mouseup", eventMouseUp);

var addDragEvent = function(id){
    let elem = document.getElementById(id);
    elem.addEventListener("mousedown", eventMouseDown);
    elem.addEventListener("mousemove", eventMouseMove);
}