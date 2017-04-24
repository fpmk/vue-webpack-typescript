export default class MoneyFormatter {
  private static currencyMap = {
    USD: '$'
  }

  public static format(amount: number, currencyCode: string): string {
    return this.currencyMap[currencyCode] + amount.toFixed(2);
  }
}
