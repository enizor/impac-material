import { TestBed, inject } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService]
    });
  });

  it('should be created', inject([DashboardService], (service: DashboardService) => {
    expect(service).toBeTruthy();
  }));

  it('should publish an observable', inject([DashboardService], (service: DashboardService) => {
    service.widgetRedrew$.subscribe();

    expect(service.widgetSource.observers.length).toBe(1);
  }));
});
