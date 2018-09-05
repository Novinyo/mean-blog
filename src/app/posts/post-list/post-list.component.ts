import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [ 5, 10, 20];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private _postService: PostsService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this._postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.auth.getUserId();
    this.postsSub = this._postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.userIsAuthenticated = this.auth.getStatus();
    this.authStatusSub = this.auth.getAuthStatusListener()
    .subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.auth.getUserId();
      }
    );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangedPage(event:PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this._postService.getPosts(this.postsPerPage,
       this.currentPage);
    
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this._postService.deletePost(postId)
    .subscribe(() => {
      this._postService
      .getPosts(this.postsPerPage,
         this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

}
