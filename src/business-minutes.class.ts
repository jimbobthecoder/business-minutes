import moment from "moment";

export class BusinessMinutesClass {

    // @Private Properties
    private _startDate: moment.Moment;

    private _endDate: moment.Moment;

    /**
     * 
     */
    public constructor(
        startDate: moment.Moment,
        endDate: moment.Moment
    ) { 

        //set the properties for start and end date
        this._startDate = startDate;
        this._endDate = endDate;

    }

    //--------------------------------------------------------------------------------
    // @Public Methods
    //--------------------------------------------------------------------------------

    /**
     * 
     */
    public businessMinutes(): number {

        //if the it is the same day then retrun the difference straight away
        if(this._startDate.isSame(this._endDate, 'day')) {
            return this._getDiffMinutes(this._startDate, this._endDate);
        }

        //get the start date
        let startDate = moment(this._startDate);

        //date array
        let dateArray = [];

        while(startDate.isSameOrBefore(this._endDate, 'day')) {

            if(startDate.isSame(this._startDate, 'day')) {
                dateArray.push({
                    start: moment(startDate),
                    end: moment(startDate).hour(17).minute(0).second(0)
                })
            } else if(startDate.isSame(this._endDate, 'day')) {
                dateArray.push({
                    start: moment(startDate).hour(9).minute(0).second(0),
                    end: moment(this._endDate)
                })
            } else {
                dateArray.push({
                    start: moment(startDate).hour(9).minute(0).second(0),
                    end: moment(startDate).hour(17).minute(0).second(0)
                })
            }

            startDate.add(1, 'day');    

        } 

        return dateArray.reduce((acc: number, curr: { start: moment.Moment, end: moment.Moment}) => {
            let mins = this._getDiffMinutes(curr.start, curr.end);
            return acc + mins 
        }, 0)

    }



    //--------------------------------------------------------------------------------
    // @Private Methods
    //--------------------------------------------------------------------------------


    /**
     * caclulates the difference between two dates in minutes
     */
    private _getDiffMinutes(startDate: moment.Moment, endDate: moment.Moment): number {

        if(startDate.isAfter(endDate)) {
            return 0
        }   
        
        if([0, 6].includes(+startDate.format('d'))) {
            return 0
        }


        //refind the dates if they are outside of the business hours
        const refinedStartDate = this._getRefinedStartDate(startDate);
        const refunedEndDate = this._getRefinedEndDate(endDate);

       return  refunedEndDate.diff(refinedStartDate, 'minutes');
    }

    /**
     * method to return the start date preventing going outside of the business hours
     */
    private _getRefinedStartDate(date: moment.Moment): moment.Moment {
        const startOfBusinessDay = moment(date).hour(9).minute(0).second(0);

        if(date.isBefore(startOfBusinessDay)) {
            return startOfBusinessDay
        } else {
            return date
        }

    }

    /**
     * method to return the end date preventing going outside of the business hours
     */
    private _getRefinedEndDate(date: moment.Moment): moment.Moment {
        const endOfBusinessDay = moment(date).hour(17).minute(0).second(0);

        if(date.isAfter(endOfBusinessDay)) {
            return endOfBusinessDay
        } else {
            return date
        }

    }

}