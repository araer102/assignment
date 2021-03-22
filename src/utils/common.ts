const ONLY_NUMERIC_PATTER = /^\d+$/

export class CommonUtils {
    static isNumericString(input: string): boolean {
        return ONLY_NUMERIC_PATTER.test(input)
    }
}
