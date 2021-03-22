<template>
  <div class="slot-machine">
    <div class="page-title">
      <span class="page-title-label">{{ pageTitle }}</span>
    </div>
    <div class="slot-machine-game-field-wrapper">
      <div class="card slot-machine-reel-wrapper">
        <reel-area ref="reelArea1" :is-debug-disabled="isSpinning"></reel-area>
        <reel-area ref="reelArea2" :is-debug-disabled="isSpinning"></reel-area>
        <reel-area ref="reelArea3" :is-debug-disabled="isSpinning"></reel-area>
      </div>

      <div class="card pay-table-wrapper">
        <pay-table ref="payTable"></pay-table>
      </div>
    </div>

    <div class="control-panel">
      <div class="card control-card">
        <label
          v-if="currentBalanceError"
          for="balance-box"
          class="form-label error-label"
        >{{ currentBalanceError }}</label>
        <label v-else for="balance-box" class="form-label">Current balance: {{ currentBalance }}</label>
        <input
          type="text"
          id="balance-box"
          class="form-control"
          autocomplete="off"
          ref="balanceInputBox"
          @input="setBalance"
          :disabled="isSpinning">
        <button
          class="btn btn-primary spin-button"
          @click="spin"
          :disabled="isSpinning || !currentBalance || !!(currentBalanceError)"
        >
          {{ !currentBalance && !isSpinning ? 'NO MONEY :(' : 'SPIN' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import ReelArea from '@/components/ReelArea.vue'
import PayTable from '@/components/PayTable.vue'

import { ReelUtils } from '@/utils/reel'
import { CommonUtils } from '@/utils/common'
import { LOSS_DECREMENT_STEP } from '@/constants'
import { Options, Vue } from 'vue-class-component'
import { PayTableComponent, ReelComponent } from '@/types'

@Options({
    components: {
        ReelArea,
        PayTable
    }
})
export default class App extends Vue {
    isSpinning = false
    currentBalance = 0
    currentBalanceError = ''
    pageTitle = process.env.VUE_APP_TITLE

    isNumericString(input: string): boolean {
        return CommonUtils.isNumericString(input)
    }

    setBalance(event: Event): void {
        const balanceInputBox = event.target as HTMLInputElement
        let value: string | number = balanceInputBox.value

        if (!this.isNumericString(value)) {
            this.currentBalanceError = 'Input must be positive numeric value between 1...5000'
            return
        }

        value = parseInt(balanceInputBox.value)
        if (value < 1 || value > 5000) {
            this.currentBalanceError = 'Input must be between 1...5000'
            return
        }
        this.currentBalanceError = ''
        this.currentBalance = value
    }

    get reelAreas(): Array<ReelComponent> {
        return [
            this.$refs.reelArea1 as ReelComponent,
            this.$refs.reelArea2 as ReelComponent,
            this.$refs.reelArea3 as ReelComponent
        ]
    }

    updateWinnings(incrementDecrementValue: number): void {
        this.currentBalance += incrementDecrementValue;
        (this.$refs.balanceInputBox as HTMLInputElement).value = this.currentBalance.toString()
    }

    async spin(): Promise<void> {
        this.isSpinning = true
        try {
            // Remove from balance
            this.updateWinnings(LOSS_DECREMENT_STEP)
            const spinInterval = ReelUtils.getIntervalStep()
            const payTable = this.$refs.payTable as PayTableComponent

            // Reset visual winning data (if there was something)
            payTable.clearPreviousWinningDataCells()
            this.reelAreas.forEach(reelArea => reelArea.resetWinLines())

            // Spin and wait results of spin
            const reelResults = await Promise.all(
                this.reelAreas.map((reelArea, index) => reelArea.spin(spinInterval, index))
            )
            const [totalWinnings, winningPositions] = payTable.calculateAndShowWinnings(reelResults)

            // add or subtract winnings
            this.updateWinnings(totalWinnings)
            // Show winning visually on reel (if there was something)
            this.reelAreas.forEach(reelArea => reelArea.setWinLines(winningPositions))
        } catch {
            // TODO: should not encounter one but in case of error atleast lock does not stay on
        } finally {
            this.isSpinning = false
        }
    }
}
</script>

<style lang="scss">
    @import "./assets/styles/main";
</style>

<style scoped lang="scss">
    @import "./assets/styles/variables";
    .page-title {
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
        position: fixed;
        font-size: 1.25rem;
        color: $main-color;
        background-color: $main-background-color;
        .page-title-label {
            font-style: italic;
            margin-left: 2rem;
        }
    }

    .slot-machine {
        min-width: fit-content;
    }

    .slot-machine-game-field-wrapper {
        display: flex;
        flex-wrap: wrap-reverse;
        justify-content: center;

        div {
            width: fit-content;
        }
    }

    .slot-machine-reel-wrapper {
        display: flex;
        padding: 1.5rem;
        min-width: 42rem;
        flex-direction: row;
        margin-bottom: 1rem;
        justify-content: center;

        div {
            &:first-child {
                border-top-left-radius: $main-border-radius;
                border-bottom-left-radius: $main-border-radius;
            }
            &:last-child {
              border-top-right-radius: $main-border-radius;
              border-bottom-right-radius: $main-border-radius;
            }
        }
    }

    .pay-table-wrapper {
        padding: 1.5rem;
        min-width: 42rem;
        margin-bottom: 1rem;
    }

    .control-panel {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .control-card {
            background-color: $main-background-color;
            color: $main-color;
            min-width: 27.5rem;
            padding: 1.5rem;

            #balance-box {
                margin-bottom: 1rem;
            }
            .spin-button {
                background-color: #bf1010;
                color: $secondary-color;
                border: none;
                padding: 1rem 0;
                &:hover {
                    background-color: #ec1818;
                }
            }
        }
    }

    .error-label {
        color: $indicator-color;
    }

    @media all and (min-width: 86rem) {
        .slot-machine-reel-wrapper {
            margin-right: 0.5rem;
        }

        .pay-table-wrapper {
            margin-left: 0.5rem;
        }
    }
</style>
