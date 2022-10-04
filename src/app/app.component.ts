import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, tap, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { LocationsService } from './services/locations.service';

import Data from 'src/app/interfaces/data.interface';
import Location from 'src/app/interfaces/location.interface';
import ErrorService from 'src/app/interfaces/error-service.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private provincias: Location[] = [];
  private cantones: Location[] = [];
  private distritos: Location[] = [];
  private subscription!: Subscription;
  private errorService: ErrorService = {
    provincia: {
      error: '',
      enabledError: false
    },
    canton: {
      error: '',
      enabledError: false
    },
    distrito: {
      error: '',
      enabledError: false
    }
  };

  public myForm: FormGroup = this.fb.group({
    provincia: ['', Validators.required],
    canton: ['', Validators.required],
    distrito: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private locationsService: LocationsService) { }

  ngOnInit(): void {
    this.canton.disable();
    this.distrito.disable();
    this.obtenerProvincias();
    this.cargarCantonesYDistritos();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private obtenerProvincias(): void {
    this.subscription = this.locationsService.obtenerProvincias().subscribe({
      next: (provincias: Data<Location>) => {
        this.provincias = provincias?.data ?? [];
      },
      error: (err) => {
        this.errorService.provincia.enabledError = true;
        this.errorService.provincia.error = err.message as string;

      }
    });
  }

  private cargarCantonesYDistritos(): void {
    this.provincia?.valueChanges.pipe(tap((_) => {
      this.canton?.reset('');
      this.provincia.valid ? this.canton.enable() : this.canton.disable();
    }),
      switchMap((provincia: number) => this.locationsService.obtenerCantones(provincia))).subscribe({
        next: (cantones: Data<Location>) => {
          this.cantones = cantones.data;
        },
        error: (err) => {
          this.errorService.canton.enabledError = true;
          this.errorService.canton.error = err.message as string;
        }
      });

    this.canton?.valueChanges.pipe(tap((_) => {
      this.distrito?.reset('');
      this.canton.valid ? this.distrito.enable() : this.distrito.disable();
    }),
      switchMap((canton: number) => this.locationsService.obtenerDistritos(this.provincia.value, canton))).subscribe({
        next: (distritos: Data<Location>) => {
          this.distritos = distritos.data;
        },
        error: (err) => {
          this.errorService.distrito.enabledError = true;
          this.errorService.distrito.error = err.message as string;
        },
      });
  }

  public inputIsValid(input: string): boolean | null {
    return this.myForm.controls[input].errors && this.myForm.controls[input].touched;
  }

  public save(): void {
    if (this.myForm.valid) {
      this.provincia.reset('');
      this.canton.reset('');
      this.distrito.reset('');
      return;
    }
  }


  public get mostrarProvincias(): Location[] {
    return [...this.provincias];
  }

  public get mostrarCantones(): Location[] {
    return [...this.cantones];
  }

  public get mostrarDistritos(): Location[] {
    return [...this.distritos];
  }

  public get mostrarErrorServicio(): ErrorService {
    return { ...this.errorService };
  }

  private get provincia(): AbstractControl {
    return this.myForm.get('provincia')!;
  }

  private get canton(): AbstractControl {
    return this.myForm.get('canton')!;
  }

  private get distrito(): AbstractControl {
    return this.myForm.get('distrito')!;
  }
}
