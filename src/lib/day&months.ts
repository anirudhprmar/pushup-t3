// Format: MM/DD/YYYY
//12/02/2025

const month = new Date().getMonth() + 1; // actualMonths are zero-based

let actualMonth = ""

switch (month) {
    case 1:
        actualMonth = "January";
        break;

    case 2:
        actualMonth = "February";
        break;

    case 3:
        actualMonth = "March";
        break;

    case 4:
        actualMonth = "April";
        break;

    case 5:
        actualMonth = "May";
        break;              
    case 6:
        actualMonth = "June";
        break;
        
    case 7:
        actualMonth = "July";
        break;
    case 8:
        actualMonth = "August";
        break;
    case 9:
        actualMonth = "September";
        break;
    case 10:
        actualMonth = "October";
        break;
    case 11:
        actualMonth = "November";
        break;
    case 12:
        actualMonth = "December";
        break;

    default:
        break;
}

export default function dateAndactualMonth(input:string){
    const date = input.split("/")[1];
    const properDateAndactualMonth = `${date} ${actualMonth}`;
    return properDateAndactualMonth;
}

