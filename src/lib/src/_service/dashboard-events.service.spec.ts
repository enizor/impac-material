import { TestBed, inject } from '@angular/core/testing';

import { DashboardEventsService } from './dashboard-events.service';

describe('DashboardEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardEventsService]
    });
  });

  it('should be created', inject([DashboardEventsService], (service: DashboardEventsService) => {
    expect(service).toBeTruthy();
  }));

  it('should publish an observable', inject([DashboardEventsService], (service: DashboardEventsService) => {
    service.widgetRedrew$.subscribe();

    expect(service.widgetSource.observers.length).toBe(1);
  }));
});
