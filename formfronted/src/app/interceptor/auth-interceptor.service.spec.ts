import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './auth-interceptor.service';

describe('AuthInterceptorService', () => {
  let service: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
