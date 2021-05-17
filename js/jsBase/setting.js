function screenSizeCalculation() {
    //Game Scaling Variables: gameWidth, gameHeight, sizeFactor, pixelSize and prevPixelSize
    gameWidth = window.innerWidth;
    gameHeight = window.innerHeight;
    sizeFactor = 0;

    //No Aspect Ratio Setting (Default is 1:1 [Square])
    /*if(gameHeight < gameWidth) {
        sizeFactor = gameHeight;
        gameWidth = gameHeight;
    } else {
        sizeFactor = gameWidth;
        gameHeight = gameWidth;
    }*/
    sizeFactor = gameHeight < gameWidth ? gameHeight : gameWidth;

    //Game screen is divided into 500 arbitrary pixels by default
    pixelSize = sizeFactor / 500.0;

    //Setting the canvas size to the calculated game size
    canvas.width = gameWidth;
    canvas.height = gameHeight;
    canvas.style.position = "absolute";

    //canvasStartX and canvasStartY are used to correct touch/click inputs (see input.js for more details)
    canvasStartY = (window.innerHeight / 2) - (gameHeight / 2);
    canvas.style.top = canvasStartY.toString() + "px";
    canvasStartX = (window.innerWidth / 2) - (gameWidth / 2);
    canvas.style.left = canvasStartX.toString() + "px";
}

function init() {
    canvas = document.getElementById("gameCanvas");
    renderer = canvas.getContext("2d");
    platform = getPlatform();
    spritesRenderer = renderer;
    screenSizeCalculation();
    //prevPixelSize, prevGameWidth and prevGameHeight are used for resizing sizes (or positions) of dynamic game objects/sprites
    prevPixelSize = pixelSize;
    prevGameWidth = gameWidth;
    prevGameHeight = gameHeight;
    gameOptions = { SFXEnabled: true, BGMEnabled: true }
    
    uiInit();
    inputSetup();
}

function isMobile() {
    return gameHeight > gameWidth;
}
