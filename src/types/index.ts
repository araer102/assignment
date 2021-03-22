import { ReelItem, ReelPosition } from '@/constants'

export interface ReelResult {
    reelItems: Array<ReelItem>;
    reelPosition: ReelPosition;
}

export interface ReelComponent {
    spin: (spinInterval: number, step: number) => Promise<ReelResult>;
    setWinLines: (winningReelPositions: Array<ReelPosition>) => void;
    resetWinLines: () => void;
}

export interface PayTableComponent {
    clearPreviousWinningDataCells: () => void;
    calculateAndShowWinnings: (reels: Array<ReelResult>) => [number, Array<ReelPosition>];
}

export interface PayTableRow {
    combinationName: string,
    combinationLabel: string,
    combinationImages: Array<ReelItem>,
    top: number,
    mid: number,
    bottom: number
}

export interface ReelWinLineStyle {
    borderTop?: string;
    borderBottom?: string;
}
