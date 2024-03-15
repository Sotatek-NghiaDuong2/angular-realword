import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import {
  DataCreatePost,
  PostService,
} from '../../shared/services/post.service';
import { Router } from '@angular/router';
import { FormPostComponent } from '../shared/components/form-post/form-post.component';

@Component({
  selector: 'app-posts-new',
  standalone: true,
  imports: [FormPostComponent],
  template: `
    <app-form-post
      (submit)="handleSubmit($event)"
      [status]="getStatusValue()"
    ></app-form-post>
  `,
  styles: ``,
})
export class PostsNewComponent {
  postService = inject(PostService);
  queryClient = injectQueryClient();
  router = inject(Router);

  createPostMutation = injectMutation(() => ({
    mutationFn: (data: DataCreatePost) =>
      lastValueFrom(this.postService.createPost(data)),
  }));

  handleSubmit(data: DataCreatePost) {
    this.createPostMutation.mutate(data, {
      onSuccess: async () => {
        this.queryClient.removeQueries({ queryKey: ['posts'] });
        this.router.navigate(['posts']);
      },
    });
  }

  getStatusValue() {
    switch (this.createPostMutation.status()) {
      case 'pending':
        return 'Creating...';
      case 'error':
        return 'Something went wrong!';
      default:
        return null;
    }
  }
}
