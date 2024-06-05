import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiayaAddPage } from './biaya-add.page';

describe('BiayaAddPage', () => {
  let component: BiayaAddPage;
  let fixture: ComponentFixture<BiayaAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiayaAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
