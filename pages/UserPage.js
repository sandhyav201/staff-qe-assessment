class UserPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;
    }
    get userNameInput() {
        return this.page.locator('#name');
    }
    get emailInput() {
        return this.page.locator('#email');
    }
    get accountTypeSelect() {
        return this.page.locator('#accountType');
    }
    get registerButton() {
        return this.page.locator('#register');
        //(this.registerButton)
    }
    get resultText() {
        return this.page.locator('#result');
    }


    async goto() {
        await this.page.goto(this.baseURL);
    }
    // Fill Uesr Registration 
    async registerUser(user) {
        await this.userNameInput.fill(user.name);
        await this.emailInput.fill(user.email);
        await this.accountTypeSelect.selectOption(user.accountType);
    }

    async submit() {
        await this.registerButton.click();
    }

    async getResult() {
        return this.page.locator('#result');
    }

    // Create User 
    async createUser(user) {
        await this.goto();
        await this.registerUser(user);
        await this.submit();
    }
}

module.exports = { UserPage };