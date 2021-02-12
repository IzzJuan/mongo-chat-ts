import moment from 'moment';

function formatMessage(username: any, text: any) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

export { formatMessage };