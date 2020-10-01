const GAMEPLAY = 1;
var gameplay = [];

function ballReset()
{
    ballPosition = vec2(gameWidth/2, gameHeight/2);
    ballRadius = 4 * pixelSize;
    ballSpeed = 4 * pixelSize;
    ballAngle = degToRad(225.0);
}

function gameplayReset()
{
    playerScore.text = enemyScore.text = "0";

    playerPaddle = new Sprite(tr(vec2(60*pixelSize, gameHeight/2)), new ImageObject("images/paddle1.png"));
    enemyPaddle = new Sprite(tr(vec2(gameWidth - (60*pixelSize), gameHeight/2)), new ImageObject("images/paddle2.png"));
    enemyPaddleSpeed = 0.15 * pixelSize;

    ballReset();
}

function gameplaySetup()
{
    var fontSize = 28 * pixelSize;

    playerScore = new Label(tr(vec2((gameWidth/4) - (25*pixelSize), 40*pixelSize), vec2(50*pixelSize, 50*pixelSize)), "0",
        fontSize.toString() + "px " + uiContext.fontFamily, "lightblue");
    gameplay.push(playerScore);
    enemyScore = new Label(tr(vec2((gameWidth - (gameWidth/4)) - (25*pixelSize), 40*pixelSize), vec2(50*pixelSize, 50*pixelSize)), "0",
        fontSize.toString() + "px " + uiContext.fontFamily, "lightblue");
    gameplay.push(enemyScore);
    gameplayToStartButton = new TextButton(tr(vec2(gameWidth-(80*pixelSize), gameHeight - (40*pixelSize)), vec2(80*pixelSize, 40*pixelSize)),
        new Label(tr(), "BACK", (fontSize/2).toString() + "px " + uiContext.fontFamily, "lightblue"),
        new Button(tr(), "#000066CC", "#FFFFFFFF", "#002299FF"));
    gameplay.push(gameplayToStartButton);

    gameplayReset();
}


function gameplayResize()
{
    var fontSize = 28 * pixelSize;

    playerScore.font = enemyScore.font = fontSize.toString() + "px " + uiContext.fontFamily;
    gameplayToStartButton.label.font = (fontSize/2).toString() + "px " + uiContext.fontFamily;

    playerScore.transform.position = vec2((gameWidth/4) - (25*pixelSize), 40*pixelSize);
    enemyScore.transform.position = vec2((gameWidth - (gameWidth/4)) - (25*pixelSize), 40*pixelSize);

    playerScore.transform.scale = enemyScore.transform.scale = vec2(50*pixelSize, 50*pixelSize);

    gameplayToStartButton.transform.position = vec2(gameWidth-(80*pixelSize), gameHeight - (40*pixelSize));
    gameplayToStartButton.transform.scale = vec2(80*pixelSize, 40*pixelSize);

    playerPaddle.transform.position = resizeVec2(playerPaddle.transform.position);
    enemyPaddle.transform.position = resizeVec2(enemyPaddle.transform.position);
    playerPaddle.transform.scale = resizeVec2(playerPaddle.transform.scale);
    enemyPaddle.transform.scale = resizeVec2(enemyPaddle.transform.scale);

    ballPosition = resizeVec2(ballPosition);
    ballRadius = 4 * pixelSize;
    ballSpeed = 4 * pixelSize;
    enemyPaddleSpeed = 0.15 * pixelSize;
}

function gameplayDraw(deltaTime)
{
    background.drawSc();
    playerPaddle.drawSc();
    enemyPaddle.drawSc();
    drawCircle(renderer, ballPosition, ballRadius, true, "white");
}

function gameplayUpdate(deltaTime)
{
    playerPaddle.transform.position.x = 60*pixelSize;

    if(ballPosition.y > enemyPaddle.transform.position.y)
        enemyPaddle.transform.position.y += enemyPaddleSpeed * deltaTime;
    else if(ballPosition.y < enemyPaddle.transform.position.y)
        enemyPaddle.transform.position.y -= enemyPaddleSpeed * deltaTime;

    ballPosition.x += Math.cos(ballAngle) * ballSpeed;
    ballPosition.y += Math.sin(ballAngle) * ballSpeed;

    //Collision Handling (Paddles and Ball)
    var collision = playerPaddle.relPointInside(ballPosition);
    if(collision.x != -1 || collision.y != -1)
    {
        ballAngle += degToRad(180.0 + (10.0 - (Math.random() * 20.0)));
    }
    collision = enemyPaddle.relPointInside(ballPosition);
    if(collision.x != -1 || collision.y != -1)
    {
        ballAngle += degToRad(180.0 + (10.0 - (Math.random() * 20.0)));
    }

    //That's not how pong collision works but you get the idea, right? -_-
    if(ballPosition.x < gameWidth * 0.05)
    {
        ballAngle += degToRad(90.0);
        enemyScore.text = (parseInt(enemyScore.text) + 1).toString();
        ballReset();
    }
    else if(ballPosition.x > gameWidth * 0.95)
    {
        ballAngle += degToRad(90.0);
        playerScore.text = (parseInt(playerScore.text) + 1).toString();
        ballReset();
    }
    else if(ballPosition.y < gameHeight * 0.05)
    {
        ballAngle += degToRad(90.0);
    }
    else if(ballPosition.y > gameHeight * 0.95)
    {
        ballAngle += degToRad(90.0);
    }
}

function gameplayEvent(deltaTime)
{
    playerPaddle.transform.position = touchPos[0].subtract(vec2(canvasStartX, canvasStartY));

    if(gameplayToStartButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = STARTSCREEN;
        gameplayReset();
        gameplayToStartButton.button.resetOutput();
    }
}