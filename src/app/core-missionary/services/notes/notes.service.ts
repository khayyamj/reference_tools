import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HostnameService } from '../../../shared/services/hostname/hostname.service';
import { HttpClient } from '@angular/common/http';
import { SimpleConfirmationComponent, MTCToastService, MTCUser } from 'mtc-modules';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MissionaryApiService } from '../missionary-api';
import { AddNoteComponent } from '../../components/notes/add-note';
import { MissionaryService } from '../missionary';
import { RolesService } from '../../../shared';


@Injectable()
export class NoteService {

	constructor(private hostName: HostnameService,
				private http: HttpClient,
				private dialog: MatDialog,
				private toastService: MTCToastService,
				private missionaryApi: MissionaryApiService,
				private missionaryService: MissionaryService,
				private rolesService: RolesService,
				private userService: MTCUser) { }

	createNote(note,alsoCreateMSNote){
		//TODO remove this code when we turn off mtc manager
		const missionarySystemsNote = {
			authorId: note.createdBy,
			commentData: note.noteTxt,
			encrypted:0,
			entityTypeId:1,
			missionaryId:note.entityId
		};
		const missionarySystems = this.http.post(`${this.hostName.missionarySystemsUrl}missionaries/note`, missionarySystemsNote);
		const noteApi = this.http.put(`${this.hostName.noteUrl}note`, note);
		if(alsoCreateMSNote){
			return Observable.zip(noteApi,missionarySystems);
		}else{
			return noteApi.map(r => [r]);
		}
	}

	getNoteConfig(){
		return this.http.get(`${this.hostName.mtcToolsAPIUrl}noteconfig`);
	}

	getMissionaryNotes(missionary) {
		this.missionaryService.loadingCount++;
		const subject = new Subject<any>();
		this.missionaryApi.getMissionaryNotesById(missionary.missionaryId).subscribe((notes: any) => {
			if (notes.noteCount) {
				this.userService.getUser().subscribe((user) => {
					missionary.noteList = notes.noteList.map(note => {
						note.tags.map(tag => this.mapNoteTags(tag, missionary));
						note.hideButton = !this.rolesService.isEcclUser || user.id !== note.createdById;
						return note;
					});
				});
			}
			subject.next();
			subject.complete();
			this.missionaryService.loadingCount--;
		});
		return subject.asObservable();
	}

	mapNoteTags(tag, missionary) {
		tag.abbrev = tag.tagAbbrev;
		switch (tag.abbrev) {
			case 'MP':
				tag.name = missionary.missionInfo.missionPresident ? missionary.missionInfo.missionPresident : 'missionPresident';
				break;
			case 'SP':
				tag.name = (missionary.unitInfoList && missionary.unitInfoList[0]) ? missionary.unitInfoList[0].parentUnitLeaders[0].fullName : 'Stake President';
				break;
			case 'BP':
				tag.name = (missionary.mtcInfo.branchPresidency && missionary.mtcInfo.branchPresidency[0]) ? `${missionary.mtcInfo.branchPresidency[0].lastName}, ${missionary.mtcInfo.branchPresidency[0].firstName}`: 'Branch President';
				break;
			default:
				tag.name = tag.tagName;
				break;
		}
	}

	openNote(note, missionary, user, isCreate = false, editNote = false) {
		this.dialog.open(AddNoteComponent, {
			data: { missionary: missionary, note: note, isCreate: isCreate },
			width: '1020px',
			height: '650px'
		}).afterClosed().subscribe((newNote) => {
			if (newNote) {
				this.createNote(newNote, isCreate).subscribe(([noteResponse]) => {
					this.toastService.success(`Note saved <strong>successfully</strong>`);
					this.mapNoteTags(noteResponse, missionary);
					if (isCreate && editNote === false) {
						missionary.noteList.unshift(noteResponse);
					} else {
						missionary.noteList.splice(missionary.noteList.findIndex((oldNote) => {
							return oldNote.noteId === newNote.noteId;
						}), 1, noteResponse);
					}
				});
				if (newNote.visName !== 'Public' && editNote === false) {
					this.createPublicNote(missionary, user);
				}
			}
		});
	}

	editNote(note, missionary, isEditing): Observable<any> {
		return Observable.create((observer) => {
			this.dialog.open(AddNoteComponent, {
				data: { missionary: missionary, note: note, isCreate: isEditing },
				width: '1020px',
				height: '650px'
			}).afterClosed().subscribe((editNote) => {
					if (editNote) {
						this.createNote(editNote, true).subscribe(([noteResponse]) => {
							this.toastService.success(`Note updated <strong>successfully</strong>`);
							this.mapNoteTags(noteResponse, missionary);
							missionary.noteList.splice(missionary.noteList.findIndex((oldNote) => {
								return oldNote.noteId === editNote.noteId;
							}), 1, noteResponse);
							observer.next(missionary);
							observer.complete();
						});
					}
					observer.next(missionary);
				});
			});
	}

	createPublicNote(missionary, user) {
		this.dialog.open(SimpleConfirmationComponent, {
			data: {
				cancelButtonText: 'No',
				confirmationButtonText: 'Yes',
				content: 'You have created a note with limited visibility, would you like to create another public note?'
			},
			width: '500px',
			height: '175px'
		}).afterClosed().subscribe((response) => {
			if (response) {
				//TODO remove createdBy when missionary systems is turned off.
				this.openNote({
					noteText: '',
					subject: '',
					createdBy: user.byuPersonId,
					entityType: 'missionary',
					entityId: missionary.missionaryId,
					visName: 'Public',
					visId: 1,
					tags: []
				}, missionary, user, true);
			}
		});
	}

}
