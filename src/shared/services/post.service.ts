import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  getPosts(params: { q?: string }) {
    return this.http.get<Post[]>('posts', { params });
  }

  getPostById(id: number) {
    return this.http.get<Post>(`posts/${id}`);
  }

  deletePost(id: number) {
    return this.http.delete(`posts/${id}`);
  }

  createPost(data: DataPostBody) {
    return this.http.post('posts', data);
  }

  updatePost(id: number, data: DataPostBody) {
    return this.http.put(`posts/${id}`, data);
  }
}

// interface
export interface Post {
  content?: string;
  id: number;
  published?: boolean;
  title: string;
}

export interface DataPostBody extends Omit<Post, 'id'> {}
