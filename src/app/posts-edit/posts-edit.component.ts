import { Component, Input, inject, signal } from '@angular/core';
import { FormPostComponent } from '../shared/components/form-post/form-post.component';
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

@Component({
  selector: 'app-posts-edit',
  standalone: true,
  imports: [FormPostComponent],
  template: `
    @switch (postDetailsQuery.status()) { @case ('pending') { Loading... } @case
    ('error') { Fail to load } @case ('success') {
    <app-form-post
      [defaultValues]="{
        title: postDetailsQuery.data()?.title ?? '',
        content: postDetailsQuery.data()?.content
      }"
      (submit)="handleSubmit($event)"
      buttonSubmitLabel="Update"
      [status]="getStatusValue()"
    ></app-form-post>
    } }
  `,
  styles: ``,
})
export class PostsEditComponent {
  @Input() postId: string = '';

  queryClient = injectQueryClient();
  router = inject(Router);
  postService = inject(PostService);

  postDetailsQuery = injectQuery(() => ({
    queryKey: ['posts', this.postId],
    queryFn: () =>
      lastValueFrom(this.postService.getPostById(Number(this.postId))),
  }));

  updatePostMutation = injectMutation(() => ({
    mutationFn: (data: DataCreatePost) =>
      lastValueFrom(this.postService.updatePost(Number(this.postId), data)),
  }));

  handleSubmit(data: DataCreatePost) {
    this.updatePostMutation.mutate(data, {
      onSuccess: () => {
        this.queryClient.removeQueries({ queryKey: ['posts'] });
        this.router.navigate(['posts']);
      },
    });
  }

  getStatusValue() {
    switch (this.updatePostMutation.status()) {
      case 'pending':
        return 'Updating...';
      case 'error':
        return 'Something went wrong!';
      default:
        return null;
    }
  }
}
