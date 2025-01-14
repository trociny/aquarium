/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LocalNodeService, StatusStageEnum } from '~/app/shared/services/api/local.service';
import { StatusRouteGuardService } from '~/app/shared/services/status-route-guard.service';
import DoneCallback = jest.DoneCallback;

const fakeRouterStateSnapshot = (url: string): RouterStateSnapshot =>
  ({
    url
  } as RouterStateSnapshot);

describe('StatusRouteGuardService', () => {
  let service: StatusRouteGuardService;
  let localNodeService: LocalNodeService;
  let router: Router;
  let httpTestingController: HttpTestingController;
  let urlTree: (url: string) => UrlTree;

  const activatedRouteSnapshot = {} as ActivatedRouteSnapshot;

  const expectRouting = (
    url: string,
    status: StatusStageEnum,
    result: boolean | UrlTree,
    done: DoneCallback
  ) => {
    jest
      .spyOn(localNodeService, 'status')
      .mockReturnValue(of({ inited: true, node_stage: status }));
    service.canActivate(activatedRouteSnapshot, fakeRouterStateSnapshot(url)).subscribe((res) => {
      expect(res).toEqual(result);
      done();
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusRouteGuardService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });

    service = TestBed.inject(StatusRouteGuardService);
    localNodeService = TestBed.inject(LocalNodeService);
    router = TestBed.inject(Router);
    httpTestingController = TestBed.inject(HttpTestingController);

    urlTree = (url: string) => router.parseUrl(url);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should redirect', (done) => {
    expectRouting('/foo', StatusStageEnum.none, urlTree('/installer'), done);
  });

  it('should redirect with error', (done) => {
    const url = '/foo';
    service.canActivate(activatedRouteSnapshot, fakeRouterStateSnapshot(url)).subscribe((res) => {
      expect(res).toBeTruthy();
      done();
    });
    httpTestingController
      .expectOne('api/local/status')
      .error(new ErrorEvent('Unknown Error'), { status: 500 });
    httpTestingController.verify();
  });

  it('should not redirect [bootstrapping]', (done) => {
    expectRouting('/installer/create', StatusStageEnum.bootstrapping, true, done);
  });

  it('should redirect [bootstrapping]', (done) => {
    expectRouting(
      '/installer/welcome',
      StatusStageEnum.bootstrapping,
      urlTree('/installer/create'),
      done
    );
  });

  it('should not redirect [bootstrapped]', (done) => {
    expectRouting('/installer/create', StatusStageEnum.bootstrapped, true, done);
  });

  it('should not redirect [bootstrapped] on dashboard', (done) => {
    expectRouting('/dashboard', StatusStageEnum.bootstrapped, true, done);
  });

  it('should redirect [bootstrapped]', (done) => {
    expectRouting(
      '/installer/install-mode',
      StatusStageEnum.bootstrapped,
      urlTree('/installer/create'),
      done
    );
  });

  it('should redirect [ready]', (done) => {
    expectRouting('/bar', StatusStageEnum.ready, urlTree('/dashboard'), done);
  });

  it('should not redirect [none,1]', (done) => {
    expectRouting('/installer/install-mode', StatusStageEnum.none, true, done);
  });

  it('should not redirect [none,2]', (done) => {
    expectRouting('/installer/create/wizard', StatusStageEnum.none, true, done);
  });

  it('should redirect [none]', (done) => {
    expectRouting('/baz', StatusStageEnum.none, urlTree('/installer'), done);
  });
});
