import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import {
  DataPostBody,
  PostService,
} from '../../../shared/services/post.service';
import { FormPostComponent } from '../components/form-post/form-post.component';

@Component({
  selector: 'app-posts-new',
  standalone: true,
  imports: [FormPostComponent],
  template: `
    <app-form-post
      (submit)="handleSubmit($event)"
      [status]="status()"
    ></app-form-post>
  `,
  styles: ``,
})
export class PostsNewComponent {
  #postService = inject(PostService);
  #queryClient = injectQueryClient();
  #router = inject(Router);

  status = computed(() => {
    switch (this.#createPostMutation.status()) {
      case 'pending':
        return 'Creating...';
      case 'error':
        return 'Something went wrong!';
      default:
        return '';
    }
  });

  #createPostMutation = injectMutation(() => ({
    mutationFn: (data: DataPostBody) =>
      lastValueFrom(this.#postService.createPost(data)),
  }));

  handleSubmit(data: DataPostBody) {
    this.#createPostMutation.mutate(data, {
      onSuccess: async () => {
        this.#queryClient.removeQueries({
          queryKey: ['PostService', 'getPosts'],
        });
        this.#router.navigate(['posts']);
      },
    });
  }
}
