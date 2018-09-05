import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../models/post';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mine-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
 
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: ArrayBuffer|string;
  private authStatusSub: Subscription;

  constructor(private _postService: PostsService,
     public route: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener()
    .subscribe(status => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators:[Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
        })
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        
        this._postService.getPost(this.postId)
        .subscribe(data => {
          this.isLoading = false;
          this.post = {
            id: data._id,
            title: data.title, 
            content: data.content,
            imagePath: data.imagePath,
            creator: data.creator
          };
          

           this.form.setValue({
             'title': this.post.title,
             'content': this.post.content,
             'image': this.post.imagePath
           });

           this.imagePreview = this.post.imagePath
        });
        
        
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image,
      creator: null
    };
    
    if (this.mode === 'create') {
      this._postService.addPost(post, this.form.value.image);
    } else {
      post.id = this.postId;
      this._postService.updatePost(this.postId, post, this.form.value.image);
    }
    
    this.form.reset();
  }

  onImagePicked(event: Event) {
    
    const file = (event.target as HTMLInputElement).files[0];
    
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    
    reader.readAsDataURL(file);
    
    
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
