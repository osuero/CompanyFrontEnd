import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { HttpClient } from '@angular/common/http';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserMockApi
{
    private _user: any;
    private userId: string;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        this.userId = localStorage.getItem('userId');
        this.registerUser();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    registerUser():void
    {
        this._httpClient.get<User>(environment.apiUrl+'/user',{ params:{'Id': this.userId} }).subscribe(
            (x)=>{
                this._user = x;
                const user = cloneDeep(x);
                this._user = assign({}, this._user, user);
                [200, cloneDeep(this._user)]
            }
        )
    }
}
