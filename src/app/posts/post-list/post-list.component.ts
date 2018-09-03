import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts:Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;

  constructor(private _postService: PostsService) {}

  ngOnInit() {
    this._postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this._postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
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
    });
  }

}
