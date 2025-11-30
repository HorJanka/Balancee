export interface FixedIncomeState {
    name: string,
    amount: string,
    description: string | undefined,
    expected_at: string
}

export interface FixedIncomeErrors {
    name: string,
    amount: string,
    description: string,
    expected_at: string,
    no: number
}

export function validateFixedIncome(formData : FixedIncomeState) {
    const errors : FixedIncomeErrors = {
        amount: "",
        description: "",
        name: "",
        expected_at: "",
        no: 0
    }

        if(!formData.amount || formData.amount === "") {
            errors.amount = "Kötelező megadni összeget.";
            errors.no++;
            
            return errors;
        }

        if(parseInt(formData.amount) <= 0) {
            errors.amount = "Az összegnek nagyobbnak kell lennie 0-nál.";
            errors.no++;
        }

        // Validating description
        if(formData.description?.length && formData.description?.length > 500) {
            errors.description = "A leírásnak rövidebbnek kell lennie 500 karakernél.";
            errors.no++;
        }
        
        // Validating day
        if(formData.expected_at == undefined || formData.expected_at.trim() === '') {
            errors.expected_at = "Kötelező napot megadni.";
            errors.no++;
        }

        if(parseInt(formData.expected_at) < 1 || parseInt(formData.expected_at) > 30) {
            errors.expected_at = "Az érkezési nap 1 és 30 között lehet.";
            errors.no++;
        }

        // Validating name
        if(!formData.name || formData.name.trim() === "") {
            errors.name = "Megnevezés megadása kötelező.";
            errors.no++;
        }

        if(formData.name && formData.name.trim().length > 255) {
            errors.name = "A megadott név nem lehet hosszabb 255 karakternél.";
            errors.no++;
        }

    return errors;
}