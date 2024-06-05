import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesCustEditPage } from './sales-cust-edit.page';

describe('SalesCustEditPage', () => {
  let component: SalesCustEditPage;
  let fixture: ComponentFixture<SalesCustEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCustEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
