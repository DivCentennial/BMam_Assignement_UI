import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutboxComponent } from './logoutbox.component';

describe('LogoutboxComponent', () => {
  let component: LogoutboxComponent;
  let fixture: ComponentFixture<LogoutboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoutboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
