import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
    private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot):
          boolean | Observable<boolean> {
            const isAuth = this.auth.getStatus();
            if(!isAuth) {
                this.router.navigate(['/login']);
            }
            return true;
    }
}