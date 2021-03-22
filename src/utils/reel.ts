import {
    MINIMUM_REEL_SPIN_TIME,
    NEXT_REEL_SPIN_TIME_STEP
} from '@/constants'

export class ReelUtils {
    static getIntervalStep(max = 14, min = 8): number {
        return Math.floor(Math.random() * (max - min)) + min
    }

    static calculateSpinTime(step: number): number {
        // step starts from 0
        return MINIMUM_REEL_SPIN_TIME + (step * NEXT_REEL_SPIN_TIME_STEP)
    }
}
