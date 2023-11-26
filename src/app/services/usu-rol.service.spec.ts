import { TestBed } from '@angular/core/testing';

import { UsuRolService } from './usu-rol.service';

describe('UsuRolService', () => {
  let service: UsuRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
