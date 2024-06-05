import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesCustAddPage } from './sales-cust-add.page';

describe('SalesCustAddPage', () => {
  let component: SalesCustAddPage;
  let fixture: ComponentFixture<SalesCustAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCustAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
