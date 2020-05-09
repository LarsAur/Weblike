# Weblike

Weblike is a rougelike game you can play in the browser. The game can be played from [here](https://weblike.web.app)

![Cover_image]

[cover_image]: /cover_image.PNG

## The project

The project is made purely in JavaScript with no other dependencies. 

### Architecture

The game is created using a gamestate manager responsible for changing states and calling the gameloop in the active gamestate. Each state has access to the renderer, input handler and the gamestate manager.

### Input Manager

The input manager has functins to check for buttons presses or buttons held down. The input manager is updated after each gametick to check is keys are pressed or held down.
(A key is *pressed* the first tick it is down, and the key is *down* from it is pressed to  it is released )

### Renderer

The redering is done using a 300x300px 2d canvas context. The canvas is scaled to best fit the browser using css. The canvas only scales to be pixel perfect (e.g 300px, 600px, 900px)

## Graphics

The graphics are in a 1-bit style, using the colors:
* Dark: ```#120019```
* Light: ```#FFFFE3```

## Credits
Creator: *Lars Murud Aurud*

Using the code from the user *orip* on Stack Overflow ( [Link to thread](https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator) ) to create the RNG module
