export const LOSS_DECREMENT_STEP = -1
export const DEFAULT_REEL_ITEM_WIDTH = 141
export const DEFAULT_REEL_ITEM_HEIGHT = 121
export const DEFAULT_MAX_FULLY_VISIBLE_REEL_ELEMENTS = 2
export const MINIMUM_REEL_SPIN_TIME = 2000 // in milliseconds
export const NEXT_REEL_SPIN_TIME_STEP = 500 // in milliseconds

export enum ReelWinLineSection {
  TOP,
  MID_TOP,
  MID_BOTTOM,
  BOTTOM
}

export enum ReelItem {
  NOT_SPECIFIED = '',
  BAR_3 = '3xBAR.png',
  BAR_1 = 'BAR.png',
  BAR_2 = '2xBAR.png',
  SEVEN = '7.png',
  CHERRY = 'Cherry.png'
}

export enum ReelPosition {
  NOT_SPECIFIED = '',
  MID = 'MID',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  TOP_BOTTOM = 'TOP_BOTTOM'
}
