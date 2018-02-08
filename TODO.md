### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| assistance/services/assistance.service.ts | 17 | these aren't assistance endpoints, why not use missionaryapi service?
| assistance/services/assistance.service.ts | 63 | a new endpoint will be made in the backend that accepts the whole array, change this to point at that one when it is implemented
| general-services/services/general-services.service.ts | 25 | implement mailbox methods in tools api
| assistance/components/print-evaluation/print-evaluation.component.ts | 45 | this method for creating missionaryItems object should be moved to the backend
| assistance/components/print-evaluation/print-evaluation.component.ts | 73 | remove this pseudo-sort function once the data comes formatted
| core-dashboard/services/widget/widget.service.ts | 51 | Combine into one endpoint when backend model for widget has "selected"
| core-missionary/components/assistance/assistance.component.ts | 97 | use data as is when prop names are changed in AsstItem on the backend
| core-missionary/components/header/header.component.ts | 79 | should this be in the service?
| core-missionary/components/mtc-info/mtc-info.component.ts | 41 | SecureStatus and groupdates needs an end point
| core-missionary/components/notes/notes.component.ts | 64 | remove createdBy when missionary systems is turned off.
| core-missionary/components/notes/notes.component.ts | 116 | remove createdBy when missionary systems is turned off.
| core-missionary/components/personal-info/personal-info.component.ts | 26 | move this varible to model in the backend
| core-missionary/services/notes/notes.service.ts | 27 | remove this code when we turn off mtc manager
| core-missionary/services/notes/notes.service.ts | 145 | remove createdBy when missionary systems is turned off.
| core-missions/services/mission-api/mission-api.service.ts | 17 | we need an endpoint that will accept an array of items
| scheduling-nms/components/check-and-finish/check-and-finish.component.ts | 172 | remove below 7 lines and use above line when changes to checkbox table row buttons takes affect
| scheduling-records/services/missionary-info/missionary-info.service.ts | 7 | should these functions be in the missionaryService?
| scheduling-training-group/components/training-group-search/training-group-search.component.ts | 84 | when would index ever be falsey here???  Seems impossible
| travel/components/consulate-appointments/consulate-appointments.component.ts | 202 | implement this
| travel/components/consulate-appointments/consulate-appointments.component.ts | 206 | implement this
| travel/components/new-appointment/new-appointment.component.ts | 185 | The two lines below should be deleted when angular material is updated since the most recent release should fix this bug https://github.com/angular/material2/issues/4611
| travel/components/old-travel-groups-week-view/old-travel-groups-week-view.component.ts | 70 | We should just be returning a array of arrays here instead of formatting it on the frontend
| travel/components/travel-view/travel-view.component.ts | 52 | this should all be calculated in the backend
| travel-departures/components/departure-group-list/departure-group-list.component.ts | 238 | remove Object.assign when updatedBy is put in the backend
| core-missionary/components/notes/add-note/add-note.component.ts | 153 | this functionality is temporary, which includes the function below, the declaration of the lastVersion and limit variables, the change attribute on the editor, and the span tag below the editor
| core-missionary/components/notes/note-tags/note-tags.component.ts | 82 | this for loop should be a for each
| scheduling-training-group/components/training-group-view/training-group-future-changes/edit-group-future-change/edit-group-future-change.component.ts | 28 | move this logic to backend
| core-missionary/components/mission-info/mission-info.component.html | 37 | what is special category?
| core-missionary/components/missionary-overview/missionary-overview.component.html | 143 | get citizenship, what is citizenship?
| core-missionary/components/mtc-info/mtc-info.component.html | 86 | what is the group date? Add set changes to it
| core-missionary/components/mtc-info/mtc-info.component.html | 105 | get address info in an array to display here
| core-missionary/components/mtc-info/mtc-info.component.html | 148 | get secure sub status
| core-missionary/components/personal-info/personal-info.component.html | 101 | get marital status
| core-missionary/components/personal-info/personal-info.component.html | 136 | Get contact cell phones
| core-missionary/components/personal-info/personal-info.component.html | 141 | Get contact work phones
| core-missionary/components/personal-info/personal-info.component.html | 157 | get contacts mailing address
| scheduling/components/room/room.component.html | 53 | Make card match style guide
| scheduling-nms/components/nms-landing-page/nms-landing-page.component.html | 2 | the hidden tags are all using crazy long variables or functions, can we improve that?
| travel/components/consulate-appointments/consulate-appointments.component.html | 55 | should we make sendOne and sendAll outputs instead?
| travel/components/travel-view/travel-view.component.html | 17 | Probably should use checkbox table component
| travel-departures/components/departure-group-list/departure-group-list.component.html | 20 | I think these inner departure groups should be their own component Thoughts?
| scheduling/components/facilities-management/edit-facilities-future-changes/edit-facilities-future-changes.component.html | 18 | Change this to a /checkbox-table the current spacing is wonky
| scheduling-records/components/future-changes/edit-future-changes-missionary/edit-future-changes-missionary.component.html | 26 | can we move these out of field auto-complets div tags?
| scheduling-records/components/future-changes/edit-future-changes-missionary/edit-future-changes-missionary.component.html | 27 | Also let's use an ngFor here
| main.less | 4 | remove old classes and style
| variables.less | 54 | Change once design decisions