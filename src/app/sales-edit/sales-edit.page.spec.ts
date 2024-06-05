import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesEditPage } from './sales-edit.page';

describe('SalesEditPage', () => {
  let component: SalesEditPage;
  let fixture: ComponentFixture<SalesEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
