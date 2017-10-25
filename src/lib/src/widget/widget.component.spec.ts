import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { DashboardService } from '../_service/dashboard.service';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;
  let dashboardService: DashboardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetComponent ],
      providers: [ DashboardService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = {cols: 2, rows: 1, y: 0, x: 0, title: 'Cashflow Balance' };
    dashboardService = TestBed.get(DashboardService);
    fixture.detectChanges();
  });

  it('expect the component to be created', () => {
    expect(component).toBeTruthy();
  });
});
