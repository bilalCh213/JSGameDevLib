const STARTSCREEN = 0;
var startscreen = [];

function startscreenSetup()
{
    var fontSize = 14.0 * pixelSize;

    background = new Sprite(tr(vec2(gameWidth/2, gameHeight/2), vec2(1, 1)),
        new ImageObject("images/pongbg.png"));
    background.transform.scale = vec2(gameWidth / background.imageObject.image.width, gameHeight / background.imageObject.image.height);

    menuUI = [];
    titleLabel = new Label(tr(), "PONG",
        (fontSize*2).toString() + "px " + uiContext.fontFamily, "lightblue")
    menuUI.push(titleLabel);
    playButton = new TextButton(tr(),
        new Label(tr(), "PLAY",
        fontSize.toString() + "px " + uiContext.fontFamily),
        new Button(tr(), "#00006666", "#FFFFFFFF", "#002299FF"),"");
    menuUI.push(playButton);
    aboutButton = new TextButton(tr(),
        new Label(tr(), "ABOUT",
        fontSize.toString() + "px " + uiContext.fontFamily),
        new Button(tr(), "#00006666", "#FFFFFFFF", "#002299FF"),"");
    menuUI.push(aboutButton);

    startscreen.push(new FlexGroup(tr(vec2(gameWidth/4, gameHeight/4), vec2(gameWidth/2, gameHeight/2)),
        new SubState(tr(), menuUI),false, vec2(0, 20), vec2(1, 3), true));

    bacStudiosLabel = new Label(tr(vec2(0, gameHeight - (fontSize*1.2)), vec2(gameWidth, (fontSize*1.2))), "By Bold Aesthetic Creative Studios",
        fontSize.toString() + "px " + uiContext.fontFamily, undefined, 1);
    startscreen.push(bacStudiosLabel);
}

function startscreenResize()
{
    var fontSize = 14.0 * pixelSize;

    background.transform.position = vec2(gameWidth/2, gameHeight/2);
    background.transform.scale = vec2(gameWidth / background.imageObject.image.width, gameHeight / background.imageObject.image.height);

    titleLabel.font = (fontSize*2).toString() + "px " + uiContext.fontFamily;
    playButton.label.font = aboutButton.label.font = bacStudiosLabel.font = fontSize.toString() + "px " + uiContext.fontFamily;

    bacStudiosLabel.transform.position = vec2(0, gameHeight - (fontSize*1.2));
    bacStudiosLabel.transform.scale = vec2(gameWidth, (fontSize*1.2));

    startscreen[0].transform.position = vec2(gameWidth/4, gameHeight/4);
    startscreen[0].transform.scale = vec2(gameWidth/2, gameHeight/2);
}

function startscreenDraw(deltaTime)
{
    background.drawSc();
}

function startscreenUpdate(deltaTime)
{
}

function startscreenEvent(deltaTime)
{
    if(playButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = GAMEPLAY;
        playButton.button.resetOutput();
    }
    else if(aboutButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = ABOUT;
        aboutButton.button.resetOutput();
    }
}