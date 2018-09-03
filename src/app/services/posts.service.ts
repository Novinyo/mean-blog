import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount: number}>();

  constructor(private _http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
   return this._http
   .get<{message: string, posts:any, maxPosts: number }>
     (`http://localhost:3000/api/posts${queryParams}`)
     .pipe(
       map((postData) => {
          return {
            posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagepath: post.imagePath
            }
          }), maxPosts: postData.maxPosts
        };
       })
     )
   .subscribe((results) => {
    this.posts = results.posts;
    this.postsUpdated.next({
      posts:[...this.posts],
      postCount: results.maxPosts
    });
   });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this._http.
    get<{_id:string,
       title: string,
       content: string,
       imagePath: string }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
     this
     ._http.post<{message: string, returnedPost: Post}>(`http://localhost:3000/api/posts`,
      postData)
     .subscribe(
       (res) => {
         this.router.navigate(['/']);
       }
    );
  }

  deletePost(postId: string) {
    return this._http.delete(`http://localhost:3000/api/posts/${postId}`);
    // .subscribe(() => {
    //   const updatedPosts = this.posts.filter(post => post.id !== postId);

    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...this.posts]);
    // });
  }

  updatePost(id: string, post: Post, image: File | string) {
    let postData: Post | FormData;

    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", post.id);
      postData.append("title", post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    } else {
      postData = post;
      postData.imagePath = image;
    }
    this._http.put(`http://localhost:3000/api/posts/${id}`, postData)
    .subscribe( response => {
      this.router.navigate(['/']);
    });
  }
}
