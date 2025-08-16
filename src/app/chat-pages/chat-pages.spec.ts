import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPages } from './chat-pages';

describe('ChatPages', () => {
  let component: ChatPages;
  let fixture: ComponentFixture<ChatPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
