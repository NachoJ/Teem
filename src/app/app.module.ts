import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { FindMatchComponent } from './find-match/find-match.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { AddNewSportscenterComponent } from './add-new-sportscenter/add-new-sportscenter.component';
import { MySportscenterComponent } from './my-sportscenter/my-sportscenter.component';
import { PitchComponent } from './pitch/pitch.component';
import { MatchCreateComponent } from './match-create/match-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FindMatchComponent,
    TournamentsComponent,
    AddNewSportscenterComponent,
    MySportscenterComponent,
    PitchComponent,
    MatchCreateComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule.forRoot(),
    FlexLayoutModule,

    AppRoutingModule,

    SharedModule.forRoot(),

    CoreModule,
    AuthModule,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
