import { Component, Input, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import {
  DataPostBody,
  PostService,
} from '../../../shared/services/post.service';
import { FormPostComponent } from '../components/form-post/form-post.component';

@Component({
  selector: 'app-posts-edit',
  standalone: true,
  imports: [FormPostComponent],
  template: `
    @switch (postDetailsQuery.status()) {
      @case ('pending') {
        Loading...
      }
      @case ('error') {
        Fail to load
      }
      @case ('success') {
        <app-form-post
          [defaultValues]="{
            title: postDetailsQuery.data()?.title ?? '',
            content: postDetailsQuery.data()?.content
          }"
          (submit)="handleSubmit($event)"
          buttonSubmitLabel="Update"
          [status]="status()"
        ></app-form-post>
      }
    }
  `,
  styles: ``,
})
export class PostsEditComponent {
  @Input() postId: string = '';

  #queryClient = injectQueryClient();
  #router = inject(Router);
  #postService = inject(PostService);

  status = computed(() => {
    switch (this.#updatePostMutation.status()) {
      case 'pending':
        return 'Updating...';
      case 'error':
        return 'Something went wrong!';
      default:
        return '';
    }
  });

  postDetailsQuery = injectQuery(() => ({
    queryKey: ['PostService', 'getPostById', this.postId],
    queryFn: () =>
      lastValueFrom(this.#postService.getPostById(Number(this.postId))),
  }));

  #updatePostMutation = injectMutation(() => ({
    mutationFn: (data: DataPostBody) =>
      lastValueFrom(this.#postService.updatePost(Number(this.postId), data)),
  }));

  handleSubmit(data: DataPostBody) {
    this.#updatePostMutation.mutate(data, {
      onSuccess: () => {
        this.#queryClient.removeQueries({
          queryKey: ['PostService', 'getPosts'],
        });
        this.#router.navigate(['posts']);
      },
    });
  }
}
