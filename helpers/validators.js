const helpers = {
    validateUserEmail: (email) => {
        const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    },

    validateUserBirthDate: (date) => {
        const regExp = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        return regExp.test(date);
    },

    validateImageUrl: (url) => {
        const regExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return regExp.test(url);
    }
}

module.exports = {
    validateUserData (body) {
        const {
            email,
            birthDate,
            sex,
            avatarUrl,
            jsExperience,
            reactExperience,
            companyId
        } = body;
        const errorMessages = [];
        if(email && !helpers.validateUserEmail(email)){
            errorMessages.push("Email is not valid.");
        }
        if(birthDate && !helpers.validateUserBirthDate(birthDate)){
            errorMessages.push("Birth date is not correct.");
        }
        if(avatarUrl && !helpers.validateImageUrl(avatarUrl)){
            errorMessages.push("Image URL is not correct.");
        }
        if(sex && sex !== 'male' && sex !== 'female'){
            errorMessages.push("Gender is not correct");
        }
        if(jsExperience !== undefined && reactExperience !== undefined &&  jsExperience < 0 || reactExperience < 0){
            errorMessages.push("One or both from experiences has negative value");
        }
        if(companyId && companyId !== 1 && companyId !== 2){
            errorMessages.push("Company ID is not valid");
        }
        return errorMessages;
    }
}