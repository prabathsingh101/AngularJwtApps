import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TestService } from '../core/test-service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FilterPipe } from '../pipes/filter-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Weather } from '../core/weather.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MyCustomPipe } from '../pipes/my-custom-pipe';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CommonModule,
    FilterPipe,
    MyCustomPipe,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit, OnDestroy, AfterViewInit {
  data: Weather[] = [];
  displayedColumns: string[] = [
    'date',
    'temperatureC',
    'temperatureF',
    'summary',
  ];
  dataSource: any = new MatTableDataSource<Weather[] | null>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();

  lists$: any = Observable<Weather[]>;

  searchText: string = '';

  //svc: any = Inject(TestService);

  /**
   *
   */
  constructor(private svc: TestService) {}

  ngOnInit(): void {
    //this.bindDataUsingAsync();
    //this.bindDataUsingObserable();
    this.bindMaterialTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  bindDataUsingObserable() {
    this.svc
      .getTestData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.data = res;
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  bindDataUsingAsync() {
    this.lists$ = this.svc.getTestData();
  }

  bindMaterialTable() {
    this.svc
      .getTestData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.dataSource.data = res;
        //this.dataSource.paginator = this.paginator;
        console.log('Data bound to Material Table:', this.dataSource.data);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
