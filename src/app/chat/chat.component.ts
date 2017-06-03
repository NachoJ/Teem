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

	activeChatUser= <any>{};
	activeChat: any;

	chatString: any;

	constructor(private ngZone: NgZone) {
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;
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
		// environment.socket.get(environment.BASEAPI + environment.GET_MESSAGES + self.user.id + '/' + cuser.id,
		// 	function matchReceived(response) {
		// 		self.ngZone.run(() => {
		// 			console.log("response messages = ", response);
		// 			self.activeChat = response.data;
		// 			setTimeout(function () {
		// 					if ($('.chat-history-list')[0])
		// 						$(".chat-history-list").animate({ scrollTop: $('.chat-history-list')[0].scrollHeight }, 0);
		// 				}, 1500);
		// 		});
		// 	});
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
				function chatReceived(response) {
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
					for (var i = 0; i < self.userList.length; i++) {
						console.log("index = ", i + " " + self.userList[i].id + " " + message.data.msg.receiveruserid);
						if (self.userList[i].id == message.data.msg.receiveruserid || self.userList[i].id == message.data.msg.senderuserid) {
							console.log("data to push user = ", self.userList[i].id);
							//increament badge count if chat not active
							if (self.activeChatUser.id != self.userList[i].id)
							self.userList[i].count++;
							self.userList[i].chatdata.push({
								'senderuserid': message.data.msg.senderuserid,
								'receiveruserid': message.data.msg.receiveruserid.id,
								'message': message.data.msg.message
							});
							break;
						}
					}
				});
				break;

			default:
				break;
		}
	}
}
