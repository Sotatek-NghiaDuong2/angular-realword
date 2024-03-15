import { Component, inject, signal } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
  queryOptions,
} from '@tanstack/angular-query-experimental';
import { Post, PostService } from '../../shared/services/post.service';
import { FormsModule } from '@angular/forms';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';
import { PostListItemComponent } from './components/post-list-item/post-list-item.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [FormsModule, PostListItemComponent, RouterLink],
  template: `
    <a routerLink="/posts/new">New Post</a>
    <input type="text" placeholder="Search..." [(ngModel)]="keyword" />
    <div>
      @switch (postsQuery.status()) {
        @case ('pending') {
          Loading...
        }
        @case ('error') {
          Fail to load
        }
        @case ('success') {
          <ul>
            @for (post of postsQuery.data(); track post.id) {
              <app-post-list-item
                [post]="post"
                (delete)="handleDeletePost($event)"
              ></app-post-list-item>
            } @empty {
              No Post
            }
          </ul>
        }
      }
    </div>
  `,
  styles: ``,
})
export class PostsComponent {
  keyword = signal('');
  postService = inject(PostService);
  queryClient = injectQueryClient();

  postsQueryOptions = queryOptions({
    queryKey: ['posts', this.keyword()],
    queryFn: (context) => {
      const abort$ = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.postService
          .getPosts({ q: this.keyword() })
          .pipe(takeUntil(abort$)),
      );
    },
  });

  postsQuery = injectQuery(() => this.postsQueryOptions);

  deletePostMutation = injectMutation((client) => ({
    mutationFn: (postId: number) =>
      lastValueFrom(this.postService.deletePost(postId)),
    onMutate: async (postId: number) => {
      await client.cancelQueries({ queryKey: this.postsQueryOptions.queryKey });
      const previousPosts =
        client.getQueryData(this.postsQueryOptions.queryKey) ?? [];

      const clonePreviousPosts: Post[] = JSON.parse(
        JSON.stringify(previousPosts),
      );

      if (clonePreviousPosts) {
        client.setQueryData(
          this.postsQueryOptions.queryKey,
          clonePreviousPosts.map((post) => {
            if (post.id === postId) {
              post.isDeleting = true;
            }
            return post;
          }),
        );
      }

      return { previousPosts };
    },
    onSettled: (
      postId,
      error,
      variables: number,
      context?: { previousPosts: Post[] | undefined },
    ) => {
      if (!error) {
        client.invalidateQueries({ queryKey: this.postsQueryOptions.queryKey });
        return;
      }

      if (context?.previousPosts) {
        client.setQueryData(
          this.postsQueryOptions.queryKey,
          context.previousPosts,
        );
      }
    },
  }));

  handleDeletePost(id: number) {
    this.deletePostMutation.mutate(id);
  }
}
