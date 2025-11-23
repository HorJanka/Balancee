export interface FormState {
    amount?: string
}

export interface IncomeState extends FormState {
    amount: string,
    description: string | undefined,
    regular: boolean,
    day: string,
    name: string
}

export interface IncomeErrors {
    amount: string,
    description : string,
    day: string,
    name: string,
    no: number
}

export interface ExpenseState extends FormState {
    amount: string,
    category: number | undefined,
    description: string | undefined,
    other: boolean,
    date: Date | undefined
}

export interface ExpenseErrors {
    amount: string,
    category: string,
    description: string,
    date: string,
    no: number
}

export function validateExpense(formData : ExpenseState) {
    const errors : ExpenseErrors = {
        amount: "",
        category: "",
        description: "",
        date: "",
        no: 0
    }

    if(!formData.amount || formData.amount === "") {
        errors.amount = "Az összeg megadása kötelező.";
        errors.no++;
        return errors;
    }

    const amount = parseInt(formData.amount);

    if(amount <= 0) {
        errors.amount = "Az összegnek pozitív számnak kell lennie.";
        errors.no++;
    }

    if(formData.description && formData.description.length > 500) {
        errors.description = "A leírás nem lehet több, mint 500 karakter.";
        errors.no++;
    }

    if(formData.other) {
        if(!formData.date) {
            errors.date = "Dátum megadása kötelező.";
            errors.no++;
        } else if (formData.date > new Date()) {
            errors.date = "Későbbi dátum nem adható meg.";
            errors.no++;
        }
    }

    return errors;
}

export function validateIncome(formData : IncomeState) {
    const errors : IncomeErrors = {
        amount: "",
        description: "",
        day: "",
        name: "",
        no: 0
    }

        if(!formData.amount || formData.amount === "") {
            errors.amount = "Kötelező megadni összeget.";
            errors.no++;
            
            return errors;
        } 

        const amount = parseInt(formData.amount);

        if(amount <= 0) {
            errors.amount = "Az összegnek nagyobbnak kell lennie 0-nál.";
            errors.no++;
        }

        // Validating description
        if(formData.description?.length && formData.description?.length > 500) {
            errors.description = "A leírásnak rövidebbnek kell lennie 500 karakernél.";
            errors.no++;
        }
        
        // Validating day
        if(formData.regular && (formData.day == undefined || formData.day.trim() === '')) {
            errors.day = "Rendszeres bevétel esetén kötelező napot megadni.";
            errors.no++;
        }

        if(formData.regular && formData.day && (parseInt(formData.day) < 1 || parseInt(formData.day) > 30)) {
            errors.day = "Az érkezési nap 1 és 30 között lehet.";
            errors.no++;
        }

        // Validating name
        if(formData.regular && (!formData.name || formData.name.trim() === "")) {
            errors.name = "Megnevezés megadása kötelező.";
            errors.no++;
        }

        if(formData.regular && formData.name && formData.name.trim().length > 255) {
            errors.name = "A megadott név nem lehet hosszabb 255 karakternél.";
            errors.no++;
        }

    return errors;
}

