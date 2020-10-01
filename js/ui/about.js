const ABOUT = 2;
var about = [];

function aboutSetup()
{
    bacLogo = new Sprite(tr(vec2(gameWidth/4, gameHeight - (gameHeight/4))), new ImageObject("images/bacLogo.png"));
    htgdLogo = new Sprite(tr(vec2(gameWidth - (gameWidth/4), gameHeight - (gameHeight/4))), new ImageObject("images/htgd.png"));

    bacLogo.transform.scale = vec2((gameWidth/4)/bacLogo.imageObject.image.width, (gameHeight/4)/bacLogo.imageObject.image.height);
    htgdLogo.transform.scale = vec2((gameWidth/4)/htgdLogo.imageObject.image.width, (gameHeight/4)/htgdLogo.imageObject.image.height);

    var fontStr = (12 * pixelSize).toString() + "px " + uiContext.fontFamily;

    labelGroup = [];
    labelGroup.push(new Label(tr(), "Made using JSGameDevLib", fontStr));
    labelGroup.push(new Label(tr(), "", fontStr));
    labelGroup.push(new Label(tr(), "List of Games made using JSGameDevLib:", fontStr));
    labelGroup.push(new Label(tr(), "Mystic Chambers", fontStr));
    labelGroup.push(new Label(tr(), "https://bacstudios.itch.io/mystic-chambers", fontStr));
    labelGroup.push(new Label(tr(), "Leaf Cutter Empire", fontStr));
    labelGroup.push(new Label(tr(), "https://digital-naturalism-laboratories.github.io/leafcutter-ants-game", fontStr));
    
    about.push(new FlexGroup(tr(vec2(0, 20 * pixelSize), vec2(gameWidth, gameHeight/2)),
        new SubState(tr(), labelGroup),false, vec2(0, 20), vec2(1, 8), true));

    aboutToStartButton = new TextButton(tr(vec2(gameWidth-(80*pixelSize), gameHeight - (40*pixelSize)), vec2(80*pixelSize, 40*pixelSize)),
        new Label(tr(), "BACK", fontStr, "lightblue"),
        new Button(tr(), "#000066CC", "#FFFFFFFF", "#002299FF"));
    about.push(aboutToStartButton);
}

function aboutResize()
{
    var fontStr = (12 * pixelSize).toString() + "px " + uiContext.fontFamily;

    for(let i = 0; i < labelGroup.length; i++)
    {
        labelGroup[i].font = fontStr;
    }
    aboutToStartButton.label.font = fontStr;

    about[0].transform.position = vec2(0, 20 * pixelSize);
    about[0].transform.scale = vec2(gameWidth, gameHeight/2);

    bacLogo.transform.position = vec2(gameWidth/4, gameHeight - (gameHeight/4));
    htgdLogo.transform.position = vec2(gameWidth - (gameWidth/4), gameHeight - (gameHeight/4));
    bacLogo.transform.scale = vec2((gameWidth/4)/bacLogo.imageObject.image.width, (gameHeight/4)/bacLogo.imageObject.image.height);
    htgdLogo.transform.scale = vec2((gameWidth/4)/htgdLogo.imageObject.image.width, (gameHeight/4)/htgdLogo.imageObject.image.height);

    aboutToStartButton.transform.position = vec2(gameWidth-(80*pixelSize), gameHeight - (40*pixelSize));
    aboutToStartButton.transform.scale = vec2(80*pixelSize, 40*pixelSize);
}

function aboutDraw(deltaTime)
{
    bacLogo.drawSc();
    htgdLogo.drawSc();
}

function aboutUpdate(deltaTime)
{
}

function aboutEvent(deltaTime)
{
    if(aboutToStartButton.button.output == UIOUTPUT_SELECT)
    {
        ui.stateIndex = STARTSCREEN;
        aboutToStartButton.button.resetOutput();
    }
}