import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./posts/posts.component').then((c) => c.PostsComponent),
  },
  {
    path: 'posts/new',
    loadComponent: () =>
      import('./posts-new/posts-new.component').then(
        (c) => c.PostsNewComponent
      ),
  },
  {
    path: 'posts/edit',
    loadComponent: () =>
      import('./posts-edit/posts-edit.component').then(
        (c) => c.PostsEditComponent
      ),
  },
  {
    path: 'posts/:postId',
    loadComponent: () =>
      import('./posts-id/posts-id.component').then((c) => c.PostsIdComponent),
  },
];
