
function onResize(ev) {
    resizeGame();
}

function resizeVec2(v) {
    v.x /= prevGameWidth;
    v.y /= prevGameHeight;

    v.x *= gameWidth;
    v.y *= gameHeight;

    return v;
}

var touched = false;
var isTouchMoved = false;
var untouch = false;
var touchPos = [vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0)];
var relTouchPos = [vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0), vec2(0, 0)];
var wheelScroll = 0;
var lastMouseBtn = 0; //0 - left, 1 - middle, 2 - right

var keysDown = [];
var keysPressed = [];

var inputTimer = 0;
var inputDelay = 0; //200;

function isKeyPressed(key) {
    if (keysPressed.indexOf(key) != -1) return true;
    return false;
}
function removeKeyPressed(key) {
    for (let i = 0; i < keysPressed.length; i++) {
        if (keysPressed[i] == key) {
            keysPressed.splice(i, 1);
        }
    }
}

function isKey(key) {
    var i = keysDown.indexOf(key);
    if (i != -1) {
        keysDown.splice(i, 1);
        return true;
    }
    return false;
}

function isCtrlWithKey(key) {
    var ctrlI = keysDown.indexOf("Control");
    if(ctrlI != -1) {
        var i = keysDown.indexOf(key);
        if (i != -1) {
            keysDown.splice(i, 1);
            keysDown.splice(ctrlI > i ? --ctrlI : ctrlI, 1);
            return true;
        }
    }
    return false;
}

function isTouched() {
    if(touched) {
        touched = false;
        return true;
    }
    return false;
}

function onTouchStart(ev) {
    if (inputTimer <= 0 && untouch) {
        touched = true;
        inputTimer = inputDelay;
    }

    for (let i = 0; i < ev.touches.length; i++)
        touchPos[i] = vec2(ev.touches[i].clientX, ev.touches[i].clientY);

    audioPlayOnInput();
}

function onTouchMove(ev) {
    isTouchMoved = true;
    for (let i = 0; i < ev.touches.length; i++) {
        if (touchPos[i].x != 0.0 && touchPos[i].y != 0.0)
            relTouchPos[i] = (vec2(ev.touches[i].clientX, ev.touches[i].clientY).subtract(touchPos[i])).multiply(toVec2(2.4));
        touchPos[i] = vec2(ev.touches[i].clientX, ev.touches[i].clientY);
    }
    touched = false;
}

function onTouchEnd(ev) {
    //ev.preventDefault();
    for (let i = 0; i < 5; i++) {
        if (i >= ev.touches.length) {
            touchPos[i] = vec2(0, 0);
            relTouchPos[i] = vec2(0, 0);
        }
    }

    if (ev.touches.length <= 0) {
        touched = false;
        isTouchMoved = false;
        untouch = true;
    }

    userInteracted = true;
}

function onMouseDown(ev) {
    touchPos[0] = vec2(ev.clientX, ev.clientY);

    if (inputTimer <= 0) {
        touched = true;
        lastMouseBtn = ev.button;
        inputTimer = inputDelay;
    } else {
        touchPos[0] = vec2();
    }
}

function onMouseMove(ev) {
    isTouchMoved = true;

    if (isPointerLocked()) {
        var mvX = ev.movementX || ev.mozMovementX || 0;
        var mvY = ev.movementY || ev.mozMovementY || 0;
        relTouchPos[0] = relTouchPos[0].add(vec2(mvX, mvY));
    }
    else {
        relTouchPos[0] = vec2(ev.clientX, ev.clientY).subtract(touchPos[0]);
    }

    touchPos[0] = vec2(ev.clientX, ev.clientY);
}

function onMouseUp(ev) {
    touched = false;

    userInteracted = true;
}

function onRightClick(ev) {
    ev.preventDefault();
    isRightClick = true;
    return false;
}

function onMouseWheelScroll(ev) {
    wheelScroll = ev.deltaY;
}

function isPointerLocked() {
    return document.pointerLockElement === canvas || document.mozPointerLockElement === canvas;
}

function onKeyDown(ev) {
    if (keysDown.indexOf(ev.key) == -1)
        keysDown.push(ev.key);
    if(ev.ctrlKey) ev.preventDefault();
}

function onKeyPress(ev) {
    if (keysPressed.indexOf(ev.key) == -1)
        keysPressed.push(ev.key);
}

function onKeyUp(ev) {
    var i = keysDown.indexOf(ev.key);
    if (i != -1) keysDown.splice(i, 1);
}

function inputSetup() {
    window.addEventListener("resize", onResize);

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    if(!isMobile()) {
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        window.addEventListener("wheel", onMouseWheelScroll);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keypress", onKeyPress);
        window.addEventListener("keyup", onKeyUp);
    }

    window.addEventListener("contextmenu", onRightClick, false);
}

function getTouched(transform) { //or sprite
    if (touched) {
        for (let i = 0; i < 5; i++) {
            if (transform.position.x != 0 && transform.position.y != 0
                && touchPos[i].x - canvasStartX != 0 && touchPos[i].y - canvasStartY != 0) {
                var p = transform.relPointInside(touchPos[i].subtract(vec2(canvasStartX, canvasStartY)));
                if (p.x != -1 && p.y != -1) return i;
            }
        }
    }

    return -1;
}

function getHovered(transform) { //or sprite
    if (isTouchMoved && !touched) {
        for (let i = 0; i < 5; i++) {
            var p = transform.relPointInside(touchPos[i].subtract(vec2(canvasStartX, canvasStartY)));
            if (p.x != -1 && p.y != -1) return true;
        }
    }

    return false;
}

dragMoveObj = null;
dragMoveRelPos = vec2(-1, -1);
function dragMove(transform, lerpAmount = 1.0, limitPoint1, limitPoint2) {
    if (touched) {
        if (dragMoveObj == null) {
            var p = transform.relPointInside(touchPos[0].subtract(vec2(canvasStartX, canvasStartY)));
            if (p.x != -1 && p.y != -1) {
                dragMoveObj = transform;
                dragMoveRelPos = p.invert();
            }
        }
        else if (isTouchMoved) {
            if (dragMoveObj == transform) {
                transform.position = lerpVec2(transform.position, touchPos[0].add(dragMoveRelPos).subtract(vec2(canvasStartX, canvasStartY)), lerpAmount);
                if (!limitPoint1) return;
                if (transform.position.x < limitPoint1.x) transform.position.x = limitPoint1.x;
                else if (transform.position.x + transform.scale.x > limitPoint2.x) transform.position.x = limitPoint2.x - transform.scale.x;
                if (transform.position.y < limitPoint1.y) transform.position.y = limitPoint1.y;
                else if (transform.position.y + transform.scale.y > limitPoint2.y) transform.position.y = limitPoint2.y - transform.scale.y;
            }
        }
    }
    else {
        dragMoveObj = null;
        dragMoveRelPos = vec2(-1, -1);
    }
}