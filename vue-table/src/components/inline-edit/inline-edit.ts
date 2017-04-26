import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { Balance } from '../common.interface';
import MoneyFormatter from '../users-table/money-formatter.service';

@Component({
  template: require('./inline-edit.html')
})
export class InlineEditComponent extends Vue {

  @Prop()
  public balance: Balance;

  public cAmount: Balance = null;

  public edit: boolean = false;

  public created() {
    this.cAmount = { ...this.balance };
  }

  public toggleEdit() {
    this.edit = !this.edit;
  }

  public saveEdit() {
    this.$emit('balanceChanged', this.cAmount);
    this.toggleEdit();
  }

  public formatAmount(amount: number, currencyCode: string): string {
    if (this.edit) {
      return '';
    }
    return MoneyFormatter.format(+amount, currencyCode);
  }

  @Watch('balance')
  public rerenderMe() {
    this.cAmount = { ...this.balance };
  }
}
