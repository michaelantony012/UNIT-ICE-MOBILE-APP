import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiayaEditPage } from './biaya-edit.page';

describe('BiayaEditPage', () => {
  let component: BiayaEditPage;
  let fixture: ComponentFixture<BiayaEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiayaEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
