import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(private auth: AuthService) {
   }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.getStatus();
    this.authListenerSubs = this.auth.getAuthStatusListener()
    .subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  logout() {
    this.auth.logout();
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
