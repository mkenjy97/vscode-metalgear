"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.storeCollectionAsMemento = exports.OperativeSpecification = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("../common/types");
const names_1 = require("../common/names");
const operative_config_1 = require("../common/operative-config");
// ── Constants ─────────────────────────────────────────────────────────────────
const EXTRA_OPS_KEY = 'vscode-metalgear.extra-operatives';
const EXTRA_OPS_KEY_TYPES = EXTRA_OPS_KEY + '.types';
const EXTRA_OPS_KEY_COLORS = EXTRA_OPS_KEY + '.colors';
const EXTRA_OPS_KEY_NAMES = EXTRA_OPS_KEY + '.names';
const DEFAULT_OP_SCALE = "nano" /* OperativeSize.nano */;
const DEFAULT_COLOR = "sneaking-suit" /* OperativeColor.sneakingSuit */;
const DEFAULT_OP_TYPE = "solid-snake" /* OperativeType.solidSnake */;
const DEFAULT_POSITION = "panel" /* ExtPosition.panel */;
const DEFAULT_THEME = "none" /* Theme.none */;
// ── Helpers ───────────────────────────────────────────────────────────────────
function formatOperativeLabel(type) {
    const labels = {
        'solid-snake': '🐍 Solid Snake',
        'cardboard-box': '📦 Cardboard Box',
        'genome-soldier': '🪖 Genome Soldier',
        'gray-fox': '🥷 Gray Fox',
        'raiden': '⚡ Raiden',
        'metal-gear-rex': '🤖 Metal Gear REX',
    };
    return labels[type] ?? type;
}
function formatColorLabel(color) {
    const labels = {
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
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
function getWebviewOptions(extensionUri) {
    return {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
    };
}
// ── Config helpers ─────────────────────────────────────────────────────────────
function getConfiguredSize() {
    let size = vscode.workspace.getConfiguration('vscode-metalgear').get('operativeSize', DEFAULT_OP_SCALE);
    if (types_1.ALL_SCALES.lastIndexOf(size) === -1) {
        size = DEFAULT_OP_SCALE;
    }
    return size;
}
function getConfiguredTheme() {
    let theme = vscode.workspace.getConfiguration('vscode-metalgear').get('theme', DEFAULT_THEME);
    if (types_1.ALL_THEMES.lastIndexOf(theme) === -1) {
        theme = DEFAULT_THEME;
    }
    return theme;
}
function getConfiguredThemeKind() { return vscode.window.activeColorTheme.kind; }
function getConfigurationPosition() {
    return vscode.workspace.getConfiguration('vscode-metalgear').get('position', DEFAULT_POSITION);
}
function getThrowRationWithMouseConfiguration() {
    return vscode.workspace.getConfiguration('vscode-metalgear').get('throwRationWithMouse', false);
}
function getEffectsDisabledConfiguration() {
    return vscode.workspace.getConfiguration('vscode-metalgear').get('disableEffects', false);
}
// ── OperativeSpecification ────────────────────────────────────────────────────
class OperativeSpecification {
    constructor(color, type, size, name) {
        this.color = color;
        this.type = type;
        this.size = size;
        this.name = name ?? (0, names_1.randomName)(type);
    }
    static fromConfiguration() {
        let color = vscode.workspace.getConfiguration('vscode-metalgear').get('operativeColor', DEFAULT_COLOR);
        if (types_1.ALL_COLORS.lastIndexOf(color) === -1) {
            color = DEFAULT_COLOR;
        }
        let type = vscode.workspace.getConfiguration('vscode-metalgear').get('operativeType', DEFAULT_OP_TYPE);
        if (types_1.ALL_OPERATIVES.lastIndexOf(type) === -1) {
            type = DEFAULT_OP_TYPE;
        }
        return new OperativeSpecification(color, type, getConfiguredSize());
    }
    static collectionFromMemento(context, size) {
        const types = context.globalState.get(EXTRA_OPS_KEY_TYPES, []);
        const colors = context.globalState.get(EXTRA_OPS_KEY_COLORS, []);
        const names = context.globalState.get(EXTRA_OPS_KEY_NAMES, []);
        const result = [];
        for (let i = 0; i < types.length; i++) {
            result.push(new OperativeSpecification(colors?.[i] ?? DEFAULT_COLOR, types[i], size, names[i]));
        }
        return result;
    }
}
exports.OperativeSpecification = OperativeSpecification;
async function storeCollectionAsMemento(context, collection) {
    await context.globalState.update(EXTRA_OPS_KEY_TYPES, collection.map((op) => op.type));
    await context.globalState.update(EXTRA_OPS_KEY_COLORS, collection.map((op) => op.color));
    await context.globalState.update(EXTRA_OPS_KEY_NAMES, collection.map((op) => op.name));
    context.globalState.setKeysForSync([EXTRA_OPS_KEY_TYPES, EXTRA_OPS_KEY_COLORS, EXTRA_OPS_KEY_NAMES]);
}
exports.storeCollectionAsMemento = storeCollectionAsMemento;
// ── MgsWebviewContainer (base) ────────────────────────────────────────────────
class MgsWebviewContainer {
    constructor(extensionUri, color, type, size, theme, themeKind, throwBallWithMouse, disableEffects) {
        this._disposables = [];
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
    petColor() { return (0, operative_config_1.normalizeColor)(this._petColor, this._petType); }
    petType() { return this._petType; }
    petSize() { return this._petSize; }
    theme() { return this._theme; }
    themeKind() { return this._themeKind; }
    throwBallWithMouse() { return this._throwBallWithMouse; }
    disableEffects() { return this._disableEffects; }
    updatePetColor(newColor) { this._petColor = newColor; }
    updatePetType(newType) { this._petType = newType; }
    updatePetSize(newSize) { this._petSize = newSize; }
    updateTheme(newTheme, themeKind) {
        this._theme = newTheme;
        this._themeKind = themeKind;
    }
    setThrowWithMouse(value) {
        this._throwBallWithMouse = value;
        void this.getWebview().postMessage({ command: 'throw-with-mouse', enabled: value });
    }
    updateDisableEffects(value) {
        this._disableEffects = value;
        void this.getWebview().postMessage({ command: 'disable-effects', disabled: value });
    }
    throwBall() { void this.getWebview().postMessage({ command: 'throw-ball' }); }
    resetPets() { void this.getWebview().postMessage({ command: 'reset-pet' }); }
    spawnPet(spec) {
        void this.getWebview().postMessage({ command: 'spawn-pet', type: spec.type, color: spec.color, name: spec.name });
    }
    listPets() { void this.getWebview().postMessage({ command: 'list-pets' }); }
    rollCall() { void this.getWebview().postMessage({ command: 'roll-call' }); }
    deletePet(name, type, color) {
        void this.getWebview().postMessage({ command: 'delete-pet', name, type, color });
    }
    _getHtmlForWebview(webview) {
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
    _update() {
        this.getWebview().html = this._getHtmlForWebview(this.getWebview());
    }
    update() { this._update(); }
    getWebview() {
        throw new Error('Not implemented');
    }
    tick() {
        throw new Error('Not implemented');
    }
    dispose() {
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
        if (this._tickIntervalId) {
            clearInterval(this._tickIntervalId);
            this._tickIntervalId = undefined;
        }
    }
}
function handleWebviewMessage(message) {
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
class MgsPanel extends MgsWebviewContainer {
    static createOrShow(extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (MgsPanel.currentPanel) {
            if (color === MgsPanel.currentPanel.petColor() && type === MgsPanel.currentPanel.petType() && size === MgsPanel.currentPanel.petSize()) {
                MgsPanel.currentPanel._panel.reveal(column);
                return;
            }
            else {
                MgsPanel.currentPanel.updatePetColor(color);
                MgsPanel.currentPanel.updatePetType(type);
                MgsPanel.currentPanel.updatePetSize(size);
                MgsPanel.currentPanel.update();
            }
        }
        const panel = vscode.window.createWebviewPanel(MgsPanel.viewType, vscode.l10n.t('Metal Gear Operatives'), vscode.ViewColumn.Two, getWebviewOptions(extensionUri));
        MgsPanel.currentPanel = new MgsPanel(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
    }
    static revive(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects) {
        MgsPanel.currentPanel = new MgsPanel(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
    }
    constructor(panel, extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects) {
        super(extensionUri, color, type, size, theme, themeKind, throwWithMouse, disableEffects);
        this._panel = panel;
        this._update();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.onDidChangeViewState(() => { this.update(); }, null, this._disposables);
        this._panel.webview.onDidReceiveMessage(handleWebviewMessage, null, this._disposables);
    }
    tick() {
        if (this._panel.visible) {
            void this.getWebview().postMessage({ command: 'tick' });
        }
    }
    dispose() {
        MgsPanel.currentPanel = undefined;
        this._panel.dispose();
        super.dispose();
    }
    update() {
        if (this._panel.visible) {
            this._update();
        }
    }
    getWebview() { return this._panel.webview; }
}
MgsPanel.viewType = 'mgsOperatives';
// ── MgsWebviewViewProvider (Explorer sidebar) ──────────────────────────────────
class MgsWebviewViewProvider extends MgsWebviewContainer {
    resolveWebviewView(webviewView) {
        this._webviewView = webviewView;
        webviewView.webview.options = getWebviewOptions(this._extensionUri);
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(handleWebviewMessage, null, this._disposables);
    }
    tick() {
        if (this._webviewView) {
            void this.getWebview().postMessage({ command: 'tick' });
        }
    }
    getWebview() {
        if (this._webviewView === undefined) {
            throw new Error('Metal Gear panel not active. Open the Metal Gear view first.');
        }
        return this._webviewView.webview;
    }
    dispose() {
        this._webviewView = undefined;
        super.dispose();
    }
}
MgsWebviewViewProvider.viewType = 'mgsView';
// ── activate helpers ───────────────────────────────────────────────────────────
let webviewViewProvider;
let deployStatusBar;
function updateStatusBar() {
    deployStatusBar.text = `$(shield)`;
    deployStatusBar.tooltip = 'Deploy Operative';
    deployStatusBar.show();
}
async function updateExtensionPositionContext() {
    await vscode.commands.executeCommand('setContext', 'vscode-metalgear.position', getConfigurationPosition());
}
function getMgsPanel() {
    if (getConfigurationPosition() === "explorer" /* ExtPosition.explorer */ && webviewViewProvider) {
        return webviewViewProvider;
    }
    else if (MgsPanel.currentPanel) {
        return MgsPanel.currentPanel;
    }
    return undefined;
}
function getMgsWebview() {
    if (getConfigurationPosition() === "explorer" /* ExtPosition.explorer */ && webviewViewProvider) {
        return webviewViewProvider.getWebview();
    }
    else if (MgsPanel.currentPanel) {
        return MgsPanel.currentPanel.getWebview();
    }
}
async function handleRemoveOperativeMessage(message) {
    const opList = [];
    if (message.command !== 'list-pets') {
        return;
    }
    message.text.split('\n').forEach((op) => {
        if (!op) {
            return;
        }
        const parts = op.split(',');
        opList.push({ type: parts[0], name: parts[1], color: parts[2] });
    });
    if (!opList.length) {
        await vscode.window.showErrorMessage('No operatives to extract.');
        return;
    }
    const items = opList.map((op) => ({ label: op.name, description: `${op.color} ${op.type}`, name: op.name, type: op.type, color: op.color }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select operative to extract' });
    if (selected) {
        getMgsPanel()?.deletePet(selected.name, selected.type, selected.color);
        const collection = opList
            .filter((op) => op.name !== selected.name)
            .map((op) => new OperativeSpecification(op.color, op.type, "medium" /* OperativeSize.medium */, op.name));
        await storeCollectionAsMemento(this, collection);
    }
}
async function createMgsPlayground(context) {
    const spec = OperativeSpecification.fromConfiguration();
    MgsPanel.createOrShow(context.extensionUri, spec.color, spec.type, spec.size, getConfiguredTheme(), getConfiguredThemeKind(), getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration());
    if (MgsPanel.currentPanel) {
        const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
        collection.forEach((item) => MgsPanel.currentPanel?.spawnPet(item));
        await storeCollectionAsMemento(context, collection);
    }
}
// ── activate ───────────────────────────────────────────────────────────────────
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.start', async () => {
        if (getConfigurationPosition() === "explorer" /* ExtPosition.explorer */ && webviewViewProvider) {
            await vscode.commands.executeCommand('mgsView.focus');
        }
        else {
            const spec = OperativeSpecification.fromConfiguration();
            MgsPanel.createOrShow(context.extensionUri, spec.color, spec.type, spec.size, getConfiguredTheme(), getConfiguredThemeKind(), getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration());
            if (MgsPanel.currentPanel) {
                const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
                collection.forEach((item) => MgsPanel.currentPanel?.spawnPet(item));
                await storeCollectionAsMemento(context, collection);
            }
        }
    }));
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
        if (panel !== undefined) {
            panel.listPets();
            getMgsWebview()?.onDidReceiveMessage(handleRemoveOperativeMessage, context);
        }
        else {
            await createMgsPlayground(context);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.codec-call', async () => {
        const panel = getMgsPanel();
        if (panel !== undefined) {
            panel.rollCall();
        }
        else {
            await createMgsPlayground(context);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.abort-mission', async () => {
        const panel = getMgsPanel();
        if (panel !== undefined) {
            panel.resetPets();
            await storeCollectionAsMemento(context, []);
        }
        else {
            await createMgsPlayground(context);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.deploy-operative', async () => {
        const panel = getMgsPanel();
        if (getConfigurationPosition() === "explorer" /* ExtPosition.explorer */ && webviewViewProvider) {
            await vscode.commands.executeCommand('mgsView.focus');
        }
        if (panel) {
            const typeItems = types_1.ALL_OPERATIVES.map((t) => ({ label: formatOperativeLabel(t), value: t }));
            const selectedType = await vscode.window.showQuickPick(typeItems, { placeHolder: 'Select operative to deploy' });
            if (!selectedType) {
                return;
            }
            let opColor = DEFAULT_COLOR;
            const possibleColors = (0, operative_config_1.availableColors)(selectedType.value);
            if (possibleColors.length > 1) {
                const colorItems = possibleColors.map((c) => ({ label: formatColorLabel(c), value: c }));
                const selectedColor = await vscode.window.showQuickPick(colorItems, { placeHolder: 'Select variant' });
                if (!selectedColor) {
                    return;
                }
                opColor = selectedColor.value;
            }
            else {
                opColor = possibleColors[0];
            }
            const name = await vscode.window.showInputBox({ placeHolder: 'Leave blank for a random codename', prompt: 'Name your operative', value: (0, names_1.randomName)(selectedType.value) });
            const opSpec = new OperativeSpecification(opColor, selectedType.value, getConfiguredSize(), name);
            panel.spawnPet(opSpec);
            const collection = OperativeSpecification.collectionFromMemento(context, getConfiguredSize());
            collection.push(opSpec);
            await storeCollectionAsMemento(context, collection);
        }
        else {
            await createMgsPlayground(context);
            await vscode.window.showInformationMessage("Mission Zone created. Use 'Deploy Operative' to add more operatives.");
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-metalgear.change-location', async () => {
        const panel = getMgsPanel();
        if (getConfigurationPosition() === "explorer" /* ExtPosition.explorer */ && webviewViewProvider) {
            await vscode.commands.executeCommand('mgsView.focus');
        }
        if (panel) {
            const themeItems = types_1.ALL_THEMES.map((t) => ({ label: t === 'none' ? 'No Location' : t.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' '), value: t }));
            const selectedTheme = await vscode.window.showQuickPick(themeItems, { placeHolder: 'Select mission location' });
            if (!selectedTheme) {
                return;
            }
            await vscode.workspace.getConfiguration('vscode-metalgear').update('theme', selectedTheme.value, vscode.ConfigurationTarget.Global);
        }
        else {
            await createMgsPlayground(context);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('vscode-metalgear.operativeColor') ||
            e.affectsConfiguration('vscode-metalgear.operativeType') ||
            e.affectsConfiguration('vscode-metalgear.operativeSize') ||
            e.affectsConfiguration('vscode-metalgear.theme') ||
            e.affectsConfiguration('workbench.colorTheme')) {
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
    }));
    if (vscode.window.registerWebviewPanelSerializer) {
        vscode.window.registerWebviewPanelSerializer(MgsPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel) {
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                const spec = OperativeSpecification.fromConfiguration();
                MgsPanel.revive(webviewPanel, context.extensionUri, spec.color, spec.type, spec.size, getConfiguredTheme(), getConfiguredThemeKind(), getThrowRationWithMouseConfiguration(), getEffectsDisabledConfiguration());
            },
        });
    }
}
exports.activate = activate;
function deactivate() {
    deployStatusBar?.dispose();
}
exports.deactivate = deactivate;
