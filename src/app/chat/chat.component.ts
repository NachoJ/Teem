import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreService } from './../core/core.service';
import { environment } from './../../environments/environment';
import { Component, OnInit, ViewEncapsulation, NgZone } from '@angular/core';

declare var $: any;

@Component({
	selector: 'te-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChatComponent implements OnInit {

	profileImageBaseUrl: string;
	userList = <any>[];
	user: any;

	activeChatUser = <any>{};
	activeChat: any;

	chatString: any;

	newConversation = true;
	searchUser: any;
	searchUsers: any[] = [];
	newmessage: string;

	timer: any;

	newConversationFormGroup: FormGroup;

	constructor(private ngZone: NgZone, private coreService: CoreService, private formBuilder: FormBuilder) {
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;

		this.newConversationFormGroup = this.formBuilder.group({
			newConversationUser: ['', [Validators.required]],
			newmessage: ['', [Validators.required]]
		});

		this.user = JSON.parse(window.localStorage['teem_user']);
		let self = this;
		environment.socket.get(environment.BASEAPI + environment.GET_UNREAD_CHAT + self.user.id,
			function matchReceived(response) {
				self.ngZone.run(() => {
					console.log("response userList = ", response);
					self.userList = response.data;
				});
			});

		environment.socket.on('user', function messageReceived(message) {
			self.ngZone.run(() => {
				self.updateOnUserChatModel(message);
			});
		});
	}

	ngOnInit() {
	}

	loadConversation(cuser) {
		this.activeChatUser = cuser;
		let self = this;
		for (let user of this.userList) {
			if (user.id == cuser.id) {
				this.activeChat = user.chatdata
				break;
			}
		}
		this.markMessageAsRead();
		setTimeout(function () {
			if ($('.chat-history-list')[0])
				$(".chat-history-list").animate({ scrollTop: $('.chat-history-list')[0].scrollHeight }, 0);
		}, 500);
	}

	sendMessage() {
		if (this.chatString.length > 0) {
			let self = this;
			var data = {
				senderuserid: self.user.id,
				receiveruserid: self.activeChatUser.id,
				message: self.chatString
			};
			environment.socket.post(environment.BASEAPI + environment.SEND_PRIVATE_MESSAGE, data,
				function responseReceived(response) {
					self.ngZone.run(() => {
						// console.log("message send = ", response);
						self.chatString = "";
					});
				});
		}
	}

	updateOnUserChatModel(message: any) {
		var self = this;
		switch (message.verb) {

			// Handle user creation
			case 'created':
				self.ngZone.run(() => {
					// self.createdUser(message)
				});
				break;

			// Handle a user changing their name
			case 'updated':
				self.ngZone.run(() => {
					// self.updatedUser(message)
				});
				break;

			// Handle user destruction
			case 'destroyed':
				self.ngZone.run(() => {
					// self.removedUser(message)
				});
				break;

			case 'messaged':
				self.ngZone.run(() => {
					console.log("messaged = ", message);
					if (message.data.msg) {
						self.manageMessage(message);
					}
					if (message.data.usertyping) {
						self.manageTyping(message);
					}
				});
				break;

			default:
				break;
		}
	}

	userIsTyping() {
		let self = this;
		environment.socket.get(environment.BASEAPI + environment.USER_TYPING + self.activeChatUser.id + '/' + self.user.id,
			function responseReceived(response) {
				self.ngZone.run(() => {
					// console.log("typing send = ", response);
				});
			});
	}

	manageMessage(message) {
		let isNewUser = true;
		let self = this;
		for (var i = 0; i < self.userList.length; i++) {
			if (self.userList[i].id == message.data.msg.receiveruserid || self.userList[i].id == message.data.msg.senderuserid) {
				//increament badge count if chat not active
				if (self.activeChatUser.id != self.userList[i].id && self.user.id != message.data.msg.senderuserid)
					self.userList[i].count++;
				//push message in user chat data
				self.userList[i].chatdata.push({
					'senderuserid': message.data.msg.senderuserid,
					'receiveruserid': message.data.msg.receiveruserid.id,
					'message': message.data.msg.message
				});
				if (self.activeChatUser.id == message.data.msg.senderuserid)
					self.markMessageAsRead();
				//scroll down
				setTimeout(function () {
					if ($('.chat-history-list')[0])
						$(".chat-history-list").animate({ scrollTop: $('.chat-history-list')[0].scrollHeight }, 0);
				}, 500);
				isNewUser = false;
				break;
			}
		}
		if (isNewUser) {
			let tempUser:any;
			tempUser = message.data.senttouser;
			tempUser.count = 1;
			tempUser.chatdata = Array();
			tempUser.chatdata.push({
				'senderuserid': message.data.msg.senderuserid,
				'receiveruserid': message.data.msg.receiveruserid.id,
				'message': message.data.msg.message
			});
			this.userList.push(tempUser);
		}
	}

	manageTyping(message) {
		for (var i = 0; i < this.userList.length; i++) {
			if (this.userList[i].id == message.data.from) {
				this.userList[i].isTyping = true;
				if (this.timer) {
					clearTimeout(this.timer);
					this.timer = null;
				}
				var self = this;
				this.timer = setTimeout(function () {
					// console.log("user is typing clear = ", self.userList[i]);
					self.userList[i].isTyping = false;
					clearTimeout(this.timer);
					self.timer = null;
				}, 1000);
				break;
			}
		}
	}

	markMessageAsRead() {
		let self = this;
		environment.socket.get(environment.BASEAPI + environment.MARK_CHAT_AS_READ + self.user.id + '/' + self.activeChatUser.id,
			function matchReceived(response) {
				self.ngZone.run(() => {
					// console.log("message mark as read = ", response);
					// console.log("self = " + self.user.id + " chat user id = " + self.activeChatUser.id);
				});
			});
	}

	loadAutoComplete() {
		if (this.searchUser.length == 0) {
			this.searchUsers.length = 0;
			return 0;
		}
		if (this.searchUser.length >= 2) {
			this.coreService.getInvitationSearchPlayer(this.searchUser)
				.subscribe((response) => {
					console.log(response);
					this.searchUsers = response;
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
				});
		}
	}
	displayFn(player): string {
		return player ? player.firstname + " " + player.lastname : "";
	}

	sendNewMessage() {
		let isUserFound = false;
		let data = {
			senderuserid: this.user.id,
			receiveruserid: this.searchUser.id,
			message: this.newmessage
		};
		for (let i = 0; i < this.userList.length; i++) {
			if (this.userList[i].id == this.searchUser.id) {
				isUserFound = true;
				break;
			}
		}
		if (!isUserFound) {
			let tempUser = this.searchUser;
			tempUser.count = 0;
			tempUser.chatdata = Array();
			this.userList.push(tempUser);
		}
		let self = this;
		environment.socket.post(environment.BASEAPI + environment.SEND_PRIVATE_MESSAGE, data,
			function responseReceived(response) {
				self.ngZone.run(() => {
					console.log("message send = ", response);
					// self.loadConversation();
					self.newConversationFormGroup.reset();
				});
			});
	}
}
