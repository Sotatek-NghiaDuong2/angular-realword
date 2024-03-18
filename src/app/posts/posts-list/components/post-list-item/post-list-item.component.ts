import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../../../shared/services/post.service';

@Component({
  selector: 'app-post-list-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    <li>
      <a [routerLink]="['/posts', post.id]">{{ post.title }}</a>
      <button type="button" (click)="delete.emit(post.id)">Delete</button
      ><a [routerLink]="['/posts/edit']" [queryParams]="{ postId: post.id }">
        <button type="button">Edit</button>
      </a>
    </li>
  `,
  styles: ``,
})
export class PostListItemComponent {
  @Input({ required: true }) post!: Post;
  @Output() delete = new EventEmitter<number>();
}
