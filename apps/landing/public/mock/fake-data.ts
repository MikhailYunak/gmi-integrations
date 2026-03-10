const stepOne = {
    generalInfo: {
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '2145551234'
    },
    businessInfo: {
        legalBusinessName: 'Smith Consulting LLC',
        dba: 'Smith & Co',
        businessState: 'TX',
        businessStartDate: '2020-03-15',
        numEmployees: 12,
        businessZipCode: '75201'
    },
    hasPreviousClaims: true,
    previousClaims: [
        {
            claimAmount: 15000,
            claimDescription: 'Water damage in office building'
        },
        {
            claimAmount: 5000,
            claimDescription: 'Slip and fall incident'
        }
    ]
};

const stepTwo = {
    financials: {
        annualEarnings: 500000,
        annualPayroll: 200000
    },
    primaryLocation: {
        street: '123 Main St',
        city: 'Dallas',
        state: 'TX',
        zip: '75201'
    },
    isMailingSameAsPrimary: false,
    mailingAddress: {
        street: '456 Oak Ave, Suite 200',
        city: 'Austin',
        state: 'TX',
        zip: '73301'
    }
};

const stepThree = {
    coverage: {
        glLimit: 1000000
    },
    cyberCoverage: {
        limits: '50000/100000'
    },
    epli: {
        limits: '100000/100000',
        retention: 5000
    },
    liquorLiability: {
        shouldInclude: true,
        alcoholicBeverageSales: 120000,
        liquorLiabLimitEachOccurrence: 1000000
    }
};