import { Route } from "@angular/router";
import { MaterialComponent } from "./material/material.component";
import { FontAwesomeComponent } from "./font-awesome/font-awesome.component";
export const ICONS_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "material",
    pathMatch: "full",
  },
  {
    path: "material",
    component: MaterialComponent,
  },
  {
    path: "font-awesome",
    component: FontAwesomeComponent,
  },
];
