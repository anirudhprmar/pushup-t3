// Format: MM/DD/YYYY
//12/02/2025

const month = new Date().getMonth() + 1; // actualMonths are zero-based

let actualMonth = ""

switch (month) {
    case 1:
        actualMonth = "Jan";
        break;

    case 2:
        actualMonth = "Feb";
        break;

    case 3:
        actualMonth = "Mar";
        break;

    case 4:
        actualMonth = "Apr";
        break;

    case 5:
        actualMonth = "May";
        break;              
    case 6:
        actualMonth = "Jun";
        break;
        
    case 7:
        actualMonth = "Jul";
        break;
    case 8:
        actualMonth = "Aug";
        break;
    case 9:
        actualMonth = "Sep";
        break;
    case 10:
        actualMonth = "Oct";
        break;
    case 11:
        actualMonth = "Nov";
        break;
    case 12:
        actualMonth = "Dec";
        break;

    default:
        break;
}

export default function dateAndactualMonth(input:string){
    const date = input.split("/")[1];
    const properDateAndactualMonth = `${date} ${actualMonth}`;
    return properDateAndactualMonth;
}

