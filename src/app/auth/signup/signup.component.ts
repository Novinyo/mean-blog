import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthData } from '../../models/auth-data';
import { Subscription } from 'rxjs';
import { UserValidators } from './auth.validators';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls:['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {

    isLoading = false;
    private authStatusSub: Subscription;

    form = new FormGroup({
            'email': new FormControl('', [
                Validators.required,
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,7}$')
            ],
            [UserValidators.shouldBeUnique(this.auth)]
        ),
        
        'password': new FormControl('',
        [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
            UserValidators.mustContains
        ]),
        'confPassword': new FormControl('',
         Validators.required)
    }, {
        validators: UserValidators.passwordmatch
    });

    constructor(public auth: AuthService) { }

    ngOnInit() { 
        this.authStatusSub = this.auth.getAuthStatusListener()
        .subscribe( authStatus => {
            this.isLoading = false;
        });
    }

    onSignup() {
        if(this.form.invalid) {
            return;
        }
        const authData: AuthData = {
            email: this.form.value.email,
            password: this.form.value.password
        };
        this.isLoading = true;
        this.auth.createUser(authData);
    }
    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    // Getters
    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    get confPassword() {
        return this.form.get('confPassword');
    }
}