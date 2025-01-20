import {DateTime} from "luxon";

export const Day = (props: { slots: Array<any> }) => {

    return (
        <div className={'flex flex-col justify-center items-start bg-amber-200 p-4'}>
            <h2 className={'font-bold'}>{props.slots[0]?.start.toLocaleString(DateTime.DATE_SHORT, {locale: 'fr'})}</h2>
            <ul>
                {
                    props.slots.map((slot) => {
                        return (
                            <li>from {slot.start.toLocaleString(DateTime.TIME_SIMPLE, {locale: 'fr'})} to {slot.end.toLocaleString(DateTime.TIME_SIMPLE, {locale: 'fr'})} : {slot.price},00€
                                TTC</li>
                        );
                    })
                }
            </ul>
        </div>
    );
};