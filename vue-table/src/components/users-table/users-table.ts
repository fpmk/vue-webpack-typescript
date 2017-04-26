import Vue from 'vue';
import Component from 'vue-class-component';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Balance, User } from '../common.interface';
import UserService from './users-table.service';
import { UserProfileComponent } from '../user-profile/user-profile';
import { TableColumn } from './table-column.class';
import { ColumnsDropdownComponent } from '../columns-dropdown/columns-dropdown';
import { InlineEditComponent } from '../inline-edit/inline-edit';
import MoneyFormatter from './money-formatter.service';

@Component({
  template: require('./users-table.html'),
  components: {
    'user-profile': UserProfileComponent,
    'inline-edit': InlineEditComponent,
    'columns-dropdown': ColumnsDropdownComponent
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
  tableCols =
    {
      id: new TableColumn('id', 'Id', true),
      // fullName: new TableColumn('fullName', 'Full name', true),
      balance: new TableColumn('balance', 'Balance', true),
      receiveNews: new TableColumn('receiveNews', 'Receive news', true),
      status: new TableColumn('status', 'Status', true),
    };
  tableColsCount: number = Object.keys(this.tableCols).length + 2;
  summary: any = {};

  sortListEvent: BehaviorSubject<string> = new BehaviorSubject(null);
  sortFields = {
    'id': {
      sort: ''
    },
    'fullName': {
      sort: ''
    },
    'balance': {
      sort: ''
    },
    'receiveNews': {
      sort: ''
    },
    'status': {
      sort: ''
    },
  };

  sortUsersList(field: string) {
    if (field === '' || field === null) {
      return;
    }
    for (let key in this.sortFields) {
      if (key === field) {
        continue;
      }
      this.sortFields[ key ].sort = '';
    }
    this.sortFields[ field ].sort = this.sortFields[ field ].sort === 'ascending' ? 'descending' : 'ascending';

    let commonSort = (a: User, b: User) => {
      if (a[ field ] < b[ field ]) {
        return this.sortFields[ field ].sort === 'ascending' ? -1 : 1;
      } else if (a[ field ] > b[ field ]) {
        return this.sortFields[ field ].sort === 'descending' ? -1 : 1;
      }
      return 0;
    };
    if (field === 'balance') {
      commonSort = (a: User, b: User) => {
        if (a[ field ].amount < b[ field ].amount) {
          return this.sortFields[ field ].sort === 'ascending' ? -1 : 1;
        } else if (a[ field ].amount > b[ field ].amount) {
          return this.sortFields[ field ].sort === 'descending' ? -1 : 1;
        }
        return 0;
      };
    }
    if (field === 'fullName') {
      commonSort = (a: User, b: User) => {
        let sortA = a.firstName + ' ' + a.lastName;
        let sortB = b.firstName + ' ' + b.lastName;
        if (sortA < sortB) {
          return this.sortFields[ field ].sort === 'ascending' ? -1 : 1;
        } else if (sortA > sortB) {
          return this.sortFields[ field ].sort === 'descending' ? -1 : 1;
        }
        return 0;
      };
    }
    this.usersList = this.usersList.sort(
      commonSort
    );
  }

  sort(field: string) {
    this.sortListEvent.next(field);
  }

  public loadUsers(limit: number, offset: number) {
    this.pageLoading = true;
    UserService.users(limit, offset)
               .then(
                 (res: any) => {
                   this.usersList = res.data.list;
                   this.totalSum();
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

  private totalSum() {
    Observable.from(this.usersList)
              .groupBy(
                user => user.balance.currency
              )
              .flatMap(group => {
                return group.reduce((acc, currentValue) => {
                  acc.amount += +currentValue.balance.amount;
                  acc.currency = currentValue.balance.currency;
                  return acc;
                }, { amount: 0, currency: '' })
              })
              .toArray()
              .subscribe(
                res => {
                  this.summary = res;
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
    this.loadUsers(this.paging.rows, (this.paging.currentPage - 1) * this.paging.rows);
  }

  public nextPage() {
    if (this.paging.currentPage === this.paging.totalPages) {
      return;
    }
    this.paging.currentPage++;
    this.loadUsers(this.paging.rows, (this.paging.currentPage - 1) * this.paging.rows);
  }

  public selectPage(page: number) {
    this.paging.currentPage = page;
    if (this.paging.currentPage < 1) {
      this.paging.currentPage = 1;
    }
    if (this.paging.currentPage > this.paging.totalPages) {
      this.paging.currentPage = this.paging.totalPages;
    }
    this.loadUsers(this.paging.rows, (this.paging.currentPage - 1) * this.paging.rows);
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
                   this.totalSum();
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
    this.sortListEvent.asObservable()
        .filter(s => s != '')
        .subscribe(
          res => this.sortUsersList(res)
        );
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

  public columnChanged(col: TableColumn) {
    this.tableCols[ col.id ] = col;
    Observable.from(Object.keys(this.tableCols))
              .map(key => this.tableCols[ key ].visible)
              .filter(v => v)
              .count()
              .subscribe(
                res => this.tableColsCount = res + 2
              );
  }

  public balanceChanged(bal: Balance, user:User) {
    user.balance = bal;
    this.updateUser(user);
  }

  public formatAmount(amount: number, currencyCode: string): string {
    return MoneyFormatter.format(+amount, currencyCode);
  }

}
