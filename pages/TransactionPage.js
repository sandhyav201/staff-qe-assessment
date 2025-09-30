class TransactionPage {
    constructor(page, baseURL) {
      this.page = page;
      this.baseURL = baseURL;
    }
  
    // Locators as getters
    get userIdInput() {
      return this.page.locator('#userId');
    }
  
    get amountInput() {
      return this.page.locator('#amount');
    }
  
    get typeSelect() {
      return this.page.locator('#type');
    }
  
    get recipientIdInput() {
      return this.page.locator('#recipientId');
    }
  
    get sendButton() {
      return this.page.locator('#send');
    }
  
    get msgText() {
      return this.page.locator('#msg');
    }
  
    // Navigate to the transaction page
    async goto() {
      await this.page.goto(this.baseURL);
    }
  
    // Fill the transaction form
    async fillForm(transaction) {
      await this.userIdInput.fill(transaction.userId);
      await this.amountInput.fill(transaction.amount.toString());
      await this.typeSelect.selectOption(transaction.type);
      await this.recipientIdInput.fill(transaction.recipientId);
    }
  
    // Click send
    async submit() {
      await this.sendButton.click();
    }
  
    // Get the message text
    async getMessage() {
      await this.msgText.waitFor(); // wait for message to appear
      return await this.msgText.textContent();
    }
  
    // create a transaction
    async createTransaction(transaction) {
      await this.goto();
      await this.fillForm(transaction);
      await this.submit();
      return await this.getMessage();
    }
  }
  
  module.exports = { TransactionPage };
  