import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError, map } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import * as shajs from 'sha.js';
import { UserParams } from '../user/user.params';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    deviceInfo = null;
    isDesktopDevice: boolean;
    isTablet: boolean;
    isMobile: boolean;
    enviromentData: any;
    userParams: UserParams;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
 
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        if(!localStorage.getItem('accessToken')){
            localStorage.setItem('accessToken', JSON.stringify(token));
        }
    }
  
    set userId(id: string)
    {
        if(!localStorage.getItem('userId')){
            localStorage.setItem('userId', id);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }
        credentials.password = shajs('sha256').update(credentials.password ).digest('hex');
       this.getUserEnviroment().subscribe(Response =>{return Response});
        return this._httpClient.post(environment.apiUrl+'/auth', credentials)
        .pipe( catchError(() =>
                of(false)
            ),
            switchMap((response: any) => {

      
                // Store the access token in the local storage
                   this.accessToken = response.data.value;
                   this.getUserEnviroment
                   this.userId = response.data.userId;
                // Set the authenticated flag to true
                   this._authenticated = true;
                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        // Set the authenticated flag to false
        this._authenticated = false;

        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; lastName:string; emailaddress: string; password: string, username?:string }): Observable<any>
    {
        user.password = shajs('sha256').update(user.password ).digest('hex');
        user.username = user.emailaddress.split('@')[0];
        return this._httpClient.post(environment.apiUrl+'/user', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }


    getUserEnviroment(): Observable<any>
    {
        return this._httpClient.get(environment.apiUrl+'/UserEnviroment').pipe(
            catchError(() =>
                of(false)
            ),
            switchMap((response: any) => {

                if(response){
                    this.enviromentData = response.data.computerEnviroment;
                }
                return of(true)
            })
        )
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
