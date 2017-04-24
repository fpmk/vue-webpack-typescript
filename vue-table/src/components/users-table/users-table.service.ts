import axios, { AxiosPromise } from 'axios';
import { User } from '../common.interface';

export default class UserService {

  static api = 'http://localhost:8989/api';

  static users(limit: number = 10, offset: number = 0): AxiosPromise {
    let params = {
      limit: limit,
      offset: offset
    };
    return axios.get(this.api + '/users', { params: params });
  }

  static search(query: string): AxiosPromise {
    let params = {
      q: query
    };
    return axios.get(this.api + '/search', { params: params });
  }

  static updateUser(user: User): AxiosPromise {
    let headers = {
      'Content-Type': 'application/json'
    };
    return axios.post(this.api + '/users/' + user.id, user, { headers: headers });
  }

  static deleteUser(user: User): AxiosPromise {
    let headers = {
      'Content-Type': 'application/json'
    };
    return axios.delete(this.api + '/users/' + user.id, { headers: headers });
  }
}
