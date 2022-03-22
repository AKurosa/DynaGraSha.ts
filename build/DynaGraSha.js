"use strict";
var addDropShadowDynamic = function (id, x, y, size, color) {
    let elemTemp = document.getElementById(id);
    if (elemTemp === null) {
        throw Error(`No element of id=${id}`);
    }
    let filterText = `drop-shadow(${x} ${y} ${size} ${color})`;
    elemTemp.style.filter = filterText;
};
