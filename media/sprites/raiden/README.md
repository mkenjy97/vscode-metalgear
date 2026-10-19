# raiden — sprite frames

Ogni PNG corrisponde a un frame singolo ritagliato dallo spritesheet.
Per l'engine serve una GIF animata; se il personaggio ha un solo frame
per animazione basta convertire 1:1.

## Naming convention GIF (engine)

    normal_{animation}_8fps.gif

Dove {animation} è uno di: idle, walk, walk_fast, run, swipe, with_ball

## Come convertire con ImageMagick

    convert -delay 12 -loop 0 normal__idle.png normal_idle_8fps.gif

## Come convertire con ffmpeg

    ffmpeg -framerate 8 -i normal__idle.png normal_idle_8fps.gif
