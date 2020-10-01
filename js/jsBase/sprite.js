
totalImagesToLoad = 0;
imagesLoadingLeft = 0;
class ImageObject
{
    constructor(imageSrc, size, img)
    {
        if(typeof img == "undefined") this.image = document.createElement("img");
        else this.image = img;

        imagesLoadingLeft++;

        if(imagesLoadingLeft > totalImagesToLoad)
            totalImagesToLoad = imagesLoadingLeft;
        
        if(typeof img == "undefined")
        {
            this.image.onload = function()
            {
                this.loaded = true;
                imagesLoadingLeft--;
            };
        }
        
        if(typeof img == "undefined")
        {
            this.image.src = imageSrc;
            this.size = size;
        }
    }

    setSize(size)
    {
        this.size = size;
        this.image.width = size.x;
        this.image.height = size.y;
    }

    compareSrc(imageSrc)
    {
        return (this.image.src === imageSrc);
    }

    static areAllLoaded()
    {
        return (imagesLoadingLeft <= 0);
    }
}

//requires Transform and ImageObject
sprites = [];
spritesRenderer = null;
class Sprite
{
    constructor(transform, imageObject)
    {
        this.transform = transform;
        this.imageObject = imageObject;
        sprites.push(this);

        this.event = function() {};
    }

    destroy()
    {
        for (let i = 0; i < sprites.length; i++)
        {
            if (sprites[i] == this)
            {
                sprites.splice(i, 1);
                break;
            }
        }
    }

    getTransformWithSize()
    {
        return new Transform(this.transform.position,
            this.transform.scale.multiply(new Vector2(this.imageObject.image.width, this.imageObject.image.height)),
            this.transform.rotation,
            this.transform.origin,
            this.transform.anchor);
    }
    
    getEvent()
    {
        return this.event;
    }
    
    setEvent(func)
    {
        this.event = func;
    }

    relPointInside(vec2)
    {
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        if (vec2.x >= pos.x - ((img.width * scale.x) / 2) &&
            vec2.y >= pos.y - ((img.height * scale.y) / 2) &&
            vec2.x < pos.x + ((img.width * scale.x) / 2) &&
            vec2.y < pos.y + ((img.height * scale.y) / 2))
        {
            return new Vector2(vec2.x - pos.x, vec2.y - pos.y);
        }

        return new Vector2(-1, -1);
    }

    draw()
    {
        if (this.imageObject === undefined)
            return;

        var img = this.imageObject.image;
        var pos = this.transform.position;

        spritesRenderer.drawImage(img,
            pos.x - (img.width / 2), pos.y - (img.height / 2),
            img.width, img.height);
    }

    drawSc()
    {
        if (this.imageObject === undefined)
            return;

        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        spritesRenderer.drawImage(img,
            pos.x - ((img.width * scale.x) / 2), pos.y - ((img.height * scale.y) / 2),
            img.width * scale.x, img.height * scale.y);
    }

    drawScIn(inPos, inSize)
    {
        if (this.imageObject === undefined)
            return;

        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;

        spritesRenderer.drawImage(img,
            inPos.x, inPos.y, inSize.x, inSize.y,
            pos.x - ((inSize.x * scale.x) / 2), pos.y - ((inSize.y * scale.y) / 2),
            inSize.x * scale.x, inSize.y * scale.y);
    }

    drawRot()
    {
        if (this.imageObject === undefined)
            return;

        var img = this.imageObject.image;
        var pos = this.transform.position;
        var ori = this.transform.origin;

        spritesRenderer.save();

        spritesRenderer.translate(pos.x + ori.x, pos.y + ori.y);
        spritesRenderer.rotate(this.transform.rotation + (Math.PI / 2));
        spritesRenderer.translate(-pos.x - ori.x, -pos.y - ori.y);

        spritesRenderer.drawImage(img,
            pos.x - (img.width / 2), pos.y - (img.height / 2),
            img.width, img.height);

        spritesRenderer.restore();
    }

    drawScRot()
    {
        if (this.imageObject === undefined)
            return;
        
        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;
        var ori = this.transform.origin;

        spritesRenderer.save();

        spritesRenderer.translate(pos.x + ori.x, pos.y + ori.y);
        spritesRenderer.rotate(this.transform.rotation + (Math.PI / 2));
        spritesRenderer.translate(-pos.x - ori.x, -pos.y - ori.y);

        spritesRenderer.drawImage(img,
            pos.x - ((img.width * scale.x) / 2), pos.y - ((img.height * scale.y) / 2),
            img.width * scale.x, img.height * scale.y);

        spritesRenderer.restore();
    }

    drawScRotIn(inPos, inSize)
    {
        if (this.imageObject === undefined)
            return;

        var img = this.imageObject.image;
        var pos = this.transform.position;
        var scale = this.transform.scale;
        var ori = this.transform.origin;

        spritesRenderer.save();

        spritesRenderer.translate(pos.x + ori.x, pos.y + ori.y);
        spritesRenderer.rotate(this.transform.rotation + (Math.PI / 2));
        spritesRenderer.translate(-pos.x - ori.x, -pos.y - ori.y);
        
        spritesRenderer.drawImage(img,
            inPos.x, inPos.y, inSize.x, inSize.y,
            pos.x - ((inSize.x * scale.x) / 2), pos.y - ((inSize.y * scale.y) / 2),
            inSize.x * scale.x, inSize.y * scale.y);

        spritesRenderer.restore();
    }
}

function drawSprites(index, noOfSprites, scaled, rotated)
{
    index = typeof index == "undefined" ? 0 : index;
    noOfSprites = typeof noOfSprites == "undefined" ? sprites.length : noOfSprites;

    if (scaled && rotated)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawScRot();
        }
    }
    else if (scaled)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawSc();
        }
    }
    else if (rotated)
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].drawRot();
        }
    }
    else
    {
        for (let i = index; i < index + noOfSprites; i++)
        {
            sprites[i].draw();
        }
    }
}

function eventSprites(index, noOfSprites)
{
    index = typeof index == "undefined" ? 0 : index;
    noOfSprites = typeof noOfSprites == "undefined" ? sprites.length : noOfSprites;

    for (let i = index; i < index + noOfSprites; i++)
    {
        sprites[i].event();
    }
}