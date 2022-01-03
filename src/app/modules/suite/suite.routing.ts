import { Route } from '@angular/router';
import { SuiteComponent } from './suite.component';
import { SuiteListComponent } from './list/list.component';
import { SuiteCategoriesResolver, SuiteCourseResolver, SuiteCoursesResolver } from './suite.resolver';

export const SuiteRoutes: Route[] = [
    {
        path     : '',
        component: SuiteComponent,
        resolve  : {
            categories: SuiteCategoriesResolver
        },
        children : [
            {
                path     : '',
                pathMatch: 'full',
                component: SuiteListComponent,
                resolve  : {
                    courses: SuiteCoursesResolver
                }
            }
        ]
    }
];
