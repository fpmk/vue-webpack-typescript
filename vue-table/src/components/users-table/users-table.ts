import Vue from 'vue';
import Component from 'vue-class-component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../common.interface';
import UserService from './users-table.service';
import MoneyFormatter from './money-formatter.service';
import { UserProfileComponent } from '../user-profile/user-profile';

@Component({
  template: require('./users-table.html'),
  components: {
    'user-profile': UserProfileComponent
  }
})
export class UsersTableComponent extends Vue {

  searchStringEvent: BehaviorSubject<string> = new BehaviorSubject(null);
  usersList: User[] = [];
  selectedUser: User = null;
  searchbox = {
    searching: false
  };
  paging = {
    totalPages: 1,
    currentPage: 1,
    rows: 10,
    pages: []
  };
  pageLoading: boolean = true;

  public loadUsers(limit: number, offset: number) {
    this.pageLoading = true;
    UserService.users(limit, offset)
               .then(
                 (res: any) => {
                   this.usersList = res.data.list;
                   this.buildPaging(res.data.count);
                   this.pageLoading = false;
                 }
               )
               .catch(
                 error => {
                   console.error(error);
                   this.pageLoading = false;
                 }
               );
  }

  public buildPaging(totalElements: number) {
    if (totalElements === 0) {
      return;
    }
    let pages = Math.ceil(totalElements / this.paging.rows);
    this.paging.totalPages = pages;
    Observable.range(1, pages)
              .toArray()
              .subscribe(
                res => {
                  this.paging.pages = res;
                }
              )
  }

  public prevPage() {
    if (this.paging.currentPage === 1) {
      return;
    }
    this.paging.currentPage--;
    this.loadUsers(this.paging.rows, this.paging.currentPage - 1);
  }

  public nextPage() {
    if (this.paging.currentPage === this.paging.totalPages) {
      return;
    }
    this.paging.currentPage++;
    this.loadUsers(this.paging.rows, this.paging.currentPage - 1);
  }

  public selectPage(page: number) {
    this.paging.currentPage = page;
    if (this.paging.currentPage < 1) {
      this.paging.currentPage = 1;
    }
    if (this.paging.currentPage > this.paging.totalPages) {
      this.paging.currentPage = this.paging.totalPages;
    }
    this.loadUsers(this.paging.rows, this.paging.currentPage - 1);
  }

  public search(event) {
    this.searchbox.searching = true;
    this.searchStringEvent.next(event.target.value);
  }

  public activateUser(user: User) {
    user.status = 'ACTIVE';
    this.updateUser(user);
  }

  public lockUser(user: User) {
    user.status = 'LOCKED';
    this.updateUser(user);
  }

  public updateUser(user: User) {
    UserService.updateUser(user)
               .then(
                 (usr: any) => {
                   user = usr;
                 }
               )
               .catch(
                 error => {
                   console.log(error);
                 }
               );
  }

  public editUser(user: User) {
    this.selectedUser = user;
  }

  public created() {
    this.searchStringEvent
        .asObservable()
        .filter(s => s != null)
        .distinctUntilChanged()
        .debounceTime(400)
        .subscribe(
          (res: string) => {
            if (res === '') {
              this.searchbox.searching = false;
              this.loadUsers(this.paging.rows, 0);
              return;
            }
            UserService.search(res)
                       .then(
                         (res: any) => {
                           this.searchbox.searching = false;
                           this.usersList = res.data.list;
                           this.buildPaging(res.data.count);
                         }
                       )
                       .catch(
                         error => {
                           console.log(error);
                         }
                       )
          }
        );
    this.$nextTick(() => {
      this.loadUsers(this.paging.rows, 0);
    });
  }

  public formatAmount(amount: number, currencyCode: string): string {
    return MoneyFormatter.format(amount, currencyCode);
  }

  public userUpdated(user: User) {
    Observable.from(this.usersList)
              .findIndex(
                (usr: User) => usr.id === user.id
              )
              .take(1)
              .subscribe(
                (res: number) => {
                  console.log(res);
                  this.usersList.splice(res, 1, user);
                }
              );
  }

  public deleteUser(user: User) {
    if (window.confirm("Delete?")) {
      UserService.deleteUser(user)
                 .then(
                   (res: any) => {
                     this.loadUsers(this.paging.rows, 0);
                   }
                 )
                 .catch(error => console.log(error))
    }
  }

}
