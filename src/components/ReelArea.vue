<template>
  <div class="reel-area" ref="reelArea">
    <div class="debug-area">
      <h3>DEBUG</h3>
      <div>Both Have to be selected!</div>
      <select v-model="selectedDebugItem" id="debug-item-select" class="form-select" :disabled="isDebugDisabled">
        <option value="">--select item--</option>
        <option v-for="(value, index) in debugReelItems" :key="index" :value="value">
          {{ value.toString().replace('.png', '') }}
        </option>
      </select>
      <select v-model="selectedDebugPosition" id="debug-item-position" class="form-select" :disabled="isDebugDisabled">
        <option value="">--select position--</option>
        <option v-for="(value, index) in debugReelPositions" :key="index" :value="value">
          {{ value.toString().replace('.png', '') }}
        </option>
      </select>
    </div>
    <div class="reel">
      <div class="win-line-top-section"></div>
      <div
        class="win-line-mid-top-section"
        :style="[midWinStyle(winLineMidTopSectionIdent), topWinStyle(winLineMidTopSectionIdent), bottomWinStyle(winLineMidTopSectionIdent)]"
      ></div>
      <div
        class="win-line-mid-bottom-section"
        :style="[midWinStyle(winLineMidBottomSectionIdent), topWinStyle(winLineMidBottomSectionIdent), bottomWinStyle(winLineMidBottomSectionIdent)]"
      ></div>
      <div class="win-line-bottom-section"></div>
      <div
        class="reel-item"
        v-for="(image, index) in reelItems"
        :key="index"
        :id="`reel-item-${index}`"
        :style="reelItemPosition(index)"
      >
        <img :src="require(`../assets/images/${image}`)" :alt="image">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ReelUtils } from '@/utils/reel'
import { prop, Vue } from 'vue-class-component'
import { ReelResult, ReelWinLineStyle } from '@/types'
import {
    ReelItem,
    ReelPosition,
    ReelWinLineSection,
    DEFAULT_REEL_ITEM_WIDTH,
    DEFAULT_REEL_ITEM_HEIGHT,
    DEFAULT_MAX_FULLY_VISIBLE_REEL_ELEMENTS
} from '@/constants'

class Props {
    isDebugDisabled = prop<boolean>({ default: false })
    reelItemWidth = prop<number>({ default: DEFAULT_REEL_ITEM_WIDTH })
    reelItemHeight = prop<number>({ default: DEFAULT_REEL_ITEM_HEIGHT })
    maxFullyVisibleReelElements = prop<number>({ default: DEFAULT_MAX_FULLY_VISIBLE_REEL_ELEMENTS })
}

export default class ReelArea extends Vue.with(Props) {
    interval = 0
    spinTime = 0
    shouldMiddle = false

    isTopWin = false
    isMidWin = false
    isBottomWin = false

    winLineMidTopSectionIdent = ReelWinLineSection.MID_TOP
    winLineMidBottomSectionIdent = ReelWinLineSection.MID_BOTTOM

    selectedDebugItem: ReelItem = ReelItem.NOT_SPECIFIED
    selectedDebugPosition: ReelPosition = ReelPosition.NOT_SPECIFIED

    debugReelItems: Array<ReelItem> = [
        ReelItem.BAR_3,
        ReelItem.BAR_1,
        ReelItem.BAR_2,
        ReelItem.SEVEN,
        ReelItem.CHERRY
    ]

    debugReelPositions: Array<ReelPosition> = [
        ReelPosition.TOP,
        ReelPosition.MID,
        ReelPosition.BOTTOM
    ]

    availableReelItems: Array<ReelItem> = [
        ReelItem.SEVEN,
        ReelItem.BAR_2,
        ReelItem.BAR_1,
        ReelItem.BAR_3,
        ReelItem.CHERRY
    ]

    currentReelItems: Array<ReelItem> = [
        ReelItem.CHERRY,
        ReelItem.BAR_3,
        ReelItem.BAR_1
    ]

    nextReelItemPosition = 0
    reelItemsCount = this.availableReelItems.length

    mounted(): void {
        const reelArea = this.$refs.reelArea as HTMLElement
        reelArea.style.setProperty('--reel-item-height', `${this.reelItemHeight}px`)
        reelArea.style.setProperty('--reel-item-width', `${this.reelItemWidth}px`)
        reelArea.style.setProperty('--max-fully-visible-elements-on-reel', this.maxFullyVisibleReelElements.toString())
    }

    reelItemPosition(index: string): string {
        const topElementVisibility = this.shouldMiddle ? 0.5 : 1
        return `top: ${(parseInt(index) - topElementVisibility) * this.reelItemHeight}px`
    }

    spin(spinInterval: number, step: number): Promise<ReelResult> {
        this.spinTime = ReelUtils.calculateSpinTime(step)

        return new Promise(resolve => {
            this.interval = setInterval(() => {
                this.shouldMiddle = !this.shouldMiddle

                if (!this.shouldMiddle) {
                    this.nextReelItemPosition = this.nextReelItemPosition % this.reelItemsCount
                    this.currentReelItems.unshift(this.availableReelItems[this.nextReelItemPosition])
                    this.currentReelItems.pop()
                    this.nextReelItemPosition++
                }

                this.calculatePassedTime(spinInterval)
                if (this.spinTime < 0) {
                    clearInterval(this.interval)
                    if (this.isDebug) {
                        this.resolveDebugReelItems()
                        this.shouldMiddle = (this.selectedDebugPosition === ReelPosition.MID)
                    }
                    resolve({
                        reelPosition: this.shouldMiddle ? ReelPosition.MID : ReelPosition.TOP_BOTTOM,
                        reelItems: [
                            ...this.reelItems
                        ]
                    })
                }
            }, spinInterval)
        })
    }

    resetWinLines(): void {
        this.isMidWin = false
        this.isTopWin = false
        this.isBottomWin = false
    }

    topWinStyle(elementPosition: ReelWinLineSection): ReelWinLineStyle | '' {
        if (!this.isTopWin) {
            return ''
        }

        if (elementPosition === ReelWinLineSection.MID_TOP) {
            return {
                borderTop: '0.125rem solid red',
                borderBottom: 'none'
            }
        }

        if (elementPosition === ReelWinLineSection.MID_BOTTOM) {
            return {
                borderTop: 'none'
            }
        }

        return ''
    }

    midWinStyle(elementPosition: ReelWinLineSection): ReelWinLineStyle | '' {
        if (!this.isMidWin) {
            return ''
        }

        if (elementPosition === ReelWinLineSection.MID_TOP) {
            return {
                borderTop: 'none',
                borderBottom: '0.0625rem solid red'
            }
        }

        if (elementPosition === ReelWinLineSection.MID_BOTTOM) {
            return {
                borderTop: '0.0625rem solid red',
                borderBottom: 'none'
            }
        }

        return ''
    }

    bottomWinStyle(elementPosition: ReelWinLineSection): ReelWinLineStyle | '' {
        if (!this.isBottomWin) {
            return ''
        }

        if (elementPosition === ReelWinLineSection.MID_TOP) {
            return {
                borderBottom: 'none'
            }
        }

        if (elementPosition === ReelWinLineSection.MID_BOTTOM) {
            return {
                borderTop: 'none',
                borderBottom: '0.125rem solid red'
            }
        }

        return ''
    }

    setWinLines(winningReelPositions: Array<ReelPosition>): void {
        if (!winningReelPositions.length) {
            return
        }

        this.isMidWin = winningReelPositions.some(winningPosition => winningPosition === ReelPosition.MID)
        if (this.isMidWin) {
            return
        }
        this.isTopWin = winningReelPositions.some(winningPosition => winningPosition === ReelPosition.TOP)
        this.isBottomWin = winningReelPositions.some(winningPosition => winningPosition === ReelPosition.BOTTOM)
    }

    get reelItems(): Array<ReelItem> {
        return this.currentReelItems
    }

    get isDebug(): boolean {
        return !!(this.selectedDebugPosition && this.selectedDebugItem)
    }

    calculatePassedTime(spinInterval: number): void {
        this.spinTime -= spinInterval
    }

    resolveDebugReelItems(): void {
        let debugReelItemSliceArry: Array<ReelItem> = []
        const debugReelItemIndex = this.debugReelItems.findIndex(item => item === this.selectedDebugItem)
        let debugReelItemStart = debugReelItemIndex - (this.selectedDebugPosition !== ReelPosition.BOTTOM ? 1 : 2)
        let debugReelItemStop = (debugReelItemIndex + 1) + (this.selectedDebugPosition !== ReelPosition.BOTTOM ? 1 : 0)

        if (debugReelItemStart === -2) {
            debugReelItemSliceArry = [
                ReelItem.SEVEN,
                ReelItem.CHERRY,
                ...this.debugReelItems
            ]
            debugReelItemStart = 0
            debugReelItemStop = 3
        } else if (debugReelItemStart === -1) {
            debugReelItemSliceArry = [
                ReelItem.CHERRY,
                ...this.debugReelItems
            ]
            debugReelItemStart = 0
            debugReelItemStop = 3
        } else {
            debugReelItemSliceArry = [
                ...this.debugReelItems,
                ReelItem.BAR_3,
                ReelItem.BAR_1
            ]
        }

        this.currentReelItems = debugReelItemSliceArry.slice(debugReelItemStart, debugReelItemStop)
        this.nextReelItemPosition = this.availableReelItems.findIndex(element => element === this.currentReelItems[0])
        this.nextReelItemPosition++
    }
}
</script>

<style scoped lang="scss">
     @import "../assets/styles/variables";
     $container-width: 11rem;

    .reel-area {
        color: $main-color;
        padding: 1rem 1rem 0;
        background-color: $main-background-color;

        .reel,
        .debug-area {
            width: $container-width;
            margin-bottom: 5rem;
        }
    }

    .debug-area {
        text-align: center;
    }

    #debug-item-select {
        margin: 0.625rem 0 0.375rem;
    }

    #debug-item-position {
        margin: 0.375rem 0 1.25rem;
    }

    .reel {
        overflow: hidden;
        position: relative;
        text-align: center;
        height: calc(var(--reel-item-height) * var(--max-fully-visible-elements-on-reel));
    }

     .win-line-top-section,
     .win-line-mid-top-section,
     .win-line-mid-bottom-section,
     .win-line-bottom-section {
        width: 100%;
        height: calc((var(--reel-item-height) * var(--max-fully-visible-elements-on-reel)) / 4);
    }

    .win-line-top-section {
        border-top: 0.125rem solid $main-color;
    }

     .win-line-mid-top-section {
        border-top: 0.125rem solid $secondary-color;
        border-bottom: 0.0625rem solid $main-color;
    }

     .win-line-mid-bottom-section {
        border-top: 0.0625rem solid $main-color;
        border-bottom: 0.125rem solid $secondary-color;
    }

     .win-line-bottom-section {
        border-bottom: 0.125rem solid $main-color;
    }

    .reel-item {
        z-index: 1;
        position: absolute;
        height: var(--reel-item-height);
        left: calc((#{$container-width} - var(--reel-item-width)) / 2);
    }
</style>
