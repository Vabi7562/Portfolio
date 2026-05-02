import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const generateUUID = () => {
  const lut = Array(256).fill().map((_, i) => (i < 16 ? '0' : '') + i.toString(16));
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = Math.random() * 0xffffffff | 0;
  return (
    lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  );
};

const Starfield = ({
  starColor = 'rgba(255,255,255,1)',
  bgColor = 'rgba(0,0,0,1)',
  mouseAdjust = false,
  tiltAdjust = false,
  easing = 1,
  clickToWarp = false,
  hyperspace = false,
  warpFactor = 10,
  opacity = 0.1,
  speed = 1,
  quantity = 512,
}) => {
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    init: true, canvas: true, start: true, stop: false,
    destroy: false, reset: false, uid: generateUUID(), running: false,
  });
  const mouse  = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  const sd = useRef({
    w: 0, h: 0, ctx: null, cw: 0, ch: 0,
    x: 0, y: 0, z: 0,
    star: { colorRatio: 0, arr: [] },
    prevTime: 0,
  });

  // keep latest prop values accessible inside rAF without re-creating callbacks
  const propsRef = useRef({});
  propsRef.current = { starColor, bgColor, hyperspace, warpFactor, opacity, speed, quantity, easing };

  const ratio = quantity / 2;

  const measureViewport = () => {
    const el = canvasRef.current?.parentElement;
    if (el) {
      sd.current.w = el.clientWidth;
      sd.current.h = el.clientHeight;
      sd.current.x = Math.round(sd.current.w / 2);
      sd.current.y = Math.round(sd.current.h / 2);
      sd.current.z = (sd.current.w + sd.current.h) / 2;
      sd.current.star.colorRatio = 1 / sd.current.z;
      if (cursor.current.x === 0 || cursor.current.y === 0) cursor.current.x = sd.current.x;
      if (cursor.current.y === 0) cursor.current.y = sd.current.y;
      if (mouse.current.x === 0) mouse.current.x = cursor.current.x - sd.current.x;
      if (mouse.current.y === 0) mouse.current.y = cursor.current.y - sd.current.y;
    }
  };

  const setupCanvas = () => {
    measureViewport();
    const canvas = canvasRef.current;
    if (canvas) {
      sd.current.ctx = canvas.getContext('2d');
      canvas.width  = sd.current.w;
      canvas.height = sd.current.h;
    }
  };

  const bigBang = () => {
    if (sd.current.star.arr.length !== quantity) {
      sd.current.star.arr = new Array(quantity).fill().map(() => [
        Math.random() * sd.current.w * 2 - sd.current.x * 2,
        Math.random() * sd.current.h * 2 - sd.current.y * 2,
        Math.round(Math.random() * sd.current.z),
        0, 0, 0, 0, true,
      ]);
    }
  };

  const resize = () => {
    const oldStar = { ...sd.current.star };
    measureViewport();
    sd.current.cw = sd.current.ctx?.canvas.width;
    sd.current.ch = sd.current.ctx?.canvas.height;

    if (sd.current.cw !== sd.current.w || sd.current.ch !== sd.current.h) {
      const rw = sd.current.w / sd.current.cw;
      const rh = sd.current.h / sd.current.ch;
      sd.current.ctx.canvas.width  = sd.current.w;
      sd.current.ctx.canvas.height = sd.current.h;

      if (!sd.current.star.arr.length) {
        bigBang();
      } else {
        sd.current.star.arr = sd.current.star.arr.map((star, i) => {
          const s = [...star];
          s[0] = oldStar.arr[i][0] * rw;
          s[1] = oldStar.arr[i][1] * rh;
          s[3] = sd.current.x + (s[0] / s[2]) * ratio;
          s[4] = sd.current.y + (s[1] / s[2]) * ratio;
          return s;
        });
      }
    }
  };

  const update = () => {
    const { hyperspace: hs, warpFactor: wf, speed: sp, easing: ez } = propsRef.current;
    const compSpeed = hs ? sp * wf : sp;

    mouse.current.x = (cursor.current.x - sd.current.x) / ez;
    mouse.current.y = (cursor.current.y - sd.current.y) / ez;

    sd.current.star.arr = sd.current.star.arr.map(star => {
      const s = [...star];
      s[7] = true;
      s[5] = s[3]; s[6] = s[4];
      s[0] += mouse.current.x >> 4;

      if (s[0] > sd.current.x << 1)  { s[0] -= sd.current.w << 1; s[7] = false; }
      if (s[0] < -sd.current.x << 1) { s[0] += sd.current.w << 1; s[7] = false; }
      s[1] += mouse.current.y >> 4;
      if (s[1] > sd.current.y << 1)  { s[1] -= sd.current.h << 1; s[7] = false; }
      if (s[1] < -sd.current.y << 1) { s[1] += sd.current.h << 1; s[7] = false; }

      s[2] -= compSpeed;
      if (s[2] > sd.current.z) { s[2] -= sd.current.z; s[7] = false; }
      if (s[2] < 0)            { s[2] += sd.current.z; s[7] = false; }

      s[3] = sd.current.x + (s[0] / s[2]) * ratio;
      s[4] = sd.current.y + (s[1] / s[2]) * ratio;
      return s;
    });
  };

  const draw = () => {
    const { starColor: sc, bgColor: bg, hyperspace: hs, opacity: op } = propsRef.current;
    const ctx  = sd.current.ctx;
    const fill = hs ? `rgba(0,0,0,${op})` : bg;

    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, sd.current.w, sd.current.h);
    ctx.strokeStyle = sc;

    sd.current.star.arr.forEach(star => {
      if (star[5] > 0 && star[5] < sd.current.w &&
          star[6] > 0 && star[6] < sd.current.h && star[7]) {
        ctx.lineWidth = (1 - sd.current.star.colorRatio * star[2]) * 2;
        ctx.beginPath();
        ctx.moveTo(star[5], star[6]);
        ctx.lineTo(star[3], star[4]);
        ctx.stroke();
        ctx.closePath();
      }
    });
  };

  const animateLoop = () => {
    resize();
    update();
    draw();
    animationFrameRef.current = requestAnimationFrame(animateLoop);
  };

  const stopLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const init = () => {
    measureViewport();
    setupCanvas();
    bigBang();
    animateLoop();
    setState(prev => ({ ...prev, running: true }));
  };

  const mouseHandler = (e) => {
    const el = canvasRef.current?.parentElement;
    if (el) {
      cursor.current.x = e.pageX || e.clientX + el.scrollLeft - el.clientLeft;
      cursor.current.y = e.pageY || e.clientY + el.scrollTop  - el.clientTop;
    }
  };

  const tiltHandler = (e) => {
    if (e.beta !== null && e.gamma !== null) {
      cursor.current.x = (sd.current.w / 2) + (e.gamma * 5);
      cursor.current.y = (sd.current.h / 2) + (e.beta  * 5);
    }
  };

  useEffect(() => {
    const el = canvasRef.current?.parentElement;
    if (mouseAdjust) el?.addEventListener('mousemove', mouseHandler);
    if (tiltAdjust)  window.addEventListener('deviceorientation', tiltHandler);

    init();

    return () => {
      stopLoop();
      if (mouseAdjust) el?.removeEventListener('mousemove', mouseHandler);
      if (tiltAdjust)  window.removeEventListener('deviceorientation', tiltHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

Starfield.propTypes = {
  starColor:   PropTypes.string,
  bgColor:     PropTypes.string,
  mouseAdjust: PropTypes.bool,
  tiltAdjust:  PropTypes.bool,
  easing:      PropTypes.number,
  clickToWarp: PropTypes.bool,
  hyperspace:  PropTypes.bool,
  warpFactor:  PropTypes.number,
  opacity:     PropTypes.number,
  speed:       PropTypes.number,
  quantity:    PropTypes.number,
};

export { Starfield };
