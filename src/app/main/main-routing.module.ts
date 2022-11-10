import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppInvoicesComponent } from './invoices/appInvoices/appInvoices.component';
import { AppOperationsComponent } from './operations/appOperations/appOperations.component';
import { AppExchangeRatesComponent } from './exchangeRates/appExchangeRates/appExchangeRates.component';
import { AppCustomersComponent } from './customers/appCustomers/appCustomers.component';

import { AppPoliciesComponent } from './policies/appPolicies/appPolicies.component';
import { AppProvidersComponent } from './providers/appProviders/appProviders.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'appInvoices', component: AppInvoicesComponent, data: { permission: 'Pages.AppInvoices' }  },
                    { path: 'appInvoices', component: AppInvoicesComponent, data: { permission: 'Pages.AppInvoices' }  },
                    { path: 'operations/:securityService', component: AppOperationsComponent, data: { permission: 'Pages.AppOperations' }  },
                    { path: 'exchangeRates', component: AppExchangeRatesComponent, data: { permission: 'Pages.AppExchangeRates' }  },
                    { path: 'customers', component: AppCustomersComponent, data: { permission: 'Pages.AppCustomers' }  },
                    { path: 'policies', component: AppPoliciesComponent, data: { permission: 'Pages.AppPolicies' }  },
                    { path: 'providers', component: AppProvidersComponent, data: { permission: 'Pages.AppProviders' }  },
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
