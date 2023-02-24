const { When, Then } = require('@cucumber/cucumber');
const { DialerControl } = require('../page-objects/DialerControl.po');
const { VoiceChannel } = require('../page-objects/VoiceChannel.po');
const { BaseAction } = require('../setup/baseAction');

const dialerControl = new DialerControl();
const voiceChannel = new VoiceChannel();
const baseAction = new BaseAction();

When(
  'user creates the filter with following information:',
  async (datatable) => {
    await dialerControl.clickCreateFilter();
    let filterData = [];
    datatable.hashes().forEach(async (element) => {
      filterData.push({
        database: (global.newDBName[0]).toString(),
        field: element.field,
        group: element.group,
        filterType: element.filterType,
        startTime: element.startTime,
        endTime: element.endTime,
        filterData: element.filterData,
      });
    });
    for (let i = 0; i < filterData.length; i++) {
      if(i > 0){
        await dialerControl.addFilter();
      }
      await dialerControl.createFilter(filterData[i]);
    }
  }
);

Then('user selects the Apply button', async () => {
  await dialerControl.applyFilter();
});

When(
  'verify the hopper table preview with following information:',
  async (datatable) => {
    await dialerControl.clickToPreview();
    let hopperData = [];
    datatable.hashes().forEach(async (element) => {
      hopperData.push({
        name: element.name,
        phone: element.phone,
        email: element.email,
        postalCode: element.postalCode,
        city: element.city,
        Field_1: element.Field_1
      });
    });
    for (let i = 0; i < hopperData.length; i++) {
      await dialerControl.validateHopperData(hopperData[i], i);
    }
    await dialerControl.clickToClose();
  }
);

Then('clear all active filters', async () => {
  await dialerControl.clearFilters();
});

Then('clear all hopper preview data', async () => {
  await dialerControl.clearHopperData();
});

Then('update field to order by {string} with direction {string}', async (fieldOrder, direction) => {
  await dialerControl.updateConfiguration(fieldOrder, direction);
});

Then('user add new group', async () => {
  await dialerControl.addGroup();
});

//New methods dialer rules
When('user navigates to Dialer rules manager tab', async () => {
  await dialerControl.selectDialerRuleTab();
});

Then('user configure the folllowing rule:', async (dataTable) => {
  const dialerRule = dataTable.rowsHash();
  // dialerRule.dialerName = dialerRule.dialerName + new Date().getTime();
  await dialerControl.fillDialerRules(dialerRule);
});

Then('user click on the recycle button', async () => {
  await dialerControl.clickRecycleButton();
});

Then('user click on the recycle button for {string} time', async(clickTime) => {
  await dialerControl.clickRecycleButtonSecondTime(clickTime);

})

When('user set the following values in the recycle form:', async (dataTable) => {
  let settingData = '';
  dataTable.hashes().forEach(async (element) => {
    settingData = {
      callOutcome: element.callOutcome,
      recycleInterval: element.recycleInterval,
      maxTries: element.maxTries
    };
  });
  await dialerControl.recycleSettings(settingData);
});

When('user set the following values in the recycle form for {string} time:', async (recycleTime, dataTable) => {
  let settingData = '';
  dataTable.hashes().forEach(async (element) => {
    settingData = {
      callOutcome: element.callOutcome,
      recycleInterval: element.recycleInterval,
      maxTries: element.maxTries
    };
  });
  await dialerControl.recycleSettingsDynamic(recycleTime, settingData);
});

Then('user clicks the finish button', async () => {
  await dialerControl.finishCampaign();
});

Then('user choose the following configurations in dialer control menu:', async (dataTable) => {
  const settings = dataTable.rowsHash();
  await dialerControl.updateDialerControlSettings(settings);
});

Then('user click the previously created DB', async () => {
  let dbName = global.newDBName[0];
  await dialerControl.clickPreviousDatabase((await dbName).toString());
});

Then('user validate that all contacts are closed by {string}', async (outcome) => {
  await dialerControl.validateContacts(outcome);
  await dialerControl.deleteDatabase();
});

Then('verify that contacts are triggered', async (datatable) => {
  let contactData = [];
  datatable.hashes().forEach(async (element) => {
    contactData.push({
      number: element.number,
      outcomeGroup: element.outcomeGroup,
      outcomeName: element.outcomeName,
    });
  });
  for (let i = 0; i < contactData.length; i++) {
    await voiceChannel.validatePhone(contactData[i].number);
    await voiceChannel.makeACall();
    await baseAction.wait(2); //wait before disconnect
    await voiceChannel.disconnectACall();
    await voiceChannel.submitOutcomes(contactData[i].outcomeGroup, contactData[i].outcomeName);
    // wait before next value pop up
    await baseAction.wait(5); 
  }
})

When('user click on the add rule button', async() => {
  await dialerControl.clickAddRuleButton();
});