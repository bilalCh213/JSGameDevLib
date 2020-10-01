class UIContext
{
    constructor()
    {
        this.roundness = 2;
        this.fontFamily = "Lucida, sans-serif";
        this.fontSize = (window.innerWidth * 0.01).toString();
        this.fgPrimaryColor = "#3dbf5a";
        this.fgSecondaryColor = "#22c93c";
        this.fgTertiaryColor = "#7fcdae";
        this.bgPrimaryColor = "#4d4646";
        this.bgSecondaryColor = "#696161";
        this.textColor = "#fff5f5";
    }

    set(renderer, roundness, fontFamily, fontSize, fgPrimaryColor, fgSecondaryColor, fgTertiaryColor, bgPrimaryColor, bgSecondaryColor, textColor)
    {
        this.renderer = renderer;

        if(typeof roundness != "undefined") this.roundness = roundness;

        if(typeof fontFamily != "undefined") this.fontFamily = fontFamily;
        if(typeof fontSize != "undefined") this.fontSize = fontSize;

        if(typeof fgPrimaryColor != "undefined") this.fgPrimaryColor = fgPrimaryColor;
        if(typeof fgSecondaryColor != "undefined") this.fgSecondaryColor = fgSecondaryColor;
        if(typeof fgTertiaryColor != "undefined") this.fgTertiaryColor = fgTertiaryColor;
        if(typeof bgPrimaryColor != "undefined") this.bgPrimaryColor = bgPrimaryColor;
        if(typeof bgSecondaryColor != "undefined") this.bgSecondaryColor = bgSecondaryColor;
        if(typeof textColor != "undefined") this.textColor = textColor;
    }
}

uiContext = new UIContext();

class UI
{
    //contains all the UI States
    //runs only 1 UIState at a time

    constructor(uiStates, stateIndex)
    {
        this.uiStates = uiStates;
        this.stateIndex = stateIndex;

        this.prevState = this.uiStates;
    }

    getActiveState()
    {
        if(this.stateIndex < 0 || this.stateIndex >= this.uiStates.length) return null;
        return this.uiStates[this.stateIndex];
    }

    event()
    {
        this.getActiveState().event();
    }

    update()
    {
        this.getActiveState().update();
    }

    draw()
    {
        this.getActiveState().draw();
    }
    
    debugDraw(color)
    {
        debugDrawState(color, this.getActiveState());
    }
}

class UIState
{
    //contains a bunch of UIObjects
    //iterate through all the UIObjects

    constructor(uiObjects)
    {
        this.uiObjects = uiObjects;
    }

    event()
    {
        for (var i = 0; i < this.uiObjects.length; i++)
        {
            this.uiObjects[i].event();
        }
    }

    update()
    {
        for (var i = 0; i < this.uiObjects.length; i++)
        {
            this.uiObjects[i].update();
        }
    }

    draw()
    {
        for (var i = 0; i < this.uiObjects.length; i++)
        {
            this.uiObjects[i].draw();
        }
    }
}

function debugDrawState(color, state)
{
    for (var i = 0; i < state.uiObjects.length; i++)
    {
        drawRect(uiContext.renderer, state.uiObjects[i].transform.position, state.uiObjects[i].transform.scale, false, color);

        if(typeof state.uiObjects[i].subState != "undefined"
        && typeof state.uiObjects[i].subState.uiObjects != "undefined")
            debugDrawState(color, state.uiObjects[i].subState);
    }
}

var UIOUTPUT_DISABLED = -1;
var UIOUTPUT_RUNNING = 0;
var UIOUTPUT_HOVER = 1;
var UIOUTPUT_SELECT = 2;

function defUIEvent(output, transform, touchId)
{
    if(this.enabled)
    {
        touchId = touched(transform);
        if (touchId != -1)
        {
            output = UIOUTPUT_SELECT;
        }
        else if (hover(transform))
        {
            output = UIOUTPUT_HOVER;
        }
        else
        {
            output = UIOUTPUT_RUNNING;
        }
    }
}

//interface class
class UIObject
{
    constructor(transform)
    {
        this.transform = transform;

        this.event = function() { defUIEvent(this.output, this.transform, this.touchId); };

        this.output = UIOUTPUT_RUNNING;

        this.touchId = -1;

        this.enabled = true;
        this.visible = true;
    }

    getEvent()
    {
        return this.event;
    }

    setEvent(func)
    {
        this.event = func;
    }

    update()
    {}

    draw()
    {}
}

class SubState extends UIObject
{
    //contains multiple UIObjects

    constructor(transform, uiObjects)
    {
        super(transform);
        this.uiObjects = uiObjects;

        this.event = function()
        {
            defUIEvent(this.output, this.transform, this.touchId);

            if(this.enabled)
            {
                for (var i = 0; i < this.uiObjects.length; i++)
                {
                    this.uiObjects[i].transform.position = this.uiObjects[i].transform.position.add(this.transform.position);

                    this.uiObjects[i].event();
                    
                    this.uiObjects[i].transform.position = this.uiObjects[i].transform.position.subtract(this.transform.position);
                }
            }
        };
    }

    update()
    {
        if(this.enabled)
        {
            for (var i = 0; i < this.uiObjects.length; i++)
            {
                this.uiObjects[i].update();
            }
        }
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                for (var i = 0; i < this.uiObjects.length; i++)
                {
                    this.uiObjects[i].transform.position = this.uiObjects[i].transform.position.add(this.transform.position);

                    this.uiObjects[i].draw();
                    
                    this.uiObjects[i].transform.position = this.uiObjects[i].transform.position.subtract(this.transform.position);
                }
            }
        }
    }
}

class Label extends UIObject
{
    constructor(transform, text, font, textColor, align, tooltip)
    {
        super(transform);
        
        this.text = text;
        this.tooltip = tooltip;
    
        this.font = typeof font == "undefined" ? uiContext.fontSize.toString() + "px " + uiContext.fontFamily : font;
    
        this.textColor = typeof textColor == "undefined" ? uiContext.textColor : textColor;

        this.align = typeof align == "undefined" ? 0 : align;
    }
    
    draw()
    {
        if(this.enabled)
        {
            if(this.visible && this.text!=undefined)
            {
                uiContext.renderer.font = this.font;
                var lineHeight = uiContext.renderer.measureText('M').width;

                var posAlignFactor = 0;

                if(this.align == 0)
                {
                    posAlignFactor = (this.transform.scale.x / 2) - (uiContext.renderer.measureText(this.text).width / 2);
                }
                else if(this.align == 1)
                {
                    posAlignFactor = this.transform.scale.x - uiContext.renderer.measureText(this.text).width;
                }
            
                uiContext.renderer.fillStyle = this.textColor;
                uiContext.renderer.fillText(this.text, this.transform.position.x + posAlignFactor,
                    this.transform.position.y + (this.transform.scale.y / 2) + (lineHeight / 2),
                    this.transform.scale.x);
            }
        }
    }
}

class Button extends UIObject
{
    constructor(transform, btnColor, selectColor, hoverColor, disabledColor)
    {
        super(transform);

        this.btnColor = typeof btnColor == "undefined" ? uiContext.fgPrimaryColor : btnColor;
        this.defColor = this.btnColor;

        this.selectColor = typeof selectColor == "undefined" ? uiContext.fgSecondaryColor : selectColor;
        this.hoverColor = typeof hoverColor == "undefined" ? uiContext.fgTertiaryColor : hoverColor;
        this.disabledColor = typeof disabledColor == "undefined" ? uiContext.fgPrimaryColor + "80" : disabledColor;

        this.prevTouchId = -1;

        this.event = function()
        {
            if(this.enabled)
            {
                this.touchId = touched(this.transform);
                
                if (this.touchId != -1 && this.prevTouchId == -1)
                {
                    this.btnColor = this.selectColor;
                    this.output = UIOUTPUT_SELECT;
                }
                else if (hover(this.transform))
                {
                    this.btnColor = this.hoverColor;
                    this.output = UIOUTPUT_HOVER;
                }
                else if (this.output == UIOUTPUT_DISABLED)
                {
                    this.btnColor = this.disabledColor;
                }
                else
                {
                    this.btnColor = this.defColor;
                    this.output = UIOUTPUT_RUNNING;
                }

                this.prevTouchId = this.touchId;
            }
        };
    }

    resetOutput()
    {
        this.btnColor = this.defColor;
        this.output = UIOUTPUT_RUNNING;
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
                drawRect(uiContext.renderer, this.transform.position, this.transform.scale, true, this.btnColor, uiContext.roundness);
        }
    }
}

class Selector
{
    constructor(object, selected, possibleSelections, deselectable)
    {
        this.object = object;

        this.selected = typeof selected == "undefined" ? false : selected;

        this.possibleSelections = typeof possibleSelections == "undefined" ? -1 /* means infinite */ : possibleSelections;

        this.deselectable = typeof deselectable == "undefined" ? true : deselectable;

        this.otherSelectors = [];
        this.otherObjects = [];
    }

    groupSelectors(uiObjects)
    {
        if(typeof uiObjects != "undefined"
            && uiObjects != null
            && uiObjects.length > 0)
        {
            this.otherObjects = uiObjects;

            for(let i = 0; i < uiObjects.length; i++)
            {
                this.otherSelectors.push(uiObjects[i].selector);

                if(uiObjects[i].selector.otherSelectors.length <= 0)
                {
                    //those selector.otherSelectors won't contain the this selector so, we add it seperately...
                    uiObjects[i].selector.otherSelectors.push(this);

                    for(let a = 0; a < uiObjects.length; a++)
                    {
                        if(uiObjects[i] != uiObjects[a])
                        //...and prevent self selector from adding into itself
                        {
                            uiObjects[i].selector.otherSelectors.push(uiObjects[a].selector);
                        }
                    }
                }
            }
        }
    }

    getTotalNumberOfSelections()
    {
        var no = 0;
        if(this.selected) no++;
        for(let i = 0; i < this.otherSelectors.length; i++)
            if(this.otherSelectors[i].selected) no++;

        return no;
    }

    select()
    {
        this.selected = this.deselectable ? !this.selected : true;

        if(this.possibleSelections > -1)
        {
            for(let i = 0; i < this.otherSelectors.length; i++)
            {
                if(this.getTotalNumberOfSelections() <= this.possibleSelections) break;

                this.otherSelectors[i].selected = false;
            }
        }

        return this.selected;
    }
}

class RadioButton extends UIObject
{
    constructor(transform, otherRadioButtons, enableRadius, color, check, enableColor, disableColor)
    {
        super(transform);

        this.transform.scale = vec2((this.transform.scale.x + this.transform.scale.y)/2,
            (this.transform.scale.x + this.transform.scale.y)/2);

        this.enableRadius = typeof enableRadius == "undefined" ?
            this.transform.scale.x /* or y; doesnt matter */ - 4 : enableRadius;

        this.color = typeof color == "undefined" ? uiContext.bgSecondaryColor : color;

        this.enableColor = typeof enableColor == "undefined" ? uiContext.fgSecondaryColor : enableColor;
        this.disableColor = typeof disableColor == "undefined" ? uiContext.bgPrimaryColor : disableColor;

        this.selector = new Selector(this, typeof check == "undefined" ? false : check, 1, false);
        this.selector.groupSelectors(otherRadioButtons);

        this.prevTouchId = -1;

        this.event = function()
        {
            if(this.enabled)
            {
                this.transform.position = this.transform.position.subtract(this.transform.scale);
                this.transform.scale = this.transform.scale.multiply(vec2(2, 2));
                this.touchId = touched(this.transform);
                this.transform.scale = this.transform.scale.divide(vec2(2, 2));
                this.transform.position = this.transform.position.add(this.transform.scale);

                if (this.touchId != -1 && this.prevTouchId == -1)
                {
                    this.selector.select();
                    this.output = UIOUTPUT_SELECT;
                }

                this.prevTouchId = this.touchId;
            }
        };
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                drawCircle(uiContext.renderer, this.transform.position, this.transform.scale.x, true, this.color);
                drawCircle(uiContext.renderer, vec2(this.transform.position.x, this.transform.position.y),
                    this.enableRadius, true, this.selector.selected ? this.enableColor : this.disableColor);
            }
        }
    }
}

class Panel extends UIObject
{
    constructor(transform, subState, minOffset, maxOffset, color, offset)
    {
        super(transform);

        this.fixPosition = vec2(this.transform.position.x, this.transform.position.y);

        this.subState = typeof subState == "undefined" ? new SubState(transform) : subState;
        this.subState.transform = transform;

        this.uiObjectsFixPosition = [];
        for(let i = 0; i < this.subState.uiObjects.length; i++)
            this.uiObjectsFixPosition.push(this.subState.uiObjects[i].transform.position);

        this.minOffset = typeof minOffset == "undefined" ? vec2(0, 0) : minOffset;
        this.maxOffset = typeof maxOffset == "undefined" ? vec2(0, 0) : maxOffset;

        this.color = typeof color == "undefined" ? uiContext.bgPrimaryColor : color;

        this.offset = typeof offset == "undefined" ? vec2(0, 0) : offset;

        this.event = function()
        {
            if(this.enabled)
            {
                subState.event();

                this.touchId = touched(this.transform);

                dragMove(this.transform, 0.7);

                this.offset = this.transform.position;

                if (this.touchId != -1)
                {
                    this.output = UIOUTPUT_SELECT;
                }
                else if (hover(this.transform))
                {
                    this.offset.y -= wheelScroll;
                    this.output = UIOUTPUT_HOVER;
                }
                else
                {
                    this.output = UIOUTPUT_RUNNING;
                }

                if(this.offset.x > this.maxOffset.x) this.offset.x = this.maxOffset.x;
                else if(this.offset.x < this.minOffset.x) this.offset.x = this.minOffset.x;
                if(this.offset.y > this.maxOffset.y) this.offset.y = this.maxOffset.y;
                else if(this.offset.y < this.minOffset.y) this.offset.y = this.minOffset.y;

                wheelScroll = 0;
            }
        };
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                drawRect(uiContext.renderer, this.fixPosition, this.transform.scale, true, this.color, uiContext.roundness);

                uiContext.renderer.save();
                clipRect(uiContext.renderer, this.fixPosition, this.transform.scale);
                //uiContext.renderer.transform(1, 0, 0, 1, this.offset.x, this.offset.y);
                for(let i = 0; i < this.subState.uiObjects.length; i++)
                {
                    this.subState.uiObjects[i].transform.position = this.uiObjectsFixPosition[i].add(this.offset);
                    this.subState.uiObjects[i].draw();
                }
                //uiContext.renderer.transform(1, 0, 0, 1, -this.offset.x, -this.offset.y);
                uiContext.renderer.restore();
            }
        }
    }
}

class GridGroup extends UIObject
{
    constructor(transform, subState, isAxisVertical, gridSpace, gridSize, cellSize)
    {
        super(transform);

        this.subState = typeof subState == "undefined" ? new SubState(transform) : subState;
        
        this.isAxisVertical = typeof isAxisVertical == "undefined" ? true : isAxisVertical;
        
        this.gridSpace = typeof gridSpace == "undefined" ? vec2(0, 0) : gridSpace;
        
        this.gridSize = typeof gridSize == "undefined" ? vec2(-1, -1) : gridSize;
        
        this.cellSize = typeof cellSize == "undefined" ? vec2(-1, -1) : cellSize;
        
        this.adaptX = typeof cellSize == "undefined" ? true : cellSize.x <= -1;
        this.adaptY = typeof cellSize == "undefined" ? true : cellSize.y <= -1;
        
        this.event = function()
        {
            this.subState.event();
            defUIEvent();
            
            if(this.enabled)
            {
                this.updateCellSize();
            }
        };
    }
    
    updateCellSize()
    {
        if(!this.adaptX && !this.adaptY) return;
        
        for(let i = 0; i < this.subState.uiObjects.length; i++)
        {
            if(this.adaptX && this.subState.uiObjects[i].transform.scale.x > this.cellSize.x)
                this.cellSize.x = this.subState.uiObjects[i].transform.scale.x;
            if(this.adaptY && this.subState.uiObjects[i].transform.scale.y > this.cellSize.y)
                this.cellSize.y = this.subState.uiObjects[i].transform.scale.y;
        }
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                var cellPos = vec2(this.transform.position.x, this.transform.position.y);
                var gridSizeCounter = vec2(0, 0);
                for(let i = 0; i < this.subState.uiObjects.length; i++)
                {
                    if(!this.subState.uiObjects[i].enabled
                    || !this.subState.uiObjects[i].visible) continue;

                    this.subState.uiObjects[i].transform.position = vec2(cellPos.x, cellPos.y);
                    
                    this.subState.uiObjects[i].draw();
                    
                    if(!this.isAxisVertical)
                    {
                        if((cellPos.x + this.cellSize.x + this.gridSpace.x < this.transform.position.x + this.transform.scale.x
                        && this.gridSize.x <= -1)
                        || gridSizeCounter.x + 1 < this.gridSize.x)
                        {
                            cellPos.x += this.cellSize.x + this.gridSpace.x;
                            
                            gridSizeCounter.x++;
                        }
                        else
                        {
                            cellPos.x = this.transform.position.x;
                            cellPos.y += this.cellSize.y + this.gridSpace.y;
                            
                            gridSizeCounter.x = 0;
                            gridSizeCounter.y++;
                        }
                    }
                    else
                    {
                        if ((cellPos.y + this.cellSize.y + this.gridSpace.y < this.transform.position.y + this.transform.scale.y
                        && this.gridSize.y <= -1)
                        || gridSizeCounter.y + 1 < this.gridSize.y)
                        {
                            cellPos.y += this.cellSize.y + this.gridSpace.y;
                            
                            gridSizeCounter.y++;
                        }
                        else
                        {
                            cellPos.y = this.transform.position.y;
                            cellPos.x += this.cellSize.x + this.gridSpace.x;
                            
                            gridSizeCounter.y = 0;
                            gridSizeCounter.x++;
                        }
                    }
                }
            }
        }
    }
}

class FlexGroup extends UIObject
{
    constructor(transform, subState, isAxisVertical, gridSpace, gridSize, scaleFlex)
    {
        super(transform);

        this.subState = typeof subState == "undefined" ? new SubState(transform) : subState;
        
        this.isAxisVertical = typeof isAxisVertical == "undefined" ? true : isAxisVertical;
        
        this.gridSpace = typeof gridSpace == "undefined" ? vec2(0, 0) : gridSpace;
        
        this.gridSize = typeof gridSize == "undefined" ? vec2(-1, -1) : gridSize;
        
        this.cellSize = typeof cellSize == "undefined" ? vec2(-1, -1) : cellSize;

        this.scaleFlex = typeof scaleFlex == "undefined" ? true : scaleFlex;
        
        this.event = function()
        {
            this.subState.event();
            defUIEvent();
            
            if(this.enabled)
            {
                this.updateCellSize();
            }
        };
    }
    
    updateCellSize()
    {
        this.cellSize = vec2(
            (this.transform.scale.x / this.gridSize.x) - this.gridSpace.x,
            (this.transform.scale.y / this.gridSize.y) - this.gridSpace.y
            );
        
        if(this.scaleFlex)
            for(let i = 0; i < this.subState.uiObjects.length; i++)
            {
                this.subState.uiObjects[i].transform.scale = vec2(this.cellSize.x, this.cellSize.y);
            }
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                if(!this.scaleFlex) this.transform.scale = vec2(this.subState.uiObjects[0].transform.scale.x, this.subState.uiObjects[0].transform.scale.y);

                var cellPos = vec2(this.transform.position.x, this.transform.position.y);
                var gridSizeCounter = vec2(0, 0);
                for(let i = 0; i < this.subState.uiObjects.length; i++)
                {
                    if(!this.subState.uiObjects[i].enabled
                    || !this.subState.uiObjects[i].visible) continue;

                    this.subState.uiObjects[i].transform.position = vec2(cellPos.x, cellPos.y);

                    if(gridSizeCounter.x == this.gridSize.x - 1)
                        this.subState.uiObjects[i].transform.scale.x -= this.gridSpace.x;
                    if(gridSizeCounter.y == this.gridSize.y - 1)
                        this.subState.uiObjects[i].transform.scale.y -= this.gridSpace.y;
                    
                    this.subState.uiObjects[i].draw();

                    if(gridSizeCounter.x == this.gridSize.x - 1)
                        this.subState.uiObjects[i].transform.scale.x += this.gridSpace.x;
                    if(gridSizeCounter.y == this.gridSize.y - 1)
                        this.subState.uiObjects[i].transform.scale.y += this.gridSpace.y;
                    
                    if(!this.isAxisVertical)
                    {
                        if((cellPos.x + this.cellSize.x + this.gridSpace.x < this.transform.position.x + this.transform.scale.x
                        && this.gridSize.x <= -1)
                        || gridSizeCounter.x + 1 < this.gridSize.x)
                        {
                            cellPos.x += (this.scaleFlex ? this.cellSize.x : this.subState.uiObjects[i].transform.scale.x) + this.gridSpace.x;
                            
                            if(!this.scaleFlex && i > 0) this.transform.scale.x += this.subState.uiObjects[i].transform.scale.x;

                            gridSizeCounter.x++;
                        }
                        else
                        {
                            cellPos.x = this.transform.position.x;
                            cellPos.y += (this.scaleFlex ? this.cellSize.y : this.subState.uiObjects[i].transform.scale.y) + this.gridSpace.y;
                            
                            if(!this.scaleFlex && i > 0) this.transform.scale.y += this.subState.uiObjects[i].transform.scale.y;

                            gridSizeCounter.x = 0;
                            gridSizeCounter.y++;
                        }
                    }
                    else
                    {
                        if ((cellPos.y + this.cellSize.y + this.gridSpace.y < this.transform.position.y + this.transform.scale.y
                        && this.gridSize.y <= -1)
                        || gridSizeCounter.y + 1 < this.gridSize.y)
                        {
                            cellPos.y += (this.scaleFlex ? this.cellSize.y : this.subState.uiObjects[i].transform.scale.y) + this.gridSpace.y;
                            
                            if(!this.scaleFlex && i > 0) this.transform.scale.y += this.subState.uiObjects[i].transform.scale.y;

                            gridSizeCounter.y++;
                        }
                        else
                        {
                            cellPos.y = this.transform.position.y;
                            cellPos.x += (this.scaleFlex ? this.cellSize.x : this.subState.uiObjects[i].transform.scale.x) + this.gridSpace.x;
                            
                            if(!this.scaleFlex && i > 0) this.transform.scale.x += this.subState.uiObjects[i].transform.scale.x;

                            gridSizeCounter.y = 0;
                            gridSizeCounter.x++;
                        }
                    }
                }
            }
        }
    }
}

class TextButton extends UIObject
{
    constructor(transform, label, button, tooltip)
    {
        super(transform);

        this.tooltip = tooltip;
        
        this.label = typeof label == "undefined" ? new Label(this.transform) : label;
        this.label.transform = this.transform;
        this.label.tooltip = tooltip;

        this.button = typeof button == "undefined" ? new Button(this.transform) : button;
        this.button.transform = this.transform;
        this.button.tooltip = tooltip;

        this.event = function()
        {
            if(this.enabled)
            {
                this.touchId = touched(this.transform);

                this.button.transform = this.transform;
                this.label.transform = this.transform;

                this.button.event();
                this.label.event();
            }
        };
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                this.button.draw();
                this.label.draw();
            }
        }
    }
}

class Tab extends UIObject
{
    constructor(transform, uiObjectsToToggle, otherTabs, textButton, selected, enableColor, disableColor)
    {
        super(transform);

        this.uiObjectsToToggle = uiObjectsToToggle;
        //for(let i = 0; i < this.uiObjectsToToggle; i++) this.uiObjectsToToggle.enabled = false;

        this.textButton = typeof textButton == "undefined" ? new TextButton(this.transform) : textButton;
        this.textButton.transform = this.transform;

        this.enableColor = typeof enableColor == "undefined" ? uiContext.fgTertiaryColor : enableColor;
        this.disableColor = typeof disableColor == "undefined" ? uiContext.fgPrimaryColor : disableColor;

        this.selector = new Selector(this, typeof selected == "undefined" ? false : selected, 1, true);
        this.selector.groupSelectors(otherTabs);

        this.prevTouchId = -1;

        this.event = function()
        {
            if(this.enabled)
            {
                this.touchId = touched(this.transform);

                if (this.touchId != -1 && this.prevTouchId == -1)
                {
                    this.selector.select();

                    if(this.selector.selected)
                    {
                        for(let i = 0; i < this.selector.otherSelectors.length; i++)
                        {
                            if(!this.selector.otherSelectors[i].object.enabled)
                            {
                                for(let o = 0; o < this.selector.otherSelectors[i].object.uiObjectsToToggle.length; o++)
                                {
                                    this.selector.otherSelectors[i].object.uiObjectsToToggle[o].enabled = false;
                                }
                            }
                        }
                    }

                    this.output = UIOUTPUT_SELECT;
                }

                if(typeof this.uiObjectsToToggle != "undefined")
                    for(let i = 0; i < this.uiObjectsToToggle.length; i++)
                        this.uiObjectsToToggle[i].enabled = this.selector.selected;

                this.textButton.transform = this.transform;

                this.textButton.event();

                this.prevTouchId = this.touchId;
            }
        };
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                this.textButton.button.btnColor = this.selector.selected ? this.enableColor : this.disableColor;
                this.textButton.draw();
            }
        }
    }
}

class Slider extends UIObject
{
    constructor(transform, rangeVec2, label, steps, knobValue, knobRadius, knobColor, bgLineThickness, bgLineColor, selectKnobColor, disabledKnobColor,tooltip)
    {
        super(transform);

        this.tooltip = tooltip;

        this.range = typeof rangeVec2 == "undefined" ? vec2(0, 1) : rangeVec2;

        this.label = typeof label == "undefined" ? new Label(new Transform(transform.position), '') : label;
        this.label.transform.position = this.transform.position;
        this.label.transform.scale = vec2(this.transform.scale.x/2, this.transform.scale.y);
        this.label.tooltip = tooltip;

        this.steps = typeof steps == "undefined" ? 0 : steps;

        this.knobValue = typeof knobValue == "undefined" ? this.range.x : knobValue;

        this.knobRadius = typeof knobRadius == "undefined" ? window.innerWidth / 46.0 : knobRadius;
        
        this.knobTransform = new Transform(
            vec2(this.transform.position.x + (this.transform.scale.x/2),
            this.transform.position.y + (this.knobRadius * 2)),
            vec2(this.knobRadius * 2, this.knobRadius * 2));

        this.knobColor = typeof knobColor == "undefined" ? uiContext.fgPrimaryColor : knobColor;
        this.defKnobColor = this.knobColor;

        this.bgLineThickness = typeof bgLineThickness == "undefined" ? 2 : bgLineThickness;
        this.bgLineColor = typeof bgLineColor == "undefined" ? uiContext.bgSecondaryColor : bgLineColor;

        this.selectKnobColor = typeof selectKnobColor == "undefined" ? uiContext.fgSecondaryColor : selectKnobColor;
        this.disabledKnobColor = typeof disabledKnobColor == "undefined" ? uiContext.fgPrimaryColor + "80" : disabledKnobColor;

        this.startKnobValueSet = 10;
        
        this.event = function()
        {
            if(this.enabled)
            {
                var knobStartPos = vec2(this.transform.position.x + (this.transform.scale.x/2),
                this.transform.position.y + (this.knobRadius * 2));
                var knobEndPos = knobStartPos.add(vec2(this.transform.scale.x/2, this.bgLineThickness));

                if(this.startKnobValueSet > 0)
                {
                    this.updatePositionFromKnobValue(knobStartPos.x, knobEndPos.x);
                    this.startKnobValueSet--;
                }

                this.touchId = touched(this.knobTransform);
                
                dragMove(this.knobTransform, 1, knobStartPos, knobEndPos);
                this.knobTransform.position.y = knobStartPos.y;
                
                this.updateKnobValueFromPosition(knobStartPos.x, knobEndPos.x);

                this.label.transform.position = this.transform.position;
                this.label.transform.scale = vec2(this.transform.scale.x/2, this.transform.scale.y);

                if(steps > 0)
                {
                    this.knobValue = round(this.knobValue, ((this.range.y - this.range.x) / steps), this.range.x);
                }
                
                if (this.touchId != -1)
                {
                    this.knobColor = this.selectKnobColor;

                    this.output = UIOUTPUT_SELECT;
                }
                else if (this.output == UIOUTPUT_DISABLED)
                {
                    this.knobColor = this.disabledKnobColor;
                }
                else
                {
                    this.knobColor = this.defKnobColor;
                    this.output = UIOUTPUT_RUNNING;
                }
            }
        };
    }

    updatePositionFromKnobValue(st, end)
    {
        var totalLength = end - st;
        var ratio = (this.knobValue - this.range.x) / this.range.y;

        var knobLength = totalLength * ratio;

        this.knobTransform.position.x = st + knobLength;
    }

    updateKnobValueFromPosition(st, end)
    {
        var totalLength = end - st;
        var knobLength = this.knobTransform.position.x - st;

        var ratio = knobLength / totalLength;

        this.knobValue = this.range.x + (ratio * this.range.y);
    }

    resetOutput()
    {
        this.knobColor = this.defKnobColor;
        this.output = UIOUTPUT_RUNNING;
    }

    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                this.label.draw();

                drawRect(uiContext.renderer, vec2(this.transform.position.x + (this.transform.scale.x/2),
                    this.transform.position.y + (this.transform.scale.y/2)),
                    vec2(this.transform.scale.x/2, this.bgLineThickness), true,
                    this.bgLineColor, uiContext.roundness);

                uiContext.renderer.fillStyle = this.defKnobColor;
                /*
                this.knobTransform.position = vec2(this.transform.position.x - this.knobRadius +
                    ((this.knobValue / (this.range.y - this.range.x)) * this.transform.scale.x),
                    this.transform.position.y);
                    */
                //this.knobTransform.position = vec2(this.transform.position.x, this.transform.position.y);
                
                drawCircle(uiContext.renderer,
                    this.knobTransform.position.add(vec2(this.knobRadius, this.knobRadius)),
                    this.knobRadius, true, this.knobColor);
            }
        }
    }
}
 // *** WORK IN PROGRESS ***
class CircularPad extends UIObject
{
    constructor(transform, controlRadius, padRadius, controlColor, padColor, limitArea)
    {
        super(transform);
        this.controlPosition = transform.position;

        this.controlRadius = typeof controlRadius == "undefined" ? window.innerWidth / 32.0 : controlRadius;
        this.padRadius = typeof padRadius == "undefined" ? this.controlRadius * 2.6 : padRadius;
        
        this.controlColor = typeof controlColor == "undefined" ? uiContext.fgPrimaryColor : controlColor;
        this.padColor = typeof padColor == "undefined" ? uiContext.bgSecondaryColor : padColor;

        this.limitArea = typeof limitArea == "undefined" ? vec2(0, 0) : limitArea;

        this.event = function()
        {
            if(this.enabled)
            {
                //drag move control position
                //set ui input field relative to its position with transform
                //if no touch, lerp control position back to transform
            }
        };
    }
    
    draw()
    {
        if(this.enabled)
        {
            if(this.visible)
            {
                if(this.limitArea.x == 0.0
                && this.limitArea.y == 0.0)
                {
                    drawCircle(uiContext.renderer, this.transform.position, this.padRadius, true, this.padColor);
                    drawCircle(uiContext.renderer, this.controlPosition, this.controlRadius, true, this.controlColor);
                }
                else
                {
                    //if touched within limit area,
                    //draw the pad there

                    //dont draw if no touch
                }
            }
        }
    }
}


