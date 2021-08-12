JSGameDevLib
==========
 
This is the JavaScript Game Development Boilerplate/Helper code which I use to develop web games with JavaScript.

Following are the games that uses this library as a base:
1. **Flick Tactics - https://boldaestheticcreative.itch.io/flick-tactics**
2. **Mystic Chambers - https://boldaestheticcreative.itch.io/mystic-chambers**
3. **Leaf Cutter Empire - https://digital-naturalism-laboratories.github.io/leafcutter-ants-game/**

Here are some valuable points for understanding the library:
* Renderer is the same thing as context of canvas. The context is used mostly for rendering therefore, I named it renderer instead of context.
* tr() is short for **Transform** which is just a container for position, scale, rotation and origin (origin is unused yet).
* Position and scale are stored as **Vector2** not only in Transform but almost in the entire codebase. Therefore, it is also shortened to vec2().

This library focuses a lot on UI and States.

Concept of UI
--------

**UI Context** - Struct that defines the renderer, font and theme of the **UI**. It is already initialized as uiContext global variable. Basically, whereever you leave parameters as default/undefined in the **UI Object**, it will be given a value from this struct.

**UI** - Singleton class which contains a bunch of **UI States**. Its purpose is to display 1 UI State at a time.

**UI State** - Contains bunch of **UI Objects**.

**UI Object** - UI that user interacts with e.g, Button, Label. Could also be abstract (like GridGroup) or complex (like Slider).

**SubState** - Acts like **UI State** but derived from **UI Object** that contains multiple other **UI Objects**.

UI Creation
--------
```
//you must set its renderer
uiContext.set(renderer, /*...*/);

ui = new UI(uistates, 1);

//here, 1 means the second UI state (0 means first one ofc)

//==> in which:
uistates = [];
uistates.push(new UIState(menu));
uistates.push(new UIState(play));
//...and more

//the second UI state is 'play' so, the play UI is displayed.

//==> in which:
menu = [];

//menu will be an array of UI Objects and Button is a UI Object
menu.push(new Button(/*...*/) );

//Text button is a UI Object which is a combination of a button and a label
menu.push(new TextButton(tr(/*...*/), new Button(/*...*/), new Label(/*...*/) );

//...and more
//Similar is for play
```

UI Rendering and Events
--------
```
//Where the sprites and other things are being rendered
//(probably, inside some draw or render function), add this
ui.draw();

//Similar is for ui.update() and ui.event();

//to catch a click from a button, you need to look at its *output*.
if(menu[0].output == UIOUTPUT_SELECT)
    //whatever you want it to do...
//for TextButton, you need to go a little deeper (i.e get your button!)
else if(menu[1].button.output == UIOUTPUT_SELECT)
    //whatever you want it to do...

//in case of a Slider (assume that play[2] is a Slider)
variableToChangeValue = play[2].knobValue;
```

Ask me
--------

If you intend to use this library/code and you are unable to understand some aspects of it OR you want make the library/code better and you have some suggestions, you can email me at **programmercheema@gmail.com**.
