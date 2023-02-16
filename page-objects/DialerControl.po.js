const { BaseAction } = require('../setup/baseAction');
const { assert } = require('chai');
exports.DialerControl = class DialerControl extends BaseAction {
  constructor() {
    super();
  }

  /**
   * Creating elements object for initializing required locators
   */
  elements = {
    applyFilterButton: '#dialer-control-filter-save',
    applyFilterModal: '#modal-dialer-control-filters',
    applyFilterWarning: '//div[@id="modal-dialer-control-filters"]//label[@data-translate="filtersModal.warning"][text()="this action will clear the current Hopper."]',
    submtFilter: '#dialer-control-submit-filters',
    successMessage: '.SmallBox.animated.fadeInRight.fast',
    createFilterButton: '//button[contains(.,"Create filter")]',
    filterView: '.dialer-control-filter',
    dbToggleButton: '(//button[contains(@class,"dialer-control-filter-dbs-btn")])[last()]',
    dbDeselectAll: '(//ul[contains(@class,"dialer-control-filter-dbs-dropdown")])[last()]//li[1]',
    fieldToggleButton: '(//div[contains(@class,"select2-container dialer-control-filter-fields")])[last()]',
    activeInput: '#select2-drop input',
    startTime: '.filter-hour-interval-container:not(.hidden) .dialer-control-filter-hour-1',
    endTime: '.filter-hour-interval-container:not(.hidden) .dialer-control-filter-hour-2',
    addFilterButton: '(//button[contains(.,"Add filter")])[last()]',
    filterType: '(//div[contains(@class,"select2-container dialer-control-filter-type")])[last()]',
    filterData: '(//input[contains(@class,"dialer-control-filter-string")])[last()][not(@disabled)]',
    closeButton: 'button[data-translate="close"]',
    previewButton: '#dialer-control-filter-preview',
    hopperPreviewModal: '#dialer-control-modal-hopper-preview',
    deleteFilter: '#dialer-control-filter-group-0 .dialer-control-filter:last-child .dialer-control-filter-delete',
    deleteIcon: '.dialer-control-filter-delete',
    clearHopper: '#dialer-control-clear-hopper',
    confirmButton: '.confirm-dialog-btn-confirm',
    fieldOrder: '#dialer-control-order-field',
    orderDirection: '#dialer-control-order-direction',
    addedGroupOr: '//div[@class="dialer-control-filter-logic-or"][1]',
    addGroup: '//button[contains(.,"Add group")]',
    dialerRuleTab: '//span[text()="Dialer rules manager"]',
    dialerName: '//input[@name="dial-rule-name"]',
    recycleTabCallOutcome: '[class="select with-angle-down valid"]',
    recycleInterval: '[name="recycle_rule_duration"]',
    recycleMaxTries: '[name="recycle-max-tries-input"]',
    redifineButton: '[id="finish-campaign-modal-btn"]',
    saveCampaign: '[data-translate="btnFinishCampaign"]',
    submitButton: '[id="bot2-Msg1"]',
    dialerControlOutboundCampaign: '//select[@id="dialer-control-active-campaign-select"]',
    dailerStartTime: 'input[name="dial-rule-startTime"]',
    dailerEndTime: 'input[name="dial-rule-endTime"]',
    dailerMaxtries: 'input[name="dial-rule-maxTries-input"]',
    deletePhoneButton: '#rules-phone-numbers li:first-child .select2-search-choice-close',
    totalPhoneList: '#rules-phone-numbers .select2-search-choice-close',
    phoneInput: '#rules-phone-numbers .select2-search-field input',
    recycleAddButton: '.recycle-rule-add-btn',
    removePreviousRecycle: '.recycle-rule-remove-btn',
    searchDatabase: '(//input[@data-translate="tbl-search"])[1]',
    dataTable: '(//td[contains(@class,"sorting_1")])[1]/following-sibling::td[1]',
    validateClosedContacts: '[id="database_pie_chart"]',
    deleteDatabase: '#delete-db-button',
    confirmDeleteDatabase: '#yesdeleteDB',
    popUpMsg: '#newContentdiv',
    allDayCheckbox: '#rule-schedule .checkbox'
  };

  /**
   * function to click to create filter
   * @return {void} Nothing
   */
  async clickCreateFilter(){
    if(await this.isVisible(this.elements.createFilterButton)){
      await this.waitForSelector(this.elements.createFilterButton);
      await this.click(this.elements.createFilterButton);
      await this.wait(3); //wait to load view
      if(!(await this.isVisible(this.elements.filterView))){
        await this.click(this.elements.createFilterButton);
        await this.isVisible(this.elements.filterView);
      }
    }
  }

  /**
   * function to click to add filter
   * @return {void} Nothing
   */
  async addFilter(){
    await this.waitForSelector(this.elements.addFilterButton);
    await this.click(this.elements.addFilterButton);
  }

  /**
   * function to create filter
   * @param {object} datatable - object to create filters
   * @param {string} datatable.database - select database name
   * @param {string} datatable.field - select field type
   * @param {string} datatable.group - validate group
   * @param {string} datatable.filterType - select filter type
   * @param {string} datatable.startTime - select start time
   * @param {string} datatable.endTime - select end time
   * @param {string} datatable.filterData - select filter data
   * @return {void} Nothing
   */
  async createFilter(datatable){
    if(datatable.database){
      await this.waitForSelector(this.elements.dbToggleButton);
      await this.wait(2); //wait to pause, because speed is so quick
      await this.click(this.elements.dbToggleButton);
      await this.waitForSelector(this.elements.dbDeselectAll);
      await this.click(this.elements.dbDeselectAll);
      let dbSelector = `(//ul[contains(@class,'dialer-control-filter-dbs-dropdown')])[last()]//li//span[contains(text(),'${datatable.database}')]`;
      await this.waitForSelector(dbSelector);
      await this.click(dbSelector);
      await this.click(this.elements.dbToggleButton);
    }

    if(datatable.field){
      await this.waitForSelector(this.elements.fieldToggleButton);
      await this.click(this.elements.fieldToggleButton);
      await this.type(this.elements.activeInput, datatable.field);
      if(datatable.group){
        let groupTitle = `//div[@id='select2-drop']//ul//li[contains(@class,'select2-result-with-children')]//div[contains(.,'${datatable.group}')]`;
        await this.shouldVisible(groupTitle);
      }
      let fieldSelector = `//div[@id='select2-drop']//ul//li[contains(@class,'select2-result-with-children')]//ul//li[contains(.,'${datatable.field}')]`;
      await this.waitForSelector(fieldSelector);
      await this.click(fieldSelector);
    }

    if(datatable.startTime){
      await this.waitForSelector(this.elements.startTime);
      await this.type(this.elements.startTime, datatable.startTime);
      await this.pressKey('Enter');
    }
    
    if(datatable.endTime){
      await this.waitForSelector(this.elements.endTime);
      await this.type(this.elements.endTime, datatable.endTime);
      await this.pressKey('Enter');
    }
    
    if(datatable.filterType){
      await this.waitForSelector(this.elements.filterType);
      await this.click(this.elements.filterType);
      await this.wait(2); //wait to pause, because speed is so quick
      await this.waitForSelector(this.elements.activeInput);
      await this.type(this.elements.activeInput, datatable.filterType);
      let filterTypeSelector = `//div[@id='select2-drop']//ul//li[contains(@class,'select2-result-with-children')]//ul//li[contains(.,'${datatable.filterType}')]`;
      await this.waitForSelector(filterTypeSelector);
      await this.click(filterTypeSelector);
    }

    if(datatable.filterData){
      await this.waitForSelector(this.elements.filterData);
      await this.type(this.elements.filterData, datatable.filterData);
      await this.pressKey('Enter');
    }
  }

  /**
   * function to click to apply filter
   * @return {void} Nothing
   */
  async applyFilter() {
    await this.waitForSelector(this.elements.applyFilterButton);
    await this.click(this.elements.applyFilterButton);
    await this.waitForSelector(this.elements.applyFilterModal);
    await this.shouldVisible(this.elements.applyFilterWarning);
    await this.click(this.elements.submtFilter);
    await this.waitForSelector(this.elements.successMessage);
  }

  /**
   * function to click to preview button
   * @return {void} Nothing
   */
  async clickToPreview(){
    await this.waitForSelector(this.elements.previewButton);
    await this.click(this.elements.previewButton);
    await this.waitForSelector(this.elements.hopperPreviewModal);
  }

  /**
   * function to validate hopper preview data
   * @param {object} datatable - object of hopper data
   * @param {string} datatable.name - validate person name
   * @param {string} datatable.phone - validate person phone
   * @param {string} datatable.email - validate person email
   * @param {string} datatable.postalCode - validate person postal code
   * @param {string} datatable.city - validate person city
   * @param {string} index - index of row
   * @return {void} Nothing
   */
  async validateHopperData(datatable, index){
    const selectRow = '#dialer-control-hopper-preview-table tbody tr:nth-child('+(index+1)+')';
    if(datatable.name){
      await this.waitForSelector(selectRow +' td:nth-child(3)');
      await this.shouldContainText(
        selectRow +' td:nth-child(3)',
        datatable.name
      );
    }

    if(datatable.phone){
      await this.waitForSelector(selectRow +' td:nth-child(4)');
      await this.shouldContainText(
        selectRow +' td:nth-child(4)',
        datatable.phone
      );
    }

    if(datatable.email){
      await this.waitForSelector(selectRow +' td:nth-child(5)');
      await this.shouldContainText(
        selectRow +' td:nth-child(5)',
        datatable.email
      );
    }
    
    if(datatable.postalCode){
      await this.waitForSelector(selectRow +' td:nth-child(7)');
      await this.shouldContainText(
        selectRow +' td:nth-child(7)',
        datatable.postalCode
      );
    }
    
    if(datatable.city){
      await this.waitForSelector(selectRow +' td:nth-child(8)');
      await this.shouldContainText(
        selectRow +' td:nth-child(8)',
        datatable.city
      );
    }
  }

  /**
   * function to click to close button
   * @return {void} Nothing
   */
  async clickToClose(){
    await this.waitForSelector(this.elements.closeButton);
    await this.click(this.elements.closeButton);
  }

  /**
   * function to clear active filters of campaign
   * @return {void} Nothing
   */
  async clearFilters(){
    if(await this.isVisible(this.elements.deleteFilter)){
      const totalFilter = await this.countElement(this.elements.deleteIcon);
      for(let i = 0; i < totalFilter; i++){
        await this.waitForSelector(this.elements.deleteFilter);
        await this.wait(2); //wait needed to visible element
        await this.click(this.elements.deleteFilter);
      }
      await this.wait(2); //wait to delete all filter
      await this.applyFilter();
    }
  }

  /**
   * function to clear hopper data
   * @return {void} Nothing
   */
  async clearHopperData(){
    if(await this.isVisible(this.elements.clearHopper)){
      await this.waitForSelector(this.elements.clearHopper);
      await this.click(this.elements.clearHopper);
      await this.waitForSelector(this.elements.confirmButton);
      await this.click(this.elements.confirmButton);
    }
  }

  /**
   * function to update basic configurations of dialer
   * @param {string} fieldOrder - order of field
   * @param {string} direction - direction of order
   * @return {void} Nothing
   */
  async updateConfiguration(fieldOrder, direction){
    await this.waitForSelector(this.elements.fieldOrder);
    await this.selectOptionByValue(this.elements.fieldOrder, fieldOrder);
    await this.waitForSelector(this.elements.orderDirection);
    await this.selectOptionByValue(this.elements.orderDirection, direction);
    await this.wait(2); //wait to apply configurations
  }

  /**
   * function to add new group
   * @return {void} Nothing
   */
  async addGroup(){
    await this.waitForSelector(this.elements.addGroup);
    await this.click(this.elements.addGroup);
    await this.waitForSelector(this.elements.addedGroupOr);
  }

  /** 
    * Function to select dialer rule tab
    * @returns {void} nothing
    */
  async selectDialerRuleTab() {
    await this.waitForSelector(this.elements.dialerRuleTab);
    await this.click(this.elements.dialerRuleTab);
    await this.waitForSelector(this.elements.dialerName);
  }

  /** *
    * Function to fill dialer rules
    * @param {object} dialerRule - object of dialer rules
    * @param {string} dialerRule.dialerName - dialer name
    * @param {string} dialerRule.phone - phone
    * @param {string} dialerRule.startHour - start hour value
    * @param {string} dialerRule.endHour - end hour value
    * @param {string} dialerRule.maxDialerTries - max dialer tries value
    * @returns {void} nothing
    */
  async fillDialerRules(dialerRule) {
    await this.waitForSelector(this.elements.dialerName);
    await this.click(this.elements.dialerName);
    await this.clearField(this.elements.dialerName);
    await this.type(this.elements.dialerName, dialerRule.dialerName);
    await this.pressKey('Enter');
    if(dialerRule.phone){
      if(await this.isVisible(this.elements.deletePhoneButton)){
        const totalPhones = await this.countElement(this.elements.totalPhoneList);
        for(let i = 0; i < totalPhones; i++){
          await this.waitForSelector(this.elements.deletePhoneButton);
          await this.click(this.elements.deletePhoneButton);
        }
      }
      await this.type(this.elements.phoneInput, dialerRule.phone);
      await this.pressKey('Enter');
    }
    await this.uncheckToCheckbox(this.elements.allDayCheckbox);
    if(dialerRule.startHour){
      await this.click(this.elements.dailerStartTime);
      await this.clearField(this.elements.dailerStartTime);
      await this.type(this.elements.dailerStartTime, dialerRule.startHour);
      await this.pressKey('Enter');
    }
    if(dialerRule.endHour){
      await this.click(this.elements.dailerEndTime);
      await this.clearField(this.elements.dailerEndTime);
      await this.type(this.elements.dailerEndTime, dialerRule.endHour);
      await this.pressKey('Enter');
    }
    if(dialerRule.maxDialerTries){
      await this.click(this.elements.dailerMaxtries);
      await this.clearField(this.elements.dailerMaxtries);
      await this.type(this.elements.dailerMaxtries, dialerRule.maxDialerTries);
      await this.pressKey('Enter');
    }
  }

  /** 
    * Function to click recycle button
    * @returns {void} nothing
    */
  async clickRecycleButton() {
    if(await this.isVisible(this.elements.removePreviousRecycle)){
      await this.click(this.elements.removePreviousRecycle);
    }
    await this.waitForSelector(this.elements.recycleAddButton);
    await this.click(this.elements.recycleAddButton);
  }

  /** 
    * Function to update recycle settings
    * @param {object} - settings
    * @param {string} - settings.callOutcome - outcome
    * @param {string} - settings.recycleInterval - time interval
    * @param {string} - settings.maxRetries - max retries
    * @returns {void} nothing
    */
  async recycleSettings(settings) {
    await this.selectOptionByValue(this.elements.recycleTabCallOutcome, settings.callOutcome
    );
    await this.forceClick(this.elements.recycleInterval);
    await this.type(this.elements.recycleInterval, settings.recycleInterval
    );
    await this.type(this.elements.recycleMaxTries, settings.maxTries);
  }

  /**
    * Function to save the campaign
    * @returns {void} nothing
    */
  async finishCampaign() {
    await this.waitForSelector(this.elements.saveCampaign);
    await this.click(this.elements.saveCampaign);
    await this.click(this.elements.redifineButton);
    await this.waitForSelector(this.elements.submitButton);
    await this.click(this.elements.submitButton);
    // adding wait here so that campaign updated successfully
    await this.wait(5);
  }

  /** 
    * Function to update dialer Control settings
    * @param {object} - settings
    * @param {string} - settings.campaign - campaign
    * @param {string} - settings.ratio - ratio
    * @param {string} - settings.sortContactsPriority - sortContactsPriority
    * @returns {void} nothing
    */
  async updateDialerControlSettings(settings) {
    // need to wait to option to load
    await this.wait(5);
    await this.dropdownOptionSelect(this.elements.dialerControlOutboundCampaign, settings.campaign);
    let ratio = `[data-ratio="${settings.ratio}"]`;
    if (await this.isVisible(ratio)) {
      await this.click(ratio);
    }
    let locator = `//label[@class="radio-inline"]//span[text()="${settings.sortContactsPriority}"]`;
    await this.click(locator);
  }

  /** 
    * Function to click previously created database
    * @param {string} - databaseName
    * @returns {void} nothing
    */
  async clickPreviousDatabase(databaseName) {
    await this.wait(3); //Require time to load the fields
    await this.waitForSelector(this.elements.searchDatabase);
    await this.forceClick(this.elements.searchDatabase);
    await this.type(this.elements.searchDatabase, databaseName);
    await this.pressKey('Enter');
    await this.wait(6); //Results take time to get reflected
    await this.waitForSelector(this.elements.dataTable);
    await this.click(this.elements.dataTable);
  }

  /** 
    * Function to validate contacts are closed
    * @param {outcome} - outcome name
    * @returns {void} nothing
    */
  async validateContacts(outcome) {
    await this.waitForSelector(this.elements.validateClosedContacts);
    await this.shouldContainText(this.elements.validateClosedContacts, outcome);
  }

  /**
    * Function to delete the previously created database
    * @returns {void} nothing
    */
  async deleteDatabase() {
    await this.click(this.elements.deleteDatabase);
    await this.click(this.elements.confirmDeleteDatabase);
    const successDelete = await this.getTexts(this.elements.popUpMsg);
    assert.equal(successDelete, 'Database has been deleted successfully.');
  }
};
