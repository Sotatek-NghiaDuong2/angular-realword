import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsIdComponent } from './posts-id.component';

describe('PostsIdComponent', () => {
  let component: PostsIdComponent;
  let fixture: ComponentFixture<PostsIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
