var lastUpdate = Date.now;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  //Both maximum and minimum are inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDeltaTime() {
  var now = Date.now();
  var dt = now - lastUpdate;
  lastUpdate = now;

  return dt;
}

function compareFloat(a, b, error) {
  return (a >= b - error && a <= b + error);
}

function pushArr(sumArr, addArr) {
  for (let i = 0; i < addArr.length; i++)
    sumArr.push(addArr[i]);

  return sumArr;
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  negative() {
    return new Vector2(-this.x, -this.y);
  }

  isEqual(vec2) {
    return vec2.x == this.x && vec2.y == this.y;
  }

  add(vec2) {
    return new Vector2(this.x + vec2.x, this.y + vec2.y);
  }

  subtract(vec2) {
    return new Vector2(this.x - vec2.x, this.y - vec2.y);
  }

  multiply(vec2) {
    return new Vector2(this.x * vec2.x, this.y * vec2.y);
  }

  divide(vec2) {
    return new Vector2(this.x / vec2.x, this.y / vec2.y);
  }

  invert() {
    return new Vector2(this.x * -1, this.y * -1);
  }

  distance(vec2) {
    return Math.sqrt(Math.pow(vec2.x - this.x, 2) + Math.pow(vec2.y - this.y, 2));
  }

  distanceFloor(vec2) {
    return Math.floor(Math.sqrt(Math.pow(Math.floor(vec2.x) - Math.floor(this.x), 2) + Math.pow(Math.floor(vec2.y) - Math.floor(this.y), 2)));
  }

  angle(vec2) {
    return Math.atan2(this.y - vec2.y, this.x - vec2.x);
  }

  pointOnLine(vec2_a, vec2_b, error) {
    var distanceTest = compareFloat(vec2_a.distance(this) + this.distance(vec2_b), vec2_a.distance(vec2_b), error);

    if (compareFloat(vec2_a.x, this.x, error) && distanceTest) return compareFloat(vec2_b.x, this.x, error);
    if (compareFloat(vec2_a.y, this.y, error) && distanceTest) return compareFloat(vec2_b.y, this.y, error);

    return compareFloat((vec2_a.x - this.x) / (vec2_a.y - this.y), (this.x - vec2_b.x) / (this.y - vec2_b.y), error * 1000.0) && distanceTest;
  }
}

function isVec2InArr(array, vec2) {
  for (let i = 0; i < array.length; i++)
    if (array[i].isEqual(vec2)) return true;
  return false;
}

function isLineOnLine(
  x1, y1,
  x2, y2,
  x3, y3,
  x4, y4) {
  var denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

  if (denominator != 0.0) {
    var t = (((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4))) / denominator;
    if (t >= 0.0 && t <= 1.0) {
      var u = (((x1 - x2) * (y1 - y3)) - ((y1 - y2) * (x1 - x3))) / denominator;
      if (-u >= 0.0 && -u <= 1.0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  return false;
}

function vec2(x, y) {
  return new Vector2(x, y);
}

function toVec2(value) {
  return new Vector2(value, value);
}

function getDistBtwVec2(vec2_a, vec2_b) {
  var diffY = vec2_a.y - vec2_b.y;
  var diffX = vec2_a.x - vec2_b.x;
  return Math.sqrt((diffY * diffY) + (diffX * diffX));
}

function isPointOnLine(vec2_a, vec2_b, vec2_c, error) {
  var distanceTest = compareFloat(getDistBtwVec2(vec2_a, vec2_c) + getDistBtwVec2(vec2_c, vec2_b), getDistBtwVec2(vec2_a, vec2_b), error);

  if (compareFloat(vec2_a.x, vec2_c.x, error) && distanceTest) return compareFloat(vec2_b.x, vec2_c.x, error);
  if (compareFloat(vec2_a.y, vec2_c.y, error) && distanceTest) return compareFloat(vec2_b.y, vec2_c.y, error);

  return compareFloat((vec2_a.x - vec2_c.x) / (vec2_a.y - vec2_c.y), (vec2_c.x - vec2_b.x) / (vec2_c.y - vec2_b.y), error * 1000.0) && distanceTest;
}

function clamp(val, min, max) {
  if (val < min)
    return min;
  else if (val > max)
    return max;

  return val;
}

function degToRad(val) {
  return val * (Math.PI / 180.0);
}

function radToDeg(val) {
  return val * (180.0 / Math.PI);
}

function changeValueInSteps(valueToChange, targetValue, positiveAmount) {
  if (valueToChange < targetValue - positiveAmount) {
    valueToChange += positiveAmount;
  }
  else if (valueToChange < targetValue) {
    valueToChange = targetValue
  }

  else if (valueToChange > targetValue + positiveAmount) {
    valueToChange -= positiveAmount;
  }
  else if (valueToChange > targetValue) {
    valueToChange = targetValue
  }

  return valueToChange;
}

function lerp(val1, val2, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return (1 - amount) * val1 + amount * val2;
}

function lerpVec2(vec2_a, vec2_b, amount) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return new Vector2((1.0 - amount) * vec2_a.x + amount * vec2_b.x, (1.0 - amount) * vec2_a.y + amount * vec2_b.y);
}

function moveToVec2(vec2_a, vec2_b, amount) {
  var xMove = amount * Math.cos(vec2_b.angle(vec2_a));
  var yMove = amount * Math.sin(vec2_b.angle(vec2_a));
  return new Vector2(vec2_a.x + xMove, vec2_a.y + yMove);
}

function rotateAroundPoint(pointToRotate, fixedPoint, angle) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);

  pointToRotate.x -= fixedPoint.x;
  pointToRotate.y -= fixedPoint.y;

  var xnew = pointToRotate.x * c - pointToRotate.y * s;
  var ynew = pointToRotate.x * s + pointToRotate.y * c;

  pointToRotate.x = xnew + fixedPoint.x;
  pointToRotate.y = ynew + fixedPoint.y;
  return pointToRotate;
}

function drawRect(renderer, pos, size, doFill, color, roundedRadius) {
  doFill = typeof doFill == "undefined" ? false : doFill;

  if (typeof roundedRadius != "undefined" && roundedRadius > 0) {
    drawRoundedRect(renderer, roundedRadius, pos, size, doFill, color);
    return;
  }

  if (doFill) {
    renderer.fillStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.fillRect(pos.x, pos.y, size.x, size.y);
  }
  else {
    renderer.strokeStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.strokeRect(pos.x, pos.y, size.x, size.y);
  }
}

function drawRoundedRect(renderer, radius, pos, size, doFill, color) {
  doFill = typeof doFill == "undefined" ? false : doFill;

  if (size.x < radius) radius = size.x / 4;
  if (size.y < radius) radius = size.y / 4;
  if (size.x < radius) radius = size.x / 4;

  if (doFill) {
    renderer.fillStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.fillRect(pos.x + radius, pos.y, size.x - (radius * 2), size.y);
    renderer.fillRect(pos.x, pos.y + radius, size.x, size.y - (radius * 2));

    drawCircle(renderer, new Vector2(pos.x + radius + 1, pos.y + radius + 1), radius, true, color);
    drawCircle(renderer, new Vector2(pos.x + radius + 1, pos.y + size.y - radius - 1), radius, true, color);
    drawCircle(renderer, new Vector2(pos.x + size.x - radius - 1, pos.y + radius + 1), radius, true, color);
    drawCircle(renderer, new Vector2(pos.x + size.x - radius - 1, pos.y + size.y - radius - 1), radius, true, color);
  }
  else {
    renderer.strokeStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.strokeRect(pos.x + radius, pos.y, size.x - radius, size.y);
    renderer.strokeRect(pos.x, pos.y + radius, size.x, size.y - radius);

    drawCircle(renderer, new Vector2(pos.x + radius + 1, pos.y + radius + 1), radius, false, color, 1);
    drawCircle(renderer, new Vector2(pos.x + radius + 1, pos.y + size.y - radius - 1), radius, false, color, 1);
    drawCircle(renderer, new Vector2(pos.x + size.x - radius - 1, pos.y + radius + 1), radius, false, color, 1);
    drawCircle(renderer, new Vector2(pos.x + size.x - radius - 1, pos.y + size.y - radius - 1), radius, false, color, 1);
  }
}

function drawRectWithPoints(renderer, vec2_a, vec2_b, doFill, color) {
  doFill = typeof doFill == "undefined" ? false : doFill;

  var x, y, sizeX, sizeY;
  if (vec2_a.x <= vec2_b.x) {
    x = vec2_a.x;
    sizeX = vec2_b.x - vec2_a.x;
  }
  else {
    x = vec2_b.x;
    sizeX = vec2_a.x - vec2_b.x;
  }
  if (vec2_a.y <= vec2_b.y) {
    y = vec2_a.y;
    sizeY = vec2_b.y - vec2_a.y;
  }
  else {
    y = vec2_b.y;
    sizeY = vec2_a.y - vec2_b.y;
  }

  if (doFill) {
    renderer.fillStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.fillRect(x, y, sizeX, sizeY);
  }
  else {
    renderer.strokeStyle = typeof color == "undefined" ? "#000000" : color;
    renderer.strokeRect(x, y, sizeX, sizeY);
  }
}

function drawCircle(renderer, pos, radius, doFill, color, lineWidth) {
  doFill = typeof doFill == "undefined" ? false : doFill;

  renderer.beginPath();
  if (radius < 0) radius *= -1;
  renderer.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false);
  if (doFill) {
    renderer.fillStyle = color;
    renderer.fill();
  }
  renderer.lineWidth = typeof lineWidth == "undefined" ? 1 : lineWidth;
  renderer.strokeStyle = color;
  renderer.stroke();
}

function drawLine(renderer, vec2_a, vec2_b, color) {
  renderer.beginPath();
  renderer.moveTo(vec2_a.x, vec2_a.y);
  renderer.lineTo(vec2_b.x, vec2_b.y);
  renderer.strokeStyle = typeof color == "undefined" ? "#000000" : color;
  renderer.stroke();
}

function drawText(renderer, text, pos, color) {
  var lineHeight = renderer.measureText('M').width;
  renderer.fillStyle = typeof color == "undefined" ? "white" : color;
  if (typeof pos == "undefined") pos = new Vector2(0, lineHeight);
  renderer.fillText(text, pos.x, pos.y);
}

function rgb(r, g, b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

function rgba(r, g, b, a) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  return "#" + r + g + b + a;
}

const ANCHOR_TOPLEFT = 0;
const ANCHOR_TOPRIGHT = 1;
const ANCHOR_BOTTOMRIGHT = 2;
const ANCHOR_BOTTOMLEFT = 3;
const ANCHOR_CENTER = 4;

function positionToAnchor(pos, size, anchor) {
  anchor = typeof anchor == "undefined" ? ANCHOR_TOPLEFT : anchor;

  if (anchor == ANCHOR_TOPRIGHT) {
    pos.x = window.innerWidth - pos.x - size.x;
  }
  else if (anchor == ANCHOR_BOTTOMRIGHT) {
    pos.x = window.innerWidth - pos.x - size.x;
    pos.y = window.innerHeight - pos.y - size.y;
  }
  else if (anchor == ANCHOR_BOTTOMLEFT) {
    pos.y = window.innerHeight - pos.y - size.y;
  }
  else if (anchor == ANCHOR_CENTER) {
    pos.x = pos.x + (window.innerWidth / 2) - (size.x / 2);
    pos.y = pos.y + (window.innerHeight / 2) - (size.y / 2);
  }

  return pos;
}

function round(number, increment, offset) {
  return Math.ceil((number - offset) / increment) * increment + offset;
}

function clipRect(renderer, pos, size) {
  renderer.rect(pos.x, pos.y, size.x, size.y);
  renderer.clip();
}

const WINDOWS = 0;
const LINUX = 1;
const ANDROID = 2;
function getPlatform() {
  var p = -1;
  if (window.navigator.platform.toString().indexOf('Win') > -1) {
    p = WINDOWS;
  }
  else if (window.navigator.platform.toString().indexOf('Linux') > -1) {
    p = LINUX;
    if (window.navigator.platform.toString().indexOf('armv8') > -1) {
      p = ANDROID;
    }
  }
  return p;
}

function getPixelDataRGBA(imgData, index) {
  var i = index * 4, d = imgData.data;
  return [d[i], d[i + 1], d[i + 2], d[i + 3]];
}

function getPixelDataRGB(imgData, index) {
  var i = index * 4, d = imgData.data;
  return [d[i], d[i + 1], d[i + 2]];
}

function getPixelXY(imgData, x, y, w) {
  return getPixelDataRGB(imgData, (y * w) + x);
}

function enablePointerLock(e) {
  e.requestPointerLock = e.requestPointerLock || e.mozRequestPointerLock;
  e.requestPointerLock();
}

function disablePointerLock(e) {
  e.exitPointerLock = e.exitPointerLock || e.mozExitPointerLock;
  e.exitPointerLock();
}

var fullScreenActive = false;
function enableFullScreen(e) {
  if (!fullScreenActive) {
    try {
      if (e.requestFullscreen) {
        e.requestFullscreen();
        fullScreenActive = true;
      }
      else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
        fullScreenActive = true;
      }
      else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
        fullScreenActive = true;
      }
      else if (e.webkitRequestFullScreen) {
        e.webkitRequestFullScreen();
        fullScreenActive = true;
      }
    } catch (e) {
      console.log("browser refused fullscreen request. ignoring.")
    }
  }

}

function disableFullscreen(e) {
  if (e.exitFullscreen) {
    e.exitFullscreen();
    fullScreenActive = false;
  }
  else if (e.mozCancelFullScreen) {
    e.mozCancelFullScreen();
    fullScreenActive = false;
  }
  else if (e.webkitExitFullscreen) {
    e.webkitExitFullscreen();
    document.exitfullscreen();
    fullScreenActive = false;
  }
  else if (e.msExitFullscreen) {
    e.msExitFullscreen();
    fullScreenActive = false;
  }
}

// example:
// downloadString("a,b,c\n1,2,3", "text/plain", "myLevelData.txt")
function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });
  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
}

function saveFile(textToSave, fileNameToSaveAs) {
  var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
  var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  downloadLink.href = textToSaveAsURL;
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

function destroyClickedElement(e) {
  document.body.removeChild(e.target);
}

/*
function writeFile(file, str) {
  if (!file || !file.length || !str || !str.length) return;
  downloadString(str, "text/plain", file);
}
*/

function readFile(file) {
  var text = "";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", location.href.replace("index.html", "") + file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        text = rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return text;
}

//SHORT FUNCTIONS
//A = anchor, V = viewport
//anchors: CLOCKWISE numbers
//top left = 0, bottom left = 3, center = 4
function vec2AV(x, y, sz, anc) {
  return positionToAnchor(viewportToScreen(new Vector2(x, y)),
    sz, anc);
}
function vec2A(x, y, sz, anc) {
  return positionToAnchor(new Vector2(x, y),
    sz, anc);
}
function vec2V(x, y) {
  return viewportToScreen(new Vector2(x, y));
}

function displayMouseCoords(renderer, color) {
  drawText(renderer, touchPos[0].x.toString() + ", " + touchPos[0].y.toString(), vec2(10, 10), typeof color == "undefined" ? "white" : color);
}

function isPointInCircle(p, circleP, radius) {
  return (p.distance(circleP) < radius);
}

function isPointInRectangle(p, pos, size) {
  return p.x > pos.x && p.y > pos.y
    && p.x < pos.x + size.x && p.y < pos.y + size.y;
}
