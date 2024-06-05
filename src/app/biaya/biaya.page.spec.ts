import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiayaPage } from './biaya.page';

describe('BiayaPage', () => {
  let component: BiayaPage;
  let fixture: ComponentFixture<BiayaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BiayaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
