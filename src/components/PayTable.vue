<template>
  <div class="pay-table-container" ref="payTableContainer">
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th>combination</th>
          <th>symbol</th>
          <th>1st</th>
          <th>2nd</th>
          <th>3rd</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in payTable" :key="index">
          <td>{{ row.combinationLabel }}</td>
          <td>
            <template v-for="(image, imageIndex) in row.combinationImages" :key="imageIndex">
              <img :src="require(`../assets/images/${image}`)" :alt="image">
            </template>
          </td>
          <td :id="`top-${row.combinationName}`" class="payout-indicator">{{ row.top }}</td>
          <td :id="`mid-${row.combinationName}`" class="payout-indicator">{{ row.mid }}</td>
          <td :id="`bottom-${row.combinationName}`" class="payout-indicator">{{ row.bottom }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { prop, Vue } from 'vue-class-component'
import { PayTableRow, ReelResult } from '@/types'
import { DEFAULT_REEL_ITEM_HEIGHT, ReelItem, ReelPosition } from '@/constants'

class Props {
    reelItemHeight = prop<number>({ default: DEFAULT_REEL_ITEM_HEIGHT })
}

export default class PayTable extends Vue.with(Props) {
    currentWinningCells: Array<HTMLElement> = []

    payTable: Array<PayTableRow> = [
        {
            combinationName: '3_CHERRY',
            combinationLabel: '3x',
            combinationImages: [
                ReelItem.CHERRY
            ],
            top: 2000,
            mid: 1000,
            bottom: 4000
        },
        {
            combinationName: '3_SEVEN',
            combinationLabel: '3x',
            combinationImages: [
                ReelItem.SEVEN
            ],
            top: 150,
            mid: 150,
            bottom: 150
        },
        {
            combinationName: 'ANY_COMBINATION_SEVEN_CHERRY',
            combinationLabel: 'Any of',
            combinationImages: [
                ReelItem.CHERRY,
                ReelItem.SEVEN
            ],
            top: 75,
            mid: 75,
            bottom: 75
        },
        {
            combinationName: '3_3xBAR',
            combinationLabel: '3x',
            combinationImages: [
                ReelItem.BAR_3
            ],
            top: 50,
            mid: 50,
            bottom: 50
        },
        {
            combinationName: '3_2xBAR',
            combinationLabel: '3x',
            combinationImages: [
                ReelItem.BAR_2
            ],
            top: 20,
            mid: 20,
            bottom: 20
        },
        {
            combinationName: '3_1xBAR',
            combinationLabel: '3x',
            combinationImages: [
                ReelItem.BAR_1
            ],
            top: 10,
            mid: 10,
            bottom: 10
        },
        {
            combinationName: 'ANY_COMBINATION_BAR',
            combinationLabel: 'Any of',
            combinationImages: [
                ReelItem.BAR_1,
                ReelItem.BAR_2,
                ReelItem.BAR_3
            ],
            top: 5,
            mid: 5,
            bottom: 5
        }
    ]

    mounted(): void {
        const reelArea = this.$refs.payTableContainer as HTMLElement
        reelArea.style.setProperty('--reel-item-height', `${this.reelItemHeight}px`)
    }

    calculateAndShowWinnings(reelResults: Array<ReelResult>): [number, Array<ReelPosition>] {
        const winConditions = this.resolveWinConditions(reelResults)
        if (!winConditions.length) {
            return [0, []]
        }

        const winningPositions: Array<ReelPosition> = []

        const isMid = winConditions[0].length === 1
        const potentialWinningPositions = isMid ? [ReelPosition.MID] : [ReelPosition.TOP, ReelPosition.BOTTOM]

        let winRowIndex = 0
        let totalWinnings = 0
        for (const potentialWinningPosition of potentialWinningPositions) {
            const winRow = this.resolveWinRow(winConditions, winRowIndex)
            const winSum = this.getWinningSum(winRow, potentialWinningPosition)

            winRowIndex++
            if (winSum < 1) {
                continue
            }

            winningPositions.push(potentialWinningPosition)
            this.showWinData(winRow, potentialWinningPosition)
            totalWinnings += winSum
        }

        return [totalWinnings, winningPositions]
    }

    clearPreviousWinningDataCells(): void {
        for (const winningDataCell of this.currentWinningCells) {
            winningDataCell.classList.remove('winning-data-cell')
        }

        this.currentWinningCells = []
    }

    resolveWinConditions(reelResults: Array<ReelResult>): Array<Array<ReelItem>> {
        let previousWinConditionCount = 0
        const winConditions = []

        for (const reelResult of reelResults) {
            let currentWinConditions = []

            if (reelResult.reelPosition === ReelPosition.MID) {
                currentWinConditions = [reelResult.reelItems[1]]
            } else {
                currentWinConditions = [reelResult.reelItems[1], reelResult.reelItems[2]]
            }
            if (previousWinConditionCount !== 0 && previousWinConditionCount !== currentWinConditions.length) {
                return []
            } else {
                previousWinConditionCount = currentWinConditions.length
                winConditions.push(currentWinConditions)
            }
        }
        return winConditions
    }

    resolveWinRow(winConditions: Array<Array<ReelItem>>, targetIndex: number): PayTableRow | undefined {
        let winningRow: PayTableRow | undefined

        for (const payTableRow of this.payTable) {
            const reelHit = []

            for (const winConditionRow of winConditions) {
                const winCondition = winConditionRow[targetIndex]
                if (!payTableRow.combinationImages.some(reelElement => winCondition === reelElement)) {
                    break
                }
                reelHit.push(1)
            }

            if (reelHit.length === 3) {
                winningRow = payTableRow
                break
            }
        }

        return winningRow
    }

    getWinningSum(payTableRow: PayTableRow | undefined, position: ReelPosition): number {
        if (!payTableRow) {
            return 0
        }
        return (payTableRow as unknown as Record<string, number>)[position.toString().toLowerCase()]
    }

    showWinData(payTableRow: PayTableRow | undefined, position: ReelPosition): void {
        if (!payTableRow) {
            return
        }
        const winDataCell = document.getElementById(
            `${position.toString().toLowerCase()}-${payTableRow.combinationName}`
        ) as HTMLElement
        winDataCell.classList.add('winning-data-cell')
        this.currentWinningCells.push(winDataCell)
    }
}
</script>

<style lang="scss">
    @import "../assets/styles/variables";

    .pay-table-container {
        min-width: 39rem;

        .payout-indicator {
            width: 4rem;
        }

        table {
            margin-bottom: 0;
        }

        thead {
            tr {
                th {
                    padding: 1.75rem 1rem 0;
                    color: $main-color;
                    &:first-child {
                        border-top-left-radius: $main-border-radius;
                    }
                    &:last-child {
                        border-top-right-radius: $main-border-radius;
                    }
                }
            }
        }

        tbody {
            tr {
                border-color: $main-color;

                &:last-child {
                    border-bottom: none;

                    td {
                        &:first-child {
                            border-bottom-left-radius: $main-border-radius;
                        }
                        &:last-child {
                            border-bottom-right-radius: $main-border-radius;
                        }
                    }
                }

            }
        }

        img {
            height: calc(var(--reel-item-height) / 2);
        }

        td, th {
          text-align: center;
          vertical-align: middle;
        }
    }

    .winning-data-cell {
        animation-name: winning-animation;
        animation-duration: 0.5s;
        animation-iteration-count: 5;
        animation-fill-mode: forwards;
        animation-timing-function: linear;
    }

    @keyframes winning-animation {
      100% {
          box-shadow: inset 0 0 0 9999px $indicator-color;
          color: $secondary-color;
      }
    }
</style>
