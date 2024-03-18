import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';
import { PostListItemComponent } from './components/post-list-item/post-list-item.component';
import { PostService } from '../../../shared/services/post.service';

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
              @if (post.id !== deletePostMutation.variables()) {
                <app-post-list-item
                  [post]="post"
                  (delete)="handleDeletePost($event)"
                ></app-post-list-item>
              }
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
  #postService = inject(PostService);

  postsQuery = injectQuery(() => ({
    queryKey: ['PostService', 'getPosts', this.keyword()],
    queryFn: (context) => {
      const abort$ = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.#postService
          .getPosts({ q: this.keyword() })
          .pipe(takeUntil(abort$)),
      );
    },
  }));

  deletePostMutation = injectMutation((client) => ({
    mutationFn: (postId: number) =>
      lastValueFrom(this.#postService.deletePost(postId)),
    onSettled: () => {
      client.invalidateQueries({ queryKey: ['PostService', 'getPosts'] });
    },
  }));

  handleDeletePost(id: number) {
    this.deletePostMutation.mutate(id);
  }
}
