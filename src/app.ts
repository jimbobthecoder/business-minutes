import moment from 'moment';
import * as readline from 'readline';
import { BusinessMinutesClass } from './business-minutes.class';
import { defer, from, retry, switchMap } from 'rxjs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let startDate: moment.Moment;
let endDate: moment.Moment;

//define the first quesiton
const question1 = (): Promise<void> => {
    return new Promise((resolve, reject): void => {   
        rl.question('What is the start datetime [YYYY-MM-DD HH:MM:SS] ?:', (answer) => {

            if(moment(answer, 'YYYY-MM-DD HH:mm:ss').isValid()) {
                //error chekc that the date is valud
                startDate = moment(answer);
                resolve();
            } else {
                console.log('Invalid date, please try again')
                reject();
            }
        });
        
    })
}

//ask the second question
const question2 = (): Promise<void> => {
    return new Promise((resolve, reject) => {   
        rl.question('What is the end datetime [YYYY-MM-DD HH:MM:SS] ?:', (answer) => {

            if(!moment(answer, 'YYYY-MM-DD HH:mm:ss').isValid()) {
                //error check that the date is valid
                console.log('Invalid date, please try again')
                reject()
            } else if(moment(answer, 'YYYY-MM-DD HH:mm:ss').isBefore(startDate)) {
                //error check that the end date is after the start date
                console.log('End date must be after the start date')
                reject()
            } else {
                endDate = moment(answer)
                resolve();
            }

        });
        
    }) 
}


//define the main applcation
const main = async () => {

    defer(() => question1()).pipe(
        retry(),
        switchMap(() => {
            return defer(() => question2()).pipe(retry())
        })
    ).subscribe({
        next: () => {

            let businessMinutes = new BusinessMinutesClass(startDate, endDate);
            console.log('Total Business Minutes: ', businessMinutes.businessMinutes())

            rl.close()

        }

    })

}

//Run the main application
main();