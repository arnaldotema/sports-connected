﻿import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from "../_models/user";
import {UserService} from './user.service';


@Injectable()
export class AuthenticationService {
  public token: string;
  public admin: boolean;
  public testing: boolean = false;
  private logged: boolean = false;

  requestOptions;

  session_user : User;

  constructor(private http: HttpClient, private userService: UserService) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.admin = currentUser && currentUser.admin;
    this.requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getSessionUser(): Observable<User> {
    return this.userService.getSessionUser();
  }

  login(username: string, password: string): Observable<boolean> {
    if (this.testing) {
      if (username === 'user') {
        localStorage.setItem('currentUser', JSON.stringify(
          {email: username, token: '', admin: false}));
        this.token = '';
        this.admin = false;
        this.logged = true;
        return of(true);
      }
      else if (username === 'admin') {
        localStorage.setItem('currentUser', JSON.stringify(
          {username: username, token: '', admin: true}));
        this.token = '';
        this.admin = true;
        this.logged = true;
        return of(true);
      }
      else {
        return of(false);
      }
    }
    else {
      return this.http.post<any>('/users/login', JSON.stringify({email: username, password: password}), this.requestOptions)
        .map((json: any) => {
          // login successful if there's a jwt token in the response
          if (json.token) {
            // set token property
            this.token = json.token;
            //this.admin = json.admin;

            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(
              {username: username, token: json.token, admin: json.admin}
            ));
            this.logged = true;
            // return true to indicate successful login
            return true;
          } else {
            // return false to indicate failed login
            return false;
          }
        });
    }
  }

  signup(username: string, password: string): Observable<boolean> {
      return this.http.post<any>('/users', JSON.stringify({email: username, password: password}), this.requestOptions)
        .map((json: any) => {
          // login successful if there's a jwt token in the response
          if (json.token) {
            // set token property
            this.token = json.token;
            //this.admin = json.admin;

            // store username and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(
              {username: username, token: json.token, admin: json.admin}
            ));
            this.logged = true;
            // return true to indicate successful login
            return true;
          } else {
            // return false to indicate failed login
            return false;
          }
        });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    this.admin = null;
    this.logged = false;
    localStorage.removeItem('currentUser');
  }

  isLogged(): boolean {
    return localStorage.getItem('currentUser') != null;
  }
}
