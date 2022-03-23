"use strict";
/**
 * Add dynamic shadow using filter:drop-shadow.
 *
 * @param  {string} id target ID
 * @param  {string} x shadow's offset x [px]
 * @param  {string} y shadow's offset y [px]
 * @param  {string} size shadow's size [px]
 * @param  {string} color shadow's color
 */
var addDropShadowDynamic = function (id, x, y, size, color) {
    let elemTemp = document.getElementById(id);
    if (elemTemp === null) {
        throw Error(`No element id=${id}`);
    }
    let filterText = `drop-shadow(${x} ${y} ${size} ${color})`;
    elemTemp.style.filter = filterText;
};
let globalGradRadCount = 0;
let globalGradLinCount = 0;
const theXmlns = "http://www.w3.org/2000/svg";
class VectorGradient {
    constructor() { }
    /**
     * Get element by id.
     * Throw error when there is no element.
     *
     * @param  {string} id id of element
     * @returns {HTMLElement} element
     * @throws {string} error
     */
    getElement(id) {
        let element = document.getElementById(id);
        if (element === null) {
            throw Error(`No element id=${id}`);
        }
        return element;
    }
    /**
     * Check stops contents.
     * Throw error when stops has incorrect contents.
     *
     * @param  {VectorStop[]} stops
     * @throws {string} error
     */
    checkVectorStops(stops) {
        stops.forEach(stop => {
            if (!("offset" in stop)) {
                throw Error("No offset param in input stops");
            }
            if (!("stop_color" in stop)) {
                throw Error("No stop_color param in input stops");
            }
        });
    }
    /**
     * Main function of add radial gradient.
     *
     * @param  {HTMLElement} elem target element.
     * @param  {string} cx x center of gradient.
     * @param  {string} cy y center of gradient.
     * @param  {string} r radial of gradient.
     * @param  {string} fx x center of light.
     * @param  {string} fy y center of light.
     * @param  {VectorStop[]} stops
     */
    addGradRadial(elem, cx, cy, r, fx, fy, stops) {
        let grad = document.createElementNS(theXmlns, "radialGradient");
        let fillID = `rGrad_${globalGradRadCount++}`;
        grad.setAttribute("id", fillID);
        grad.setAttribute("cx", cx);
        grad.setAttribute("cy", cy);
        grad.setAttribute("r", r);
        grad.setAttribute("fx", fx);
        grad.setAttribute("fy", fy);
        stops.forEach(s => {
            let stop = document.createElementNS(theXmlns, "stop");
            stop.setAttribute("offset", s.offset);
            stop.setAttribute("stop-color", s.stop_color);
            grad.appendChild(stop);
        });
        elem.setAttribute("fill", `url(#${fillID})`);
        elem.before(grad);
    }
    /**
     * Main function of linear gradient.
     *
     * @param  {HTMLElement} elem target element
     * @param  {string} x1 x start position of gradient.
     * @param  {string} y1 y start position of gradient.
     * @param  {string} x2 x end position of gradient.
     * @param  {string} y2 y end position of gradient.
     * @param  {VectorStop[]} stops
     */
    addGradLinear(elem, x1, y1, x2, y2, stops) {
        let grad = document.createElementNS(theXmlns, "linearGradient");
        let fillID = `lGrad_${globalGradLinCount++}`;
        grad.setAttribute("id", fillID);
        grad.setAttribute("x1", x1);
        grad.setAttribute("y1", y1);
        grad.setAttribute("x2", x2);
        grad.setAttribute("y2", y2);
        stops.forEach(s => {
            let stop = document.createElementNS(theXmlns, "stop");
            stop.setAttribute("offset", s.offset);
            stop.setAttribute("stop-color", s.stop_color);
            grad.appendChild(stop);
        });
        elem.setAttribute("fill", `url(#${fillID})`);
        elem.before(grad);
    }
}
/**
 * Add radial gradient.
 *
 * @param  {string} id Target id.
 * @param  {string} cx x center of gradient.
 * @param  {string} cy y center of gradient.
 * @param  {string} r radial of gradient.
 * @param  {string} fx x center of light.
 * @param  {string} fy y center of light.
 * @param  {VectorStop[]} stops
 */
var addGradientRadialDynamic = function (id, cx, cy, r, fx, fy, stops) {
    let vectorGradient = new VectorGradient();
    let elem = vectorGradient.getElement(id);
    vectorGradient.checkVectorStops(stops);
    vectorGradient.addGradRadial(elem, cx, cy, r, fx, fy, stops);
};
var addGradientLinearDynamic = function (id, x1, y1, x2, y2, stops) {
    let vectorGradient = new VectorGradient();
    let elem = vectorGradient.getElement(id);
    vectorGradient.checkVectorStops(stops);
    vectorGradient.addGradLinear(elem, x1, y1, x2, y2, stops);
};
