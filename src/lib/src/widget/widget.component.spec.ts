import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetComponent } from './widget.component';
import { DashboardEventsService } from '../_service/dashboard.service';

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;
  let dashboardService: DashboardEventsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetComponent ],
      providers: [ DashboardEventsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = {cols: 2, rows: 1, y: 0, x: 0, title: 'Cashflow Balance' };
    dashboardService = TestBed.get(DashboardEventsService);
    fixture.detectChanges();
  });

  it('expect the component to be created', () => {
    expect(component).toBeTruthy();
  });
});
