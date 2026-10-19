/**
 * Metal Gear Solid — VS Code Extension
 * Webview panel script (runs inside the webview)
 */
import { randomName } from '../common/names';
import {
    OperativeSize,
    OperativeColor,
    OperativeType,
    Theme,
    ColorThemeKind,
    WebviewMessage,
} from '../common/types';
import { IPetType } from './states';
import {
    createOperative,
    OperativeCollection,
    OperativeElement,
    availableColors,
    InvalidOperativeException,
} from './pets';
import { PetElementState, PetPanelState } from './states';
import { THEMES } from './themes';
import {
    dynamicThrowOff,
    dynamicThrowOn,
    setupBallThrowing,
    throwAndChase,
} from './ball';

const FOREGROUND_EFFECT_CANVAS_ID = 'foregroundEffectCanvas';
const BACKGROUND_EFFECT_CANVAS_ID = 'backgroundEffectCanvas';
const RATION_CANVAS_ID = 'ballCanvas';

declare global {
    interface VscodeStateApi {
        getState(): PetPanelState | undefined;
        setState(state: PetPanelState): void;
        postMessage(message: WebviewMessage): void;
    }
    function acquireVsCodeApi(): VscodeStateApi;
}

export var allPets: OperativeCollection = new OperativeCollection();
var petCounter: number;

function handleMouseOver(e: MouseEvent) {
    const el = e.currentTarget as HTMLDivElement;
    allPets.pets.forEach((element) => {
        if (element.collision === el && element.operative.canSwipe) {
            element.operative.swipe();
        }
    });
}

function startAnimations(
    collision: HTMLDivElement,
    _operative: IPetType,
    _stateApi?: VscodeStateApi,
) {
    collision.addEventListener('mouseover', handleMouseOver);
}

function addOperativeToPanel(
    operativeType: OperativeType,
    basePetUri: string,
    operativeColor: OperativeColor,
    operativeSize: OperativeSize,
    left: number,
    bottom: number,
    floor: number,
    name: string,
    stateApi?: VscodeStateApi,
): OperativeElement {
    const spriteElement: HTMLImageElement = document.createElement('img');
    spriteElement.className = 'pet';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(spriteElement);

    const collisionElement: HTMLDivElement = document.createElement('div');
    collisionElement.className = 'collision';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(collisionElement);

    const speechBubbleElement: HTMLDivElement = document.createElement('div');
    speechBubbleElement.className = `bubble bubble-${operativeSize}`;
    speechBubbleElement.innerText = '!';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(speechBubbleElement);

    const root = basePetUri + '/' + operativeType + '/' + operativeColor;
    console.log('Deploying operative:', operativeType, root, operativeColor, operativeSize, name);

    try {
        if (!availableColors(operativeType).includes(operativeColor)) {
            throw new InvalidOperativeException('Invalid color for operative type');
        }
        const newOperative = createOperative(
            operativeType,
            spriteElement,
            collisionElement,
            speechBubbleElement,
            operativeSize,
            left,
            bottom,
            root,
            floor,
            name,
        );
        petCounter++;
        startAnimations(collisionElement, newOperative, stateApi);

        return new OperativeElement(
            spriteElement,
            collisionElement,
            speechBubbleElement,
            newOperative,
            operativeColor,
            operativeType,
        );
    } catch (e: any) {
        spriteElement.remove();
        collisionElement.remove();
        speechBubbleElement.remove();
        throw e;
    }
}

export function saveState(stateApi?: VscodeStateApi) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    const state = new Object() as PetPanelState;
    state.petStates = new Array();

    allPets.pets.forEach((opItem) => {
        state.petStates?.push({
            petName: opItem.operative.name,
            petColor: opItem.color,
            petType: opItem.type,
            petState: opItem.operative.getState(),
            petFriend: opItem.operative.friend?.name ?? undefined,
            elLeft: opItem.el.style.left,
            elBottom: opItem.el.style.bottom,
        });
    });
    state.petCounter = petCounter;
    stateApi?.setState(state);
}

function recoverState(
    basePetUri: string,
    opSize: OperativeSize,
    floor: number,
    stateApi?: VscodeStateApi,
) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    const state = stateApi?.getState();
    if (!state) {
        petCounter = 1;
    } else {
        petCounter = (state.petCounter === undefined || isNaN(state.petCounter))
            ? 1
            : state.petCounter ?? 1;
    }

    const recoveryMap: Map<IPetType, PetElementState> = new Map();
    state?.petStates?.forEach((p) => {
        try {
            const newOp = addOperativeToPanel(
                p.petType as OperativeType ?? OperativeType.solidSnake,
                basePetUri,
                p.petColor as OperativeColor ?? OperativeColor.sneakingSuit,
                opSize,
                parseInt(p.elLeft ?? '0'),
                parseInt(p.elBottom ?? '0'),
                floor,
                p.petName ?? randomName(p.petType as OperativeType ?? OperativeType.solidSnake),
                stateApi,
            );
            allPets.push(newOp);
            recoveryMap.set(newOp.operative, p);
        } catch (e) {
            console.log('State had invalid operative (' + p.petType + '), discarding.');
        }
    });

    recoveryMap.forEach((state, operative) => {
        if (state.petState !== undefined) {
            operative.recoverState(state.petState);
        }
        if (state.petFriend) {
            const friend = allPets.locate(state.petFriend);
            if (friend) {
                operative.recoverFriend(friend.operative);
            }
        }
    });
}

function randomStartPosition(): number {
    return Math.floor(Math.random() * (window.innerWidth * 0.7));
}

function initCanvas(name: string): HTMLCanvasElement | null {
    const canvas = document.getElementById(name) as HTMLCanvasElement;
    if (!canvas) {
        return null;
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) {
        return null;
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    return canvas;
}

export function petPanelApp(
    basePetUri: string,
    theme: Theme,
    themeKind: ColorThemeKind,
    operativeColor: OperativeColor,
    operativeSize: OperativeSize,
    operativeType: OperativeType,
    throwRationWithMouse: boolean,
    disableEffects: boolean,
    stateApi?: VscodeStateApi,
) {
    if (!stateApi) {
        stateApi = acquireVsCodeApi();
    }
    const themeInfo = THEMES[theme];

    // Apply theme backgrounds
    const foregroundEl = document.getElementById('foreground');
    const backgroundEl = document.getElementById('background');
    if (backgroundEl) {
        backgroundEl.style.backgroundImage = themeInfo.backgroundImageUrl(
            basePetUri, themeKind, operativeSize,
        );
    }
    if (foregroundEl) {
        foregroundEl.style.backgroundImage = themeInfo.foregroundImageUrl(
            basePetUri, themeKind, operativeSize,
        );
    }

    const floor = themeInfo.floor(operativeSize);
    console.log('Starting Metal Gear session', operativeColor, basePetUri, operativeType, theme);

    const state = stateApi?.getState();
    if (!state) {
        petCounter = 1;
        allPets.push(
            addOperativeToPanel(
                operativeType,
                basePetUri,
                operativeColor,
                operativeSize,
                randomStartPosition(),
                floor,
                floor,
                randomName(operativeType),
                stateApi,
            ),
        );
        saveState(stateApi);
    } else {
        console.log('Recovering state —', state);
        recoverState(basePetUri, operativeSize, floor, stateApi);
    }

    initCanvas(RATION_CANVAS_ID);
    setupBallThrowing(RATION_CANVAS_ID, operativeSize, floor);

    if (throwRationWithMouse) {
        dynamicThrowOn(allPets.pets);
    } else {
        dynamicThrowOff();
    }

    // Initialize effects
    if (themeInfo.effect) {
        const foregroundEffectCanvas = initCanvas(FOREGROUND_EFFECT_CANVAS_ID);
        const backgroundEffectCanvas = initCanvas(BACKGROUND_EFFECT_CANVAS_ID);
        if (foregroundEffectCanvas && backgroundEffectCanvas) {
            themeInfo.effect.init(
                foregroundEffectCanvas,
                backgroundEffectCanvas,
                operativeSize,
                floor,
                themeKind,
            );
            if (!disableEffects) {
                themeInfo.effect.enable();
            }
        }
    }

    let windowLoaded = false;
    const onTick = () => {
        if (windowLoaded) {
            allPets.seekNewFriends();
            allPets.pets.forEach((opItem) => {
                opItem.operative.nextFrame();
            });
            saveState(stateApi);
        }
    };

    window.addEventListener('load', () => {
        windowLoaded = true;
    });

    window.addEventListener('message', (event): void => {
        const message = event.data;
        switch (message.command) {
            case 'throw-with-mouse':
                if (message.enabled) {
                    dynamicThrowOn(allPets.pets);
                } else {
                    dynamicThrowOff();
                }
                break;
            case 'throw-ball':
                throwAndChase(allPets.pets);
                break;
            case 'spawn-pet':
                allPets.push(
                    addOperativeToPanel(
                        message.type,
                        basePetUri,
                        message.color,
                        operativeSize,
                        randomStartPosition(),
                        floor,
                        floor,
                        message.name ?? randomName(message.type),
                        stateApi,
                    ),
                );
                saveState(stateApi);
                break;
            case 'list-pets':
                stateApi?.postMessage({
                    command: 'list-pets',
                    text: allPets.pets
                        .map((op) => `${op.type},${op.operative.name},${op.color}`)
                        .join('\n'),
                });
                break;
            case 'roll-call':
                allPets.pets.forEach((op) => {
                    stateApi?.postMessage({
                        command: 'info',
                        text: `${op.operative.emoji} ${op.operative.name} (${op.color} ${op.type}): ${op.operative.hello}`,
                    });
                });
                break;
            case 'delete-pet':
                const pet = allPets.locateOperative(message.name, message.type, message.color);
                if (pet) {
                    allPets.remove(pet);
                    saveState(stateApi);
                    stateApi?.postMessage({
                        command: 'info',
                        text: `👋 Operative extracted: ${message.name}`,
                    });
                } else {
                    stateApi?.postMessage({
                        command: 'error',
                        text: `Could not locate operative ${message.name}`,
                    });
                }
                break;
            case 'reset-pet':
                allPets.reset();
                petCounter = 0;
                saveState(stateApi);
                break;
            case 'disable-effects':
                if (themeInfo.effect && message.disabled) {
                    themeInfo.effect.disable();
                } else if (themeInfo.effect && !message.disabled) {
                    themeInfo.effect.enable();
                }
                break;
            case 'tick':
                onTick();
                break;
        }
    });

    window.addEventListener('resize', () => {
        initCanvas(RATION_CANVAS_ID);
        initCanvas(FOREGROUND_EFFECT_CANVAS_ID);
        initCanvas(BACKGROUND_EFFECT_CANVAS_ID);
        if (themeInfo.effect) {
            themeInfo.effect.handleResize();
        }
    });
}
