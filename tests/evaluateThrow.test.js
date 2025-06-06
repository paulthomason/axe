const {JSDOM} = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync(__dirname + '/../index.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window) {
    // Disable animation frame to avoid infinite loops
    window.requestAnimationFrame = () => {};
    // Provide a minimal canvas context so onload does not fail
    window.HTMLCanvasElement.prototype.getContext = () => ({
      fillRect: () => {},
      clearRect: () => {},
      drawImage: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      rotate: () => {},
      fillText: () => {},
      strokeRect: () => {},
      rect: () => {},
      moveTo: () => {},
      lineTo: () => {},
      strokeStyle: '',
      fillStyle: '',
      lineWidth: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
    });
  }
});

const w = dom.window;
if (typeof w.onload === 'function') w.onload();

// Utility to reset variables for tests
function resetState() {
  if (typeof w.resetGame === 'function') {
    w.resetGame();
  }
  w.eval('score = 0');
  w.eval('sliderSpeedMultiplier = 1');
  w.eval('lastThrowMissed = false');
}

function runBullseyeTest() {
  resetState();
  w.eval('axeHitX = TARGET_X');
  w.eval('axeHitY = TARGET_Y');
  w.eval('axeAngle = 0');
  w.eval('axeTipOffsetX = 0');
  w.eval('axeTipOffsetY = 0');
  w.evaluateThrow();
  if (w.eval('resultPoints') !== 10) throw new Error('Expected 10 points for bullseye');
  if (w.eval('resultMsg') !== 'Bullseye!') throw new Error('Expected Bullseye message');
}

function runMissTest() {
  resetState();
  w.eval(`axeHitX = TARGET_X + TARGET_RADIUS_OUTERMOST + 5`);
  w.eval('axeHitY = TARGET_Y');
  w.eval('axeAngle = 0');
  w.eval('axeTipOffsetX = 0');
  w.eval('axeTipOffsetY = 0');
  w.evaluateThrow();
  if (w.eval('resultPoints') !== 0) throw new Error('Expected 0 points for miss');
  if (w.eval('resultMsg') !== 'Missed!') throw new Error('Expected Missed message');
}

function runMultiThrowGameOverTest() {
  resetState();
  const origRand = w.Math.random;
  w.Math.random = () => 1; // force misses
  w.eval('state = STATE_AIM_HORIZONTAL');
  w.performMultiThrow();
  w.update(1);
  w.Math.random = origRand;
  if (w.eval('state') !== w.eval('STATE_GAME_OVER')) throw new Error('Multi throw should end game when all miss');
  if (w.eval('score') !== 0) throw new Error('Score should remain 0 when all miss');
}

runBullseyeTest();
runMissTest();
runMultiThrowGameOverTest();
console.log('All tests passed');
