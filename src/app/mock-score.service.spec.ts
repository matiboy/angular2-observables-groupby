/* tslint:disable:no-unused-variable */

import { addProviders, async, inject } from '@angular/core/testing';
import { MockScoreService } from './mock-score.service';

describe('Service: MockChat', () => {
  beforeEach(() => {
    addProviders([MockScoreService]);
  });

  it('should ...',
    inject([MockScoreService],
      (service: MockScoreService) => {
        expect(service).toBeTruthy();
      }));
});
