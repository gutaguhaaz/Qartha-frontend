import { Route } from "@angular/router";
import { BasicTableComponent } from "./basic-table/basic-table.component";
import { NgxDatatableComponent } from "./ngx-datatable/ngx-datatable.component";
import { MaterialTableComponent } from "./material-table/material-table.component";
export const TEBLES_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "basic-tables",
    pathMatch: "full",
  },
  {
    path: "basic-tables",
    component: BasicTableComponent,
  },
  {
    path: "material-tables",
    component: MaterialTableComponent,
  },
  {
    path: "ngx-datatable",
    component: NgxDatatableComponent,
  },
];
