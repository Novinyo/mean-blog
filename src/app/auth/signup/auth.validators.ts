import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth.service";

export class UserValidators {
    static mustContains(control: AbstractControl): ValidationErrors | null {
        const password = (control.value as string);
        if(password.indexOf(' ') >= 0) {
            return {passError: true}
        }
        return null;
    }

    static shouldBeUnique (auth: AuthService): AsyncValidatorFn {
      return  (control: AbstractControl): Promise<ValidationErrors | null> |
        Observable<ValidationErrors | null> => {
            return auth.checkEmail(control.value).then(
                user => {
                    return (user.message === '1')? {"emailExists": true}: null;
                }
            );
        }
    }

    static passwordmatch(control: AbstractControl) {
        let password = control.get('password');
        let confirm = control.get('confPassword');

        if(password.value !== confirm.value) 
            return {passwordmatch: true};
        
        return null;
    }
}