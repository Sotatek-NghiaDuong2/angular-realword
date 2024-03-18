import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsNewComponent } from './posts-new.component';

describe('PostsNewComponent', () => {
  let component: PostsNewComponent;
  let fixture: ComponentFixture<PostsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
