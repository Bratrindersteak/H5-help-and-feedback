import React, { Component } from 'react';

class TimeBar extends Component {
    constructor(props) {
        super(props);

        this.setDoubleDigit = this.setDoubleDigit.bind(this);
    }

    setDoubleDigit(num) {

        if (num < 10) {
            return `0${ num }`;
        }

        return num;
    }

    render() {
        const { createTime, week } = this.props;
        const CREATE_TIME = new Date(createTime);
        const CURRENT_TIME = new Date();
        const CREATE_YEAR = CREATE_TIME.getFullYear();
        const CREATE_MONTH = CREATE_TIME.getMonth();
        const CREATE_DATE = CREATE_TIME.getDate();
        const CREATE_DAY = CREATE_TIME.getDay();
        const CREATE_HOUR = CREATE_TIME.getHours();
        const CREATE_MINUTE = CREATE_TIME.getMinutes();
        const CURRENT_YEAR = CURRENT_TIME.getFullYear();
        const CURRENT_MONTH = CURRENT_TIME.getMonth();
        const CURRENT_DATE = CURRENT_TIME.getDate();

        if (CREATE_YEAR === CURRENT_YEAR) {

            if (CREATE_MONTH === CURRENT_MONTH && CURRENT_DATE - CREATE_DATE < 7) {

                if (CURRENT_DATE - CREATE_DATE > 1) {
                    return (
                        <div className="time-info">
                            { `${ week[CREATE_DAY] } ${ this.setDoubleDigit(CREATE_HOUR) }:${ this.setDoubleDigit(CREATE_MINUTE) }` }
                        </div>
                    )
                }

                if (CURRENT_DATE - CREATE_DATE === 1) {
                    return (
                        <div className="time-info">
                            { `昨天 ${ this.setDoubleDigit(CREATE_HOUR) }:${ this.setDoubleDigit(CREATE_MINUTE) }` }
                        </div>
                    )
                }

                if (CURRENT_DATE - CREATE_DATE === 0) {
                    return (
                        <div className="time-info">
                            { `今天 ${ this.setDoubleDigit(CREATE_HOUR) }:${ this.setDoubleDigit(CREATE_MINUTE) }` }
                        </div>
                    )
                }
            } else {
                return (
                    <div className="time-info">
                        { `${ this.setDoubleDigit(CREATE_MONTH + 1) }-${ this.setDoubleDigit(CREATE_DATE) } ${ this.setDoubleDigit(CREATE_HOUR) }:${ this.setDoubleDigit(CREATE_MINUTE) }` }
                    </div>
                )
            }
        } else {
            return (
                <div className="time-info">
                    { `${ CREATE_YEAR }-${ this.setDoubleDigit(CREATE_MONTH + 1) }-${ this.setDoubleDigit(CREATE_DATE) } ${ this.setDoubleDigit(CREATE_HOUR) }:${ this.setDoubleDigit(CREATE_MINUTE) }` }
                </div>
            )
        }
    }
}

export default TimeBar;