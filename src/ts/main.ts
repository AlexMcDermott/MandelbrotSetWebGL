import * as twgl from 'twgl.js';

import { default as fragmentSource } from './shader/fragment';
import { default as vertexSource } from './shader/vertex';

const cnv = document.createElement('canvas');
const gl = cnv.getContext('webgl');
document.body.appendChild(cnv);

const programInfo = twgl.createProgramInfo(gl, [vertexSource, fragmentSource]);

const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(uniforms: object) {
  twgl.resizeCanvasToDisplaySize(cnv);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
}

interface Parameters {
  maxIterations: number;
  range: number;
  zoom: number;
  subSamples: number;
  resolution: number[];
  maxBounds: number[];
  minBounds: number[];
}

function calcParams(center: number[], zoom = 1): Parameters {
  const params = {
    maxIterations: 75,
    range: 4,
    zoom,
    subSamples: 10,
    resolution: [gl.canvas.width, gl.canvas.height],
    maxBounds: [0, 0],
    minBounds: [0, 0],
  };
  return updateBounds(center, params);
}

function updateBounds(center: number[], params: Parameters) {
  const rangeRadius = params.range / params.zoom / 2;
  const aspectRatio = params.resolution[1] / params.resolution[0];
  const maxR = center[0] + rangeRadius;
  const minR = center[0] - rangeRadius;
  const maxI = center[1] + rangeRadius * aspectRatio;
  const minI = center[1] - rangeRadius * aspectRatio;
  const maxBounds = [maxR, maxI];
  const minBounds = [minR, minI];
  params.maxBounds = maxBounds;
  params.minBounds = minBounds;
  return params;
}

function calcCenter(mouseX: number, mouseY: number, params: Parameters) {
  const range = params.range / params.zoom;
  const aspectRatio = params.resolution[1] / params.resolution[0];
  const rRange = range;
  const iRange = range * aspectRatio;
  const percentageR = (mouseX / params.resolution[0]) * rRange;
  const percentageI = (1 - mouseY / params.resolution[1]) * iRange;
  const centerR = percentageR + params.minBounds[0];
  const centerI = percentageI + params.minBounds[1];
  return [centerR, centerI];
}

function start() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
  params = calcParams([-0.5, 0]);
  render(params);
}

let params: Parameters;
start();

cnv.addEventListener('click', e => {
  const center = calcCenter(e.clientX, e.clientY, params);
  params = calcParams(center, params.zoom * 2);
  render(params);
});

window.addEventListener('resize', () => {
  start();
});
