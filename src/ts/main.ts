import * as twgl from 'twgl.js';

import { default as fragmentSource } from './shader/fragment';
import { default as vertexSource } from './shader/vertex';

const cnv = document.createElement('canvas');
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
document.body.appendChild(cnv);
const gl = cnv.getContext('webgl');

const programInfo = twgl.createProgramInfo(gl, [vertexSource, fragmentSource]);

const arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render() {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const uniforms = {
    maxIterations: 75,
    range: 2.0,
    resolution: [gl.canvas.width, gl.canvas.height],
    subSamples: 10,
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);
}

render();