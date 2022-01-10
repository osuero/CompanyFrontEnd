import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { Category, Application } from '../suite.types';
import { SuiteService } from '../suite.services';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Component({
    selector       : 'suite-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuiteListComponent implements OnInit, OnDestroy
{
    categories: Category[];
    applications: Application[];
    filteredApplications: Application[];
    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _suiteService: SuiteService,
        private _http: HttpClient
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the categories
        this._suiteService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the courses
        this._suiteService.applications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((applications: Application[]) => {
                this.applications = this.filteredApplications = applications;

                this._changeDetectorRef.markForCheck();
            });

        // Filter the courses
        combineLatest([this.filters.categorySlug$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([categorySlug, query, hideCompleted]) => {

                // Reset the filtered courses
                this.filteredApplications = this.applications;

                // Filter by category
                if ( categorySlug !== 'all' )
                {
                    this.filteredApplications = this.filteredApplications.filter(application => application.category === categorySlug);
                }

                // Filter by search query
                if ( query !== '' )
                {
                    this.filteredApplications = this.filteredApplications.filter(application => application.name.toLowerCase().includes(query.toLowerCase())
                        || application.description.toLowerCase().includes(query.toLowerCase())
                        //|| application.category.toLowerCase().includes(query.toLowerCase())
                        );
                }

            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByCategory(change: MatSelectChange): void
    {
        this.filters.categorySlug$.next(change.value);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void
    {
        this.filters.hideCompleted$.next(change.checked);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    onNavigate(routeUrl:string ){
       debugger
        const dataToPut = 'Usually, it will be an object, not a string';
        console.log(localStorage.getItem("accessToken"))
        console.log('entro al redirect')
        const headers = new HttpHeaders()
        
            .append("Authorization", "Bearer " + localStorage.getItem("accessToken"))
            .append("Content-type", "application/json");
        // your logic here.... like set the url 
        const httpOptions = {
            headers
          };
        const url = 'https://index.gob.do/';

        this._http.post(routeUrl,dataToPut, httpOptions)
        window.open(url, '_blank');
    }
}
