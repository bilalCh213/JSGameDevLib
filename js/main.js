
window.onload = function()
{
    init();
    frame();
};

function event(deltaTime)
{
    switch(ui.stateIndex)
    {
        case STARTSCREEN: startscreenEvent(deltaTime); break;
        case GAMEPLAY: gameplayEvent(deltaTime); break;
        case ABOUT: aboutEvent(deltaTime); break;
    }
    ui.event();
}

function update(deltaTime)
{
    switch(ui.stateIndex)
    {
        case STARTSCREEN: startscreenUpdate(deltaTime); break;
        case GAMEPLAY: gameplayUpdate(deltaTime); break;
        case ABOUT: aboutUpdate(deltaTime); break;
    }
    ui.update();
}

function draw(deltaTime)
{
    renderer.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawRect(renderer, vec2(0, 0), vec2(window.innerWidth, window.innerHeight), true, "black");
    switch(ui.stateIndex)
    {
        case STARTSCREEN: startscreenDraw(deltaTime); break;
        case GAMEPLAY: gameplayDraw(deltaTime); break;
        case ABOUT: aboutDraw(deltaTime); break;
    }
    ui.draw();
    //ui.debugDraw("green");
}

function frame()
{
    var deltaTime = getDeltaTime();
    if (ImageObject.areAllLoaded())
    {
        event(deltaTime);
        update(deltaTime);
        draw(deltaTime);
    }
    setTimeout(frame, 15);
}