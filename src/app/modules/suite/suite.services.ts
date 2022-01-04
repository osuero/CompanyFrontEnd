import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Category, Application } from '../suite/suite.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SuiteService
{
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _application: BehaviorSubject<Application | null> = new BehaviorSubject(null);
    private _applications: BehaviorSubject<Application[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for courses
     */
    get applications$(): Observable<Application[]>
    {
        return this._applications.asObservable();
    }

    /**
     * Getter for course
     */
    get application$(): Observable<Application>
    {
        return this._application.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]>
    {
        return this._httpClient.get<Category[]>('api/apps/academy/categories').pipe(
            tap((response: any) => {
                this._categories.next(response);
            })
        );
    }

    /**
     * Get courses
     */
    /*getApplications(): Observable<Application[]>
    {
        return this._httpClient.get<Application[]>('api/apps/academy/courses').pipe(
            tap((response: any) => {
                this._applications.next(response);
            })
        );
    }
*/
    getApplications(): Observable<Application[]>
    {
        return this._httpClient.get<Application[]>(environment.apiUrl+'/applications').pipe(
            tap((response: any) => {
                this._applications.next(response);
            })
        );
    }

    /**
     * Get course by id
     */
    getApplicationById(id: string): Observable<Application>
    {
        return this._httpClient.get<Application>('api/apps/academy/courses/course', {params: {id}}).pipe(
            map((course) => {

                // Update the course
                this._application.next(course);

                // Return the course
                return course;
            }),
            switchMap((course) => {

                if ( !course )
                {
                    return throwError('Could not found course with id of ' + id + '!');
                }

                return of(course);
            })
        );
    }
}
