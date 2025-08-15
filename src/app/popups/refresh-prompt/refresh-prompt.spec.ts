import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshPrompt } from './refresh-prompt';

describe('RefreshPrompt', () => {
  let component: RefreshPrompt;
  let fixture: ComponentFixture<RefreshPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
