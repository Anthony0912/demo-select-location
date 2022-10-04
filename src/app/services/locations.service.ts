import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import Location from 'src/app/interfaces/location.interface';
import Data from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  private url: string = 'https://api.pruebayerror.com/locaciones/v1';

  constructor(private http: HttpClient) { }

  public obtenerProvincias(): Observable<Data<Location>> {
    return this.http.get<Data<Location>>(`${this.url}/provincias`);
  }
  
  public obtenerCantones(provincia:number): Observable<Data<Location>> {
    if (!provincia) {
      return of();
    }
    return this.http.get<Data<Location>>(`${this.url}/provincia/${provincia}/cantones`);
  }
  
  public obtenerDistritos(provincia:number, canton: number): Observable<Data<Location>> {
    if (!provincia || !canton) {
      return of();
    }
    return this.http.get<Data<Location>>(`${this.url}/provincia/${provincia}/canton/${canton}/distritos`);
  }
}
