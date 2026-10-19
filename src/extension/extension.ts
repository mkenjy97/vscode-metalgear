import * as vscode from 'vscode';
import { ColorThemeKind } from 'vscode';
import {
    OperativeSize,
    OperativeColor,
    OperativeType,
    ExtPosition,
    Theme,
    WebviewMessage,
    ALL_COLORS,
    ALL_OPERATIVES,
    ALL_SCALES,
    ALL_THEMES,
} from '../common/types';
import { randomName } from '../common/names';
import { availableColors, normalizeColor } from '../common/operative-config';

// ── Constants ─────────────────────────────────────────────────────────────────
const EXTRA_OPS_KEY = 'vscode-metalgear.extra-operatives';
const EXTRA_OPS_KEY_TYPES = EXTRA_OPS_KEY + '.types';
const EXTRA_OPS_KEY_COLORS = EXTRA_OPS_KEY + '.colors';
const EXTRA_OPS_KEY_NAMES = EXTRA_OPS_KEY + '.names';
const DEFAULT_OP_SCALE = OperativeSize.nano;
const DEFAULT_COLOR = OperativeColor.sneakingSuit;
const DEFAULT_OP_TYPE = OperativeType.solidSnake;
const DEFAULT_POSITION = ExtPosition.panel;
const DEFAULT_THEME = Theme.none;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatOperativeLabel(type: OperativeType): string {
    const labels: Record<string, string> = {
        'solid-snake': '🐍 Solid Snake',
        'cardboard-box': '📦 Cardboard Box',
        'genome-soldier': '🪖 Genome Soldier',
        'gray-fox': '🥷 Gray Fox',
        'raiden': '⚡ Raiden',
        'metal-gear-rex': '🤖 Metal Gear REX',
    };
    return labels[type] ?? type;
}

function formatColorLabel(color: OperativeColor): string {
    const labels: Record<string, string> = {
        'sneaking-suit': 'Sneaking Suit',
        'bandana': 'Bandana',
        'tuxedo': 'Tuxedo',
        'foxhound': 'FOXHOUND',
        'vr-mission': 'VR Mission',
        'snow': 'Snow Camo',
        'desert': 'Desert Camo',
        'normal': 'Normal',
        'cyborg': 'Cyborg',
        'ninja': 'Ninja',
        'white-suit': 'White Suit',
    };
    return labels[color] ?? color;
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions & vscode.WebviewPanelOptions {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
    };
}

// ── Config helpers ─────────────────────────────────────────────────────────────
function getConfiguredSize(): OperativeSize {
    let size = vscode.workspace.getConfiguration('vscode-metalgear').get<OperativeSize>('operativeSize', DEFAULT_OP_SCALE);
    if (ALL_SCALES.lastIndexOf(size) === -1) { size = DEFAULT_OP_SCALE; }
    return size;
}
function getConfiguredTheme(): Theme {
    let theme = vscode.workspace.getConfiguration('vscode-metalgear').get<Theme>('theme', DEFAULT_THEME);
    if (ALL_THEMES.lastIndexOf(theme) === -1) { theme = DEFAULT_THEME; }
    return theme;
}
function getConfiguredThemeKind(): ColorThemeKind { return vscode.window.activeColorTheme.kind; }
function getConfigurationPosition(): ExtPosition {
    return vscode.workspace.getConfiguration('vscode-metalgear').get<ExtPosition>('position', DEFAULT_POSITION);
}
function getThrowRationWithMouseConfiguration(): boolean {
    return vscode.workspace.getConfiguration('vscode-metalgear').get<boolean>('throwRationWithMouse', false);
}
function getEffectsDisabledConfiguration(): boolean {
    return vscode.workspace.getConfiguration('vscode-metalgear').get<boolean>('disableEffects', false);
}

// ── OperativeSpecification ────────────────────────────────────────────────────
export class OperativeSpecification {
    color: OperativeColor;
    type: OperativeType;
    size: OperativeSize;
    name: string;

    constructor(color: OperativeColor, type: OperativeType, size: OperativeSize, name?: string) {
        this.color = color;
        this.type = type;
        this.size = size;
        this.name = name ?? randomName(type);
    }

    static fromConfiguration(): OperativeSpecification {
        let color = vscode.workspace.getConfiguration('vscode-metalgear').get<OperativeColor>('operativeColor', DEFAULT_COLOR);
        if (ALL_COLORS.lastIndexOf(color) === -1) { color = DEFAULT_COLOR; }
        let type = vscode.workspace.getConfiguration('vscode-metalgear').get<OperativeType>('operativeType', DEFAULT_OP_TYPE);
        if (ALL_OPERATIVES.lastIndexOf(type) === -1) { type = DEFAULT_OP_TYPE; }
        return new OperativeSpecification(color, type, getConfiguredSize());
    }

    static collectionFromMemento(context: vscode.ExtensionContext, size: OperativeSize): OperativeSpecification[] {
        const types = context.globalState.get<OperativeType[]>(EXTRA_OPS_KEY_TYPES, []);
        const colors = context.globalState.get<OperativeColor[]>(EXTRA_OPS_KEY_COLORS, []);
        const names = context.globalState.get<string[]>(EXTRA_OPS_KEY_NAMES, []);
        const result: OperativeSpecification[] = [];
        for (let i = 0; i < types.length; i++) {
            result.push(new OperativeSpecification(colors?.[i] ?? DEFAULT_COLOR, types[i], size, names[i]));
        }
        return result;
    }
}

export async function storeCollectionAsMemento(context: vscode.ExtensionContext, collection: OperativeSpecification[]) {
    await context.globalState.update(EXTRA_OPS_KEY_TYPES, collection.map((op) => op.type));
    await context.globalState.update(EXTRA_OPS_KEY_COLORS, collection.map((op) => op.color));
    await context.globalState.update(EXTRA_OPS_KEY_NAMES, collection.map((op) => op.name));
    context.globalState.setKeysForSync([EXTRA_OPS_KEY_TYPES, EXTRA_OPS_KEY_COLORS, EXTRA_OPS_KEY_NAMES]);
}

// ── IMgsPanel interface ────────────────────────────────────────────────────────
interface IMgsPanel {
    throwBall(): void;
    resetPets(): void;
    spawnPet(spec: OperativeSpecification): void;
    deletePet(name: string, type: string, color: string): void;
    listPets(): void;
    rollCall(): void;
    themeKind(): vscode.ColorThemeKind;
    throwBallWithMouse(): boolean;
    updatePetColor(newColor: OperativeColor): void;
    updatePetType(newType: OperativeType): void;
    updatePetSize(newSize: OperativeSize): void;
    updateTheme(newTheme: Theme, themeKind: vscode.ColorThemeKind): void;
    update(): void;
    setThrowWithMouse(value: boolean): void;
    updateDisableEffects(value: boolean): void;
    tick(): void;
    dispose(): void;
    getWebview(): vscode.Webview;
}

// ── MgsWebviewContainer (base) ────────────────────────────────────────────────
class MgsWebviewContainer implements IMgsPanel {
    protected _extensionUri: vscode.Uri;
    protected _disposables: vscode.Disposable[] = [];
    protected _petColor: OperativeColor;
    protected _petType: OperativeType;
    protected _petSize: OperativeSize;
    protected _theme: Theme;
    protected _themeKind: vscode.ColorThemeKind;
    protected _throwBallWithMouse: boolean;
    protected _disableEffects: boolean;
    protected _tickIntervalId: NodeJS.Timeout | number | undefined;

    constructor(
        extensionUri: vscode.Uri,
        color: OperativeColor,
        type: OperativeType,
        size: OperativeSize,
        theme: Theme,
        themeKind: ColorThemeKind,
        throwBallWithMouse: boolean,
        disableEffects: boolean,
    ) {
        this._extensionUri = extensionUri;
        this._petColor = color;
        this._petType = type;
        this._petSize = size;
        this._theme = theme;
        this._themeKind = themeKind;
        this._throwBallWithMouse = throwBallWithMouse;
        this._disableEffects = disableEffects;
        this._tickIntervalId = setInterval(() => { this.tick(); }, 100);
    }

    public petColor(): OperativeColor { return normalizeColor(this._petColor, this._petType); }
    public petType(): OperativeType { return this._petType; }
    public petSize(): OperativeSize { return this._petSize; }
    public theme(): Theme { return this._theme; }
    public themeKind(): vscode.ColorThemeKind { return this._themeKind; }
    public throwBallWithMouse(): boolean { return this._throwBallWithMouse; }
    public disableEffects(): boolean { return this._disableEffects; }
    public updatePetColor(newColor: OperativeColor) { this._petColor = newColor; }
    public updatePetType(newType: OperativeType) { this._petType = newType; }
    public updatePetSize(newSize: OperativeSize) { this._petSize = newSize; }
    public updateTheme(newTheme: Theme, themeKind: vscode.ColorThemeKind) {
        this._theme = newTheme;
        this._themeKind = themeKind;
    }
    public setThrowWithMouse(value: boolean): void {
        this._throwBallWithMouse = value;
        void this.getWebview().postMessage({ command: 'throw-with-mouse', enabled: value });
    }
    public updateDisableEffects(value: boolean): void {
        this._disableEffects = value;
        void this.getWebview().postMessage({ command: 'disable-effects', disabled: value });
    }
    public throwBall() { void this.getWebview().postMessage({ command: 'throw-ball' }); }
    public resetPets(): void { void this.getWebview().postMessage({ command: 'reset-pet' }); }
    public spawnPet(spec: OperativeSpecification) {
        void this.getWebview().postMessage({ command: 'spawn-pet', type: spec.type, color: spec.color, name: spec.name });
    }
    public listPets() { void this.getWebview().postMessage({ command: 'list-pets' }); }
    public rollCall(): void { void this.getWebview().postMessage({ command: 'roll-call' }); }
    public deletePet(name: string, type: string, color: string) {
        void this.getWebview().postMessage({ command: 'delete-pet', name, type, color });
    }

    protected _getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main-bundle.js'));
        const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'pets.css'));
        const basePetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media'));
        const nonce = getNonce();

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${stylesResetUri}" rel="stylesheet" nonce="${nonce}">
    <link href="${stylesMainUri}" rel="stylesheet" nonce="${nonce}">
    <title>VS Code Metal Gear</title>
</head>
<body>
    <div id="petCanvasContainer">
        <canvas id="ballCanvas"></canvas>
        <canvas id="foregroundEffectCanvas"></canvas>
        <canvas id="backgroundEffectCanvas"></canvas>
    </div>
    <div id="petsContainer"></div>
    <div id="foreground"></div>
    <div id="background"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
    <script nonce="${nonce}">petApp.petPanelApp("${basePetUri}", "${this.theme()}", ${this.themeKind()}, "${this.petColor()}", "${this.petSize()}", "${this.petType()}", ${this.throwBallWithMouse()}, ${this.disableEffects()});</script>
</body>
</html>`;
    }

    protected _update() {
        this.getWebview().html = this._getHtmlForWebview(this.getWebview());
    }

    public update() { this._update(); }

    public getWebview(): vscode.Webview {
        throw new Error('Not implemented');
    }

    public tick() {
        throw new Error('Not implemented');
    }

    public dispose() {
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) { x.dispose(); }
        }
        if (this._tickIntervalId) {
            clearInterval(this._tickIntervalId as number);
            this._tickIntervalId = undefined;
        }
    }
}

function handleWebviewMessage(message: WebviewMessage) {
    switch (message.command) {
        case 'alert':
            void vscode.window.showErrorMessage(message.text);
            return;
        case 'info':
            void vscode.window.showInformationMessage(message.text);
            return;
    }
}

// ── MgsPanel (standalone webview panel) ───────────────────────────────────────
class MgsPanel extends MgsWebviewContainer implements IMgsPanel {
    public static currentPanel: MgsPanel | undefined;
    public static readonly viewType = 'mgsOperatives';
    private readonly _panel: vscode.WebviewPanel;

    public static createOrShow(
        extensionUri: vscode.Uri,
        color: OperativeColor, type: OperativeType, size: OperativeSize,
        theme: Theme, themeKind: ColorThemeKind,
        throwWithMouse: boolean, disableEffects: boolean,
    ) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (MgsPanel.currentPanel) {
            if (color === MgsPanel.currentPanel.petColor() && type === MgsPanel.currentPanel.petType() && size === MgsPanel.currentPanel.petSize()) {
                MgsPanel.currentPanel._panel.reveal(column);
                return;
            } else {
                MgsPanel.currentPanel.updatePetColor(color);
                MgsPanel.currentPanel.updatePetType(type);
                MgsPanel.currentPanel.updatePetSize(size);
                MgsPanel.currentPanel.update();
            }
        }
        const panel = vscode.window.createWebviewPanel(
            MgsPanel.viewType,
            vscode.l10n.t('Metal Gear Operatives'),
            vscode.ViewColumn.Two,
            getWebviewOptions(extensionUri),
        );
        MgsPanel.currentPanel = new MgsPanel(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
    }

    public static revive(
        panel: vscode.WebviewPanel, extensionUri: vscode.Uri,
        color: OperativeColor, type: OperativeType, size: OperativeSize,
        theme: Theme, themeKind: ColorThemeKind,
        throwWithMouse: boolean, disableEffects: boolean,
    ) {
        MgsPanel.currentPanel = new MgsPanel(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
    }

    private constructor(
        panel: vscode.WebviewPanel, extensionUri: vscode.Uri,
        color: OperativeColor, type: OperativeType, size: OperativeSize,
        theme: Theme, themeKind: ColorThemeKind,
        throwWithMouse: boolean, disableEffects: boolean,
    ) {
        super(extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
        this._panel = panel;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(() => { this.update(); }, null, this._disposables);
        this._panel.webview.onDidReceiveMessage(handleWebviewMessage, null, this._disposables);
    }

    public tick() {
        if (this._panel.visible) {
            void this.getWebview().postMessage({ command: 'tick' });
        }
    }

    public dispose() {
        MgsPanel.currentPanel = undefined;
        this._panel.dispose();
        super.dispose();
    }

    public update() {
        if (this._panel.visible) { this._update(); }
    }

    public getWebview(): vscode.Webview { return this._panel.webview; }
}

// ── MgsWebviewViewProvider (Explorer sidebar) ──────────────────────────────────
class MgsWebviewViewProvider extends MgsWebviewContainer {
    public static readonly viewType = 'mgsView';
    private _webviewView?: vscode.WebviewView;

    resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
        this._webviewView = webviewView;
        webviewView.webview.options = getWebviewOptions(this._extensionUri);
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(handleWebviewMessage, null, this._disposables);
    }

    public tick() {
        if (this._webviewView) {
            void this.getWebview().postMessage({ command: 'tick' });
        }
    }

    public getWebview(): vscode.Webview {
        if (this._webviewView === undefined) {
            throw new Error('Metal Gear panel not active. Open the Metal Gear view first.');
        }
        return this._webviewView.webview;
    }

    public dispose() {
        this._webviewView = undefined;
        super.dispose();
    }
}

// ── activate helpers ───────────────────────────────────────────────────────────
let webviewViewProvider: MgsWebviewViewProvider;
let deployStatusBar: vscode.StatusBarItem;

interface IOperativeInfo { type: OperativeType; name: string; color: OperativeColor; }

function updateStatusBar(): void {
    deployStatusBar.text = `$(shield)`;
    deployStatusBar.tooltip = 'Deploy Operative';
    deployStatusBar.show();
}

async function updateExtensionPositionContext() {
    await vscode.commands.executeCommand('setContext', 'vscode-metalgear.position', getConfigurationPosition());
}

function getMgsPanel(): IMgsPanel | undefined {
    if (getConfigurationPosition() === ExtPosition.explorer && webviewViewProvider) { return webviewViewProvider; }
    else if (MgsPanel.currentPanel) { return MgsPanel.currentPanel; }
    return undefined;
}

function getMgsWebview(): vscode.Webview | undefined {
    if (getConfigurationPosition() === ExtPosition.explorer && webviewViewProvider) { return webviewViewProvider.getWebview(); }
    else if (MgsPanel.currentPanel) { return MgsPanel.currentPanel.getWebview(); }
}

async function handleRemoveOperativeMessage(this: vscode.ExtensionContext, message: WebviewMessage) {
    const opList: IOperativeInfo[] = [];
    if (message.command !== 'list-pets') { return; }
    message.text.split('\n').forEach((op) => {
        if (!op) { return; }
        const parts = op.split(',');
        opList.push({ type: parts[0] as OperativeType, name: parts[1], color: parts[2] as OperativeColor });
    });
    if (!opList.length) { await vscode.window.showErrorMessage('No operatives to extract.'); return; }
    const items = opList.map((op) => ({ label: op.name, description: `${op.color} ${op.type}`, name: op.name, type: op.type, color: op.color }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select operative to extract' });
    if (selected) {
        getMgsPanel()?.deletePet(selected.name, selected.type, selected.color);
        const collection = opList
            .filter((op) => op.name !== selected.name)
            .map((op) => new OperativeSpecification(op.color, op.type, OperativeSize.medium, op.name));
        await storeCollectionAsMemento(this, collection);
    }
}

async function createMgsPlayground(context: vscode.ExtensionContext) {
    const spec = OperativeSpecification.fromConfiguration();
    MgsPanel.createOrShow(
        context.extensionUri, spec.color, spec.type, spec.size,
        getConfiguredTheme(), getConfiguredThemeKind(),
        getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration(),
    );
    if (MgsPanel.currentPanel) {
        const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
        collection.forEach((item) => MgsPanel.currentPanel?.spawnPet(item));
        await storeCollectionAsMemento(context, collection);
    }
}

// ── activate ───────────────────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('vscode-metalgear.start', async () => {
            if (getConfigurationPosition() === ExtPosition.explorer && webviewViewProvider) {
                await vscode.commands.executeCommand('mgsView.focus');
            } else {
                const spec = OperativeSpecification.fromConfiguration();
                MgsPanel.createOrShow(context.extensionUri, spec.color, spec.type, spec.size, getConfiguredTheme(), getConfiguredThemeKind(), getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration());
                if (MgsPanel.currentPanel) {
                    const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
                    collection.forEach((item) => MgsPanel.currentPanel?.spawnPet(item));
                    await storeCollectionAsMemento(context, collection);
                }
            }
        }),
    );

    deployStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    deployStatusBar.command = 'vscode-metalgear.deploy-operative';
    context.subscriptions.push(deployStatusBar);
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBar));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBar));
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateExtensionPositionContext));
    updateStatusBar();

    const spec = OperativeSpecification.fromConfiguration();
    webviewViewProvider = new MgsWebviewViewProvider(context.extensionUri, spec.color, spec.type, spec.size, getConfiguredTheme(), getConfiguredThemeKind(), getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration());
    updateExtensionPositionContext().catch(console.error);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(MgsWebviewViewProvider.viewType, webviewViewProvider));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.throw-ration', () => { getMgsPanel()?.throwBall(); }));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.delete-operative', async () => {
        const panel = getMgsPanel();
        if (panel !== undefined) { panel.listPets(); getMgsWebview()?.onDidReceiveMessage(handleRemoveOperativeMessage, context); }
        else { await createMgsPlayground(context); }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.codec-call', async () => {
        const panel = getMgsPanel();
        if (panel !== undefined) { panel.rollCall(); } else { await createMgsPlayground(context); }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.abort-mission', async () => {
        const panel = getMgsPanel();
        if (panel !== undefined) { panel.resetPets(); await storeCollectionAsMemento(context, []); }
        else { await createMgsPlayground(context); }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.deploy-operative', async () => {
        const panel = getMgsPanel();
        if (getConfigurationPosition() === ExtPosition.explorer && webviewViewProvider) {
            await vscode.commands.executeCommand('mgsView.focus');
        }
        if (panel) {
            const typeItems = ALL_OPERATIVES.map((t) => ({ label: formatOperativeLabel(t), value: t }));
            const selectedType = await vscode.window.showQuickPick(typeItems, { placeHolder: 'Select operative to deploy' });
            if (!selectedType) { return; }
            let opColor: OperativeColor = DEFAULT_COLOR;
            const possibleColors = availableColors(selectedType.value);
            if (possibleColors.length > 1) {
                const colorItems = possibleColors.map((c) => ({ label: formatColorLabel(c), value: c }));
                const selectedColor = await vscode.window.showQuickPick(colorItems, { placeHolder: 'Select variant' });
                if (!selectedColor) { return; }
                opColor = selectedColor.value;
            } else { opColor = possibleColors[0]; }
            const name = await vscode.window.showInputBox({ placeHolder: 'Leave blank for a random codename', prompt: 'Name your operative', value: randomName(selectedType.value) });
            const opSpec = new OperativeSpecification(opColor, selectedType.value, getConfiguredSize(), name);
            panel.spawnPet(opSpec);
            const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
            collection.push(opSpec);
            await storeCollectionAsMemento(context, collection);
        } else {
            await createMgsPlayground(context);
            await vscode.window.showInformationMessage("Mission Zone created. Use 'Deploy Operative' to add more operatives.");
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.change-location', async () => {
        const panel = getMgsPanel();
        if (getConfigurationPosition() === ExtPosition.explorer && webviewViewProvider) {
            await vscode.commands.executeCommand('mgsView.focus');
        }
        if (panel) {
            const themeItems = ALL_THEMES.map((t) => ({ label: t === 'none' ? 'No Location' : t.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '), value: t }));
            const selectedTheme = await vscode.window.showQuickPick(themeItems, { placeHolder: 'Select mission location' });
            if (!selectedTheme) { return; }
            await vscode.workspace.getConfiguration('vscode-metalgear').update('theme', selectedTheme.value, vscode.ConfigurationTarget.Global);
        } else {
            await createMgsPlayground(context);
        }
    }));

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent): void => {
            if (
                e.affectsConfiguration('vscode-metalgear.operativeColor') ||
                e.affectsConfiguration('vscode-metalgear.operativeType') ||
                e.affectsConfiguration('vscode-metalgear.operativeSize') ||
                e.affectsConfiguration('vscode-metalgear.theme') ||
                e.affectsConfiguration('workbench.colorTheme')
            ) {
                const spec = OperativeSpecification.fromConfiguration();
                const panel = getMgsPanel();
                if (panel) {
                    panel.updatePetColor(spec.color);
                    panel.updatePetSize(spec.size);
                    panel.updatePetType(spec.type);
                    panel.updateTheme(getConfiguredTheme(), getConfiguredThemeKind());
                    panel.update();
                }
            }
            if (e.affectsConfiguration('vscode-metalgear.position')) {
                void updateExtensionPositionContext();
            }
            if (e.affectsConfiguration('vscode-metalgear.throwRationWithMouse')) {
                const panel = getMgsPanel();
                panel?.setThrowWithMouse(getThrowRationWithMouseConfiguration());
            }
            if (e.affectsConfiguration('vscode-metalgear.disableEffects')) {
                const panel = getMgsPanel();
                panel?.updateDisableEffects(getEffectsDisabledConfiguration());
            }
        }),
    );

    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(MgsPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel) {
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                const spec = OperativeSpecification.fromConfiguration();
                MgsPanel.revive(
                    webviewPanel, context.extensionUri,
                    spec.color, spec.type, spec.size,
                    getConfiguredTheme(), getConfiguredThemeKind(),
                    getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration(),
                );
            },
        });
    }
}

export function deactivate() {
    deployStatusBar?.dispose();
}
