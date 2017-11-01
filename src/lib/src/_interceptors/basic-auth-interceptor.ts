import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor() {}

  // Intercept every requests and attach headers
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = 'Basic ' + btoa('ea461720-b044-0132-dba6-600308937d74' + ':' + 'dPhCSjZCJ68I2cQLzCBtTg');
    const headers = new HttpHeaders({'Content-Type': 'application/json'}).set('authorization', auth);
    request = request.clone({ headers: headers });
    return next.handle(request);
  }
}
