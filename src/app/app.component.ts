import { Component, OnInit } from '@angular/core';
import { Post } from './models/post';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.auth.autoAuthUser();
  }
}
