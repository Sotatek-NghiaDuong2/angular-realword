import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../shared/services/post.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    <li [style.opacity]="post.isDeleting ? 0.5 : null">
      <a [routerLink]="['/posts', post.id]">{{ post.title }}</a>
      <button
        type="button"
        (click)="delete.emit(post.id)"
        [disabled]="post.isDeleting"
      >
        {{ post.isDeleting ? 'Deleting' : 'Delete' }}</button
      ><a
        [routerLink]="[post.isDeleting ? null : '/posts/edit']"
        [queryParams]="{ postId: post.id }"
      >
        <button type="button" [disabled]="post.isDeleting">Edit</button>
      </a>
    </li>
  `,
  styles: ``,
})
export class PostListItemComponent {
  @Input({ required: true }) post!: Post;
  @Output() delete = new EventEmitter<number>();
}
