import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { loadSvgResources } from '../utils/svg.util';
import { HttpClientModule } from '@angular/common/http';
import { MatIconRegistry, MAT_DATE_LOCALE } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppStoreModule } from './../reducers/index';
import { AppEffectsModule } from '../effects';
import { registerLocaleData } from '@angular/common';
import "hammerjs"

import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppStoreModule,
    AppEffectsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    AppRoutingModule
  ],
  providers: [
    {
      provide: "BASE_CONFIG", useValue: {
        uri: "http://localhost:3000"
      }
    },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-Hans' }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer
  ) {
    if (parent) {
      throw new Error("模块已经存在，不能再次加载！");
    }
    loadSvgResources(ir, ds);
  }
}
