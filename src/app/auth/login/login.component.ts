 import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthData } from '../../models/auth-data';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit {
    isLoading = false;
    constructor(public auth: AuthService) { }

    ngOnInit() { }
    
    onLogin(form: NgForm) {
        if(form.invalid) {
            return;
        }
        const authData: AuthData = {
            email: form.value.email,
            password: form.value.password
        };
        this.isLoading = true;
        this.auth.login(authData);
    }
}
