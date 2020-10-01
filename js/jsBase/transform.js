//Screen = (left) 0 to (right) WIDTH, (top) 0 to (bottom) HEIGHT
//Viewport = (left) 0 to (right) 1, (top) 0 to (bottom) 1
//World = (left) -WORLD_WIDTH to (right) WORLD_WIDTH, (top) -WORLD_HEIGHT to (right) WORLD_HEIGHT

const WORLD_WIDTH = 16;
const WORLD_HEIGHT = 9;

function screenToViewport(vec2)
{
    return new Vector2( vec2.x / window.innerWidth, vec2.y / window.innerHeight );
}

function screenToWorld(vec2)
{
    return viewportToWorld(screenToViewport(vec2));
}

function viewportToScreen(vec2)
{
    return new Vector2( vec2.x * window.innerWidth, vec2.y * window.innerHeight );
}

function viewportToWorld(vec2)
{
    return new Vector2( ((vec2.x - 0.5) * 2) * WORLD_WIDTH,
        ((vec2.y - 0.5) * 2) * WORLD_HEIGHT );
}

function worldToScreen(vec2)
{
    return viewportToScreen(worldToViewport(vec2));
}

function worldToViewport(vec2)
{
    return new Vector2( ((vec2.x / WORLD_WIDTH) / 2) + 0.5,
    ((vec2.y / WORLD_HEIGHT) / 2) + 0.5 );
}

//Default Anchor: TOP LEFT or (0, 0)
//X is zero at LEFT
//Y is zero at TOP

//requires Vector2
class Transform
{
    constructor(position, scale, rotation, origin)
    {
        this.position = typeof position == "undefined" ? new Vector2(0.0, 0.0) : position;
        this.scale = typeof scale == "undefined" ? new Vector2(1.0, 1.0) : scale;
        this.rotation = typeof rotation == "undefined" ? 0.0 : rotation;
        this.origin = typeof origin == "undefined" ? new Vector2(0.0, 0.0) : origin;
    }

    relPointInside(vec2)
    {
        var pos = this.position;
        var scale = this.scale;

        if(vec2.x >= pos.x
        && vec2.y >= pos.y
        && vec2.x < pos.x + scale.x
        && vec2.y < pos.y + scale.y)
        {
            return new Vector2(vec2.x - pos.x, vec2.y - pos.y);
        }

        return new Vector2(-1, -1);
    }
}

function tr(pos, sc, rot, orig) { return new Transform(pos, sc, rot, orig); }
