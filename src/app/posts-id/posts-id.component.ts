import { Component, Input, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-posts-id',
  standalone: true,
  imports: [],
  template: `
    @switch (postDetailsQuery.status()) {
      @case ('pending') {
        Loading...
      }
      @case ('error') {
        Fail to load
      }
      @case ('success') {
        <h3>{{ postDetailsQuery.data()?.title }}</h3>
        <p>{{ postDetailsQuery.data()?.content }}</p>
      }
    }
  `,
  styles: ``,
})
export class PostsIdComponent {
  @Input() postId: string = '';
  postService = inject(PostService);

  postDetailsQuery = injectQuery(() => ({
    queryKey: ['posts', 'details', this.postId],
    queryFn: () =>
      lastValueFrom(this.postService.getPostById(Number(this.postId))),
  }));
}
