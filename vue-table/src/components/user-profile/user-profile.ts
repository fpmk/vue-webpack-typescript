import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import Datepicker from 'vuejs-datepicker';
import { User } from '../common.interface';
import UserService from '../users-table/users-table.service';
import { AxiosPromise } from 'axios';

@Component({
  template: require('./user-profile.html'),
  components: {
    Datepicker
  }
})
export class UserProfileComponent extends Vue {

  @Prop()
  public selectedUser: User;

  public user: User = null;

  public close() {
    this.user = null;
  }

  @Watch('selectedUser')
  public change(newVal: User, oldVal: User) {
    this.user = { ...newVal };
  }

  public convertBirthdate(b: number): Date {
    return new Date(b);
  }

  public setDate(date) {
    this.user.birthdate = date.getTime();
  }

  public updateUser() {
    UserService.updateUser(this.user)
      .then(
        (res: any) => {
          console.log(res.data);
          this.$emit('userUpdated', res.data);
          this.user = null;
        }
      )
      .catch(error => console.log(error));
  }
}
