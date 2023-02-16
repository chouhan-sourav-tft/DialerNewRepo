const { Given, When, Then } = require('@cucumber/cucumber');
const { WebchatPlugin } = require('../page-objects/WebchatPlugin.po');
const { ticketsOnline } = require('../page-objects/TicketsOnline.po');
const { BaseAction } = require('../setup/baseAction');

const Webchat = new WebchatPlugin();
const ticket = new ticketsOnline();
const baseAction = new BaseAction();

let hashString = '';
let hashStringReply = '';
let mailboxSubject = '';

global.triggerName = [];

Given(
  'user log in to the Webchat plugin and send a message with following configurations:',
  async (datatable) => {
    let loginData = '';
    hashString = 'Test Message' + new Date().getTime();
    hashStringReply = 'Test Reply' + new Date().getTime();
    datatable.hashes().forEach((element) => {
      loginData = {
        contact: element.contact,
        email: element.email,
        message: hashString,
        tabSequence: element.tab,
      };
    });
    await Webchat.webchatLogin(loginData);
  }
);

When('user opens Duplicate browser tab', async () => {
  await Webchat.webchatDuplicateTab();
});

When('transfers the session to the new tab', async () => {
  await Webchat.webchatTransferChat();
});

Then(
  'verify session in the original browser is successfully terminated',
  async () => {
    await Webchat.webchatSessionCheck();
  }
);

When('user edit {string} channel', async (webchatChannel) => {
  await Webchat.switchToMainTab();
  await Webchat.elementClick('Webchat Manager');
  await Webchat.searchAndEditChannel(webchatChannel);
});

When('setting with following configurations:', async (datatable) => {
  let settingData = '';
  datatable.hashes().forEach((element) => {
    settingData = {
      maxFileSize: element.maxFileSize,
      fileFormat: element.fileFormat,
    };
  });
  await Webchat.elementClick('Webchat Setting');
  await Webchat.updateConfiguration(settingData);
});

When('User logout with current session', async () => {
  await Webchat.logoutSession();
});

When('access the {string}', async (webchatChannel) => {
  await Webchat.elementClick(webchatChannel);
});

When(
  'send {string} file and verify if {string} {string}',
  async (fileName, type, message) => {
    await Webchat.elementClick('Webchat Option');
    await Webchat.uploadFile(fileName);
    await Webchat.verifyUploadMessage(type, message);
  }
);

When(
  'validate message received successfully in {string} tab & {string} status',
  async (tab, status) => {
    await Webchat.verifyMessage(hashString, tab, status);
  }
);

When('validate uploaded file {string} with {string}', async (type, msg) => {
  await Webchat.checkUpload(hashString, type, msg);
});

When('user reply to received message', async () => {
  await Webchat.replyOnThread(hashStringReply);
});

When('validate message is received in the client plugin', async () => {
  await Webchat.validateMessage(hashStringReply);
});

When(
  'user {string} the conversation with the subject {string}',
  async (status, subject) => {
    await Webchat.closeConversation(status, subject);
  }
);

When(
  'customer is notified that the agent has {string} the conversation',
  async (status) => {
    await Webchat.validateMessage(hashStringReply, status);
  }
);

When('user change name {string}', async (name) => {
  await Webchat.changeName(name);
});

When('verify if {string}', async (msg) => {
  await Webchat.validateClientMessage(msg);
});

When('user change language {string}', async (language) => {
  await Webchat.changeLanguage(language);
});

When('validate translation {string}', async (translatedText) => {
  await Webchat.validateLanguage(translatedText);
});

When('user reply to received message by selecting Request rating', async () => {
  await Webchat.requestRating(hashStringReply);
});

When('verify {string} with {string} star and {string} message', async (type, rating, message) => {
  await Webchat.verifyRating(rating, message, type);
});

When('setting {string} to {string}', async (settingType, actionType) => {
  await Webchat.elementClick('Webchat Setting');
  await Webchat.updateSetting(settingType, actionType);
});
Then('Validate that Rate chat option available', async () => {
  await Webchat.validateRateChat();
});

Then('client sends {string} with {string} star and {string} message', async (type, rate, message) => {
  await Webchat.SendRating(type, rate, message);
});

When('user open a duplicate tab and open Webchat plugin', async () => {
  await Webchat.webchatLogin({ tabSequence: 'second' });
});
Then(
  'verify the plugin Webchat has CSS Background color {string}',
  async (color) => {
    await Webchat.verifyCssproperty(color);
  }
);
When(
  'validate conversation started at {string} side as {string}',
  async (type, name) => {
    await Webchat.verifyConversationStarted(type, name);
  }
);
When('user switch to main tab', async () => {
  await Webchat.switchToMainTab();
});
When('verify if {string} exist', async (mailbox) => {
  await Webchat.checkMailbox(mailbox);
});
When('update webchat setting with:', async (datatable) => {
  await Webchat.elementClick('Webchat Setting');
  let mailboxSetting = '';
  datatable.hashes().forEach((element) => {
    mailboxSubject = element.MailboxName + new Date().getTime();
    mailboxSetting = {
      Mailbox: element.Mailbox,
      Setting: element.Setting,
      MailboxName: element.MailboxName,
    };
  });
  await Webchat.updateMailboxSetting(mailboxSetting, mailboxSubject);
});
When('user select the conversation', async () => {
  await Webchat.selectTheConversation();
});
When('verify the plugin Webchat have Send Chat by Email', async () => {
  await Webchat.sendChatByEmail();
});
When(
  'validate if email is sent to the client on {string} with a copy of conversation',
  async (clientEmail) => {
    await ticket.mailVerify(clientEmail, mailboxSubject);
  }
);

When('User logout with current session in {string} window', async (session) => {
  await Webchat.logoutSession(session);
});

Then('user navigate to triggers tab and select add trigger option', async() => {
  await Webchat.navigateToTriggersTab();
  await Webchat.addTrigger();
});

When('User fill the trigger details:', async(dataTable) => {
  const triggerData = dataTable.rowsHash();
  let randomAgentName = await baseAction.getRandomString('_Agent');
  triggerData.triggerName =  await randomAgentName.toString();
  global.triggerName.push(triggerData.triggerName);
  await Webchat.triggerDetails(triggerData);
});

Then ('customer verify {string} name and {string} message displayed', async(sender, message) => {
  await Webchat.verifyMessageAndSender(sender, message);
});

Then('user deletes the {string} trigger action', async(triggerIndex) => {
  await Webchat.navigateToTriggersTab();
  await Webchat.deleteTrigger(global.triggerName[triggerIndex]);
});

Then('let user reset the trigger action', async() => {
  await Webchat.resetTriggerValue();
});