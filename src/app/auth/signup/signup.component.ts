import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthData } from '../../models/auth-data';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent implements OnInit {
    
    isLoading = false;

    constructor(public auth: AuthService) { }

    ngOnInit() { }

    onSignup(form: NgForm) {
        if(form.invalid) {
            return;
        }
        const authData: AuthData = {
            email: form.value.email,
            password: form.value.password
        };
        this.isLoading = true;
        this.auth.createUser(authData);
    }
}