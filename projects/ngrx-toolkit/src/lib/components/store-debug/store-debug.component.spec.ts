import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDebugComponent } from './store-debug.component';

describe('StoreDebugComponent', () => {
  let component: StoreDebugComponent;
  let fixture: ComponentFixture<StoreDebugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoreDebugComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
