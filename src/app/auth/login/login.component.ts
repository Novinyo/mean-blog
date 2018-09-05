 import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthData } from '../../models/auth-data';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;

    constructor(public auth: AuthService) { }

    ngOnInit() { 
        this.authStatusSub = this.auth.getAuthStatusListener()
        .subscribe( authStatus => {
            this.isLoading = false;
        });
    }

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

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }
}
