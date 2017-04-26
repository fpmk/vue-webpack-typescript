import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ClickOutside } from './click-outside.directive';
import { TableColumn } from '../users-table/table-column.class';

@Component({
  template: require('./columns-dropdown.html'),
  directives: {
    ClickOutside
  }
})
export class ColumnsDropdownComponent extends Vue {

  @Prop()
  columns: any;

  @Prop()
  icon: string;

  @Prop()
  placeholder: string;

  public stateVisible: string = 'invisible';

  public toggleMenu() {
    this.stateVisible === 'visible' ? this.stateVisible = 'invisible' : this.stateVisible = 'visible';
  }

  public itemSelected(item, event) {
    let localItem: TableColumn = new TableColumn(item.id, item.title, !item.visible);
    this.$emit('columnChanged', localItem);
  }

  public hideDropdown(event) {
    this.stateVisible = 'invisible';
  }

}
