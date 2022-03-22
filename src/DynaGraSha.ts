/**
 * Add dynamic shadow using filter:drop-shadow.
 * 
 * @param  {string} id target ID
 * @param  {string} x shadow's offset x [px]
 * @param  {string} y shadow's offset y [px]
 * @param  {string} size shadow's size [px]
 * @param  {string} color shadow's color
 */
var addDropShadowDynamic = function(id: string, x: string, y: string, size: string, color: string){
    let elemTemp = document.getElementById(id);
    if(elemTemp === null){
        throw Error(`No element of id=${id}`);
    }
    let filterText = `drop-shadow(${x} ${y} ${size} ${color})`;
    (elemTemp as HTMLElement).style.filter = filterText;
}