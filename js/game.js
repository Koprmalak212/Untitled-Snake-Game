// ============================================================
// Step 2: snake model + steering (WASD and mouse)
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const SEGMENT_SPACING = 8;   // px between each body dot along the path
const SEGMENT_RADIUS = 7;    // px radius of each body dot
const TURN_RATE = Math.PI * 2.2; // max radians/sec the snake can turn

const snake = {
    x: 0,
    y: 0,
    angle: 0,
    speed: 180,          // px/sec
    length: 20,          // number of body segments
    path: [],            // history of {x, y} the head has passed through
};

function resetSnake() {
    snake.x = canvas.width / 2;
    snake.y = canvas.height / 2;
    snake.angle = 0;
    snake.path = [{ x: snake.x, y: snake.y }];
}
resetSnake();

const input = {
    mouse: { x: snake.x, y: snake.y, active: false },
    keys: { w: false, a: false, s: false, d: false },
};

canvas.addEventListener('mousemove', (e) => {
    input.mouse.x = e.clientX;
    input.mouse.y = e.clientY;
    input.mouse.active = true;
});

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in input.keys) {
        input.keys[key] = true;
        input.mouse.active = false; // WASD overrides mouse-follow once pressed
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in input.keys) input.keys[key] = false;
});

function getTargetAngle() {
    const { w, a, s, d } = input.keys;
    const dx = (d ? 1 : 0) - (a ? 1 : 0);
    const dy = (s ? 1 : 0) - (w ? 1 : 0);

    if (dx !== 0 || dy !== 0) {
        return Math.atan2(dy, dx);
    }
    if (input.mouse.active) {
        return Math.atan2(input.mouse.y - snake.y, input.mouse.x - snake.x);
    }
    return snake.angle; // no input: keep going straight
}

function turnToward(current, target, maxDelta) {
    let diff = target - current;
    // normalize to [-PI, PI] so it always turns the short way around
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (diff < -Math.PI) diff += Math.PI * 2;
    const clamped = Math.max(-maxDelta, Math.min(maxDelta, diff));
    return current + clamped;
}

function update(dt) {
    const targetAngle = getTargetAngle();
    snake.angle = turnToward(snake.angle, targetAngle, TURN_RATE * dt);

    snake.x += Math.cos(snake.angle) * snake.speed * dt;
    snake.y += Math.sin(snake.angle) * snake.speed * dt;

    snake.path.unshift({ x: snake.x, y: snake.y });

    const maxPathLength = snake.length * SEGMENT_SPACING + 50;
    if (snake.path.length > maxPathLength) {
        snake.path.length = maxPathLength;
    }
}

function getBodyPositions() {
    // Walks backward along the recorded path and drops a segment marker
    // every SEGMENT_SPACING px of travelled distance, so segments stay
    // evenly spaced regardless of how many path points a frame added.
    const positions = [];
    let distanceAccum = 0;
    let target = SEGMENT_SPACING;

    for (let i = 1; i < snake.path.length && positions.length < snake.length; i++) {
        const prev = snake.path[i - 1];
        const curr = snake.path[i];
        const segDist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

        while (distanceAccum + segDist >= target && positions.length < snake.length) {
            const t = segDist === 0 ? 0 : (target - distanceAccum) / segDist;
            positions.push({
                x: prev.x + (curr.x - prev.x) * t,
                y: prev.y + (curr.y - prev.y) * t,
            });
            target += SEGMENT_SPACING;
        }
        distanceAccum += segDist;
    }
    return positions;
}

function render() {
    ctx.fillStyle = '#09090f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    for (const seg of getBodyPositions()) {
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, SEGMENT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#f0f0f8';
    ctx.beginPath();
    ctx.arc(snake.x, snake.y, SEGMENT_RADIUS + 2, 0, Math.PI * 2);
    ctx.fill();
}

function loop(timestamp) {
    const dt = (timestamp - lastTime) / 1000; // seconds since last frame
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
