import { TestBed } from '@angular/core/testing';

import { HelpSidebarService } from './help-sidebar.service';

describe('HelpSidebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelpSidebarService = TestBed.get(HelpSidebarService);
    expect(service).toBeTruthy();
  });
});
