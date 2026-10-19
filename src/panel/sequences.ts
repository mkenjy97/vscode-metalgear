/**
 * Sequence tree per la macchina a stati degli operativi.
 * Struttura identica a vscode-pets per compatibilità.
 */
import { States } from './states';

export interface ISequenceNode {
    state: States;
    possibleNextStates: States[];
}

export interface ISequenceTree {
    startingState: States;
    sequenceStates: ISequenceNode[];
}
