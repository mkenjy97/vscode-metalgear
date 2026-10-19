# VS Code Metal Gear 🐍

Metal Gear Solid operatives for your VS Code — ispirato a [vscode-pets](https://github.com/tonybaloney/vscode-pets).

Fai muovere i tuoi personaggi preferiti di MGS nel tuo editor mentre codifichi. Snake attraverserà il tuo schermo con furtività tattica. Raiden salterà le pareti. La Cardboard Box si aggirerà lentamente.

## Operativi disponibili

| Operativo | Emoji | Velocità | Varianti |
|-----------|-------|----------|----------|
| Solid Snake | 🐍 | Normale | Sneaking Suit, Bandana, Tuxedo, FOXHOUND, VR Mission |
| Cardboard Box | 📦 | Lentissima | Normal, Snow Camo, Desert Camo |
| Genome Soldier | 🪖 | Veloce | Normal, FOXHOUND, Snow |
| Gray Fox | 🥷 | Velocissima | Cyborg, Ninja |
| Raiden | ⚡ | Veloce | Normal, White Suit, Cyborg |
| Metal Gear REX | 🤖 | Fermo | Normal |

## Location (Temi)

| Location | Effetto |
|----------|---------|
| None | — |
| Shadow Moses | ❄️ Neve |
| Mother Base | 🌧️ Pioggia |
| Big Shell | 🌧️ Pioggia |
| Outer Heaven | — |

## Comandi

Tutti i comandi sono disponibili dalla Command Palette (`Cmd+Shift+P`):

| Comando | Descrizione |
|---------|-------------|
| `Metal Gear: Start Mission` | Apri il pannello |
| `Metal Gear: Deploy Operative` | Aggiungi un operativo |
| `Metal Gear: Throw Ration` | Lancia una razione C — gli operativi la inseguono |
| `Metal Gear: Extract Operative` | Rimuovi un operativo |
| `Metal Gear: Abort Mission` | Rimuovi tutti gli operativi |
| `Metal Gear: Codec Call` | Chiama via CODEC (roll call) |
| `Metal Gear: Change Location` | Cambia il tema/location |

## Impostazioni

```json
{
  "vscode-metalgear.operativeType": "solid-snake",
  "vscode-metalgear.operativeColor": "sneaking-suit",
  "vscode-metalgear.operativeSize": "nano",
  "vscode-metalgear.theme": "none",
  "vscode-metalgear.position": "explorer",
  "vscode-metalgear.throwRationWithMouse": false,
  "vscode-metalgear.disableEffects": false
}
```

## Asset (GIF Sprite)

> ⚠️ **Le GIF incluse sono placeholder.** Per un'esperienza completa, sostituiscile con sprite pixel art definitivi.
>
> Ogni operativo richiede le seguenti GIF in `media/{operative-type}/{color}_{animation}_8fps.gif`:
> - `idle` — fermo
> - `walk` — cammina
> - `walk_fast` — cammina veloce / arrampicata parete
> - `run` — corre
> - `swipe` — colpo / reazione
> - `with_ball` — tiene la razione

Risorse sprite pixel art consigliate: [The Spriters Resource](https://www.spriters-resource.com/playstation/mgs/).

## Build

```bash
npm install
npm run compile
```

## Struttura

```
src/
├── common/          # Tipi, nomi, config condivisi
├── extension/       # Extension host (VS Code API)
└── panel/           # Webview panel (browser)
    ├── pets/        # Classi operative
    ├── effects/     # Effetti meteo (neve, pioggia)
    └── ...
media/
├── backgrounds/     # Sfondi per ogni location
└── {operative}/     # GIF sprite per ogni operativo
```

---

*Kept you waiting, huh?*
