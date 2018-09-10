import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
  }

  login() {
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/user-info/-1']);
        } else {
          this.error = 'Nome de usuário ou palavra passe incorretos';
        }
      });
  }
}
