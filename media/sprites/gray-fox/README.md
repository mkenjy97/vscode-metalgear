# gray-fox — sprite frames

Ogni PNG corrisponde a un frame singolo ritagliato dallo spritesheet.
Per l'engine serve una GIF animata; se il personaggio ha un solo frame
per animazione basta convertire 1:1.

## Naming convention GIF (engine)

    cyborg_{animation}_8fps.gif

Dove {animation} è uno di: idle, walk, walk_fast, run, swipe, with_ball

## Come convertire con ImageMagick

    convert -delay 12 -loop 0 cyborg__idle.png cyborg_idle_8fps.gif

## Come convertire con ffmpeg

    ffmpeg -framerate 8 -i cyborg__idle.png cyborg_idle_8fps.gif
