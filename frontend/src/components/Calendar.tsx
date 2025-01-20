import React, { useState } from 'react';
import {Day} from "./Day";
import {DateTime} from "luxon"

export const Calendar = () => {
    
    const fetchSlotsForDay = async (
        dateTime: DateTime,
        minExecTime: number = 500,
        maxExecTime: number = 2000
    ): Promise<{ start: DateTime; end: DateTime; price: number }[]> => {
        
        const generateRandomExecutionTime = () =>
            Math.floor(Math.random() * (maxExecTime - minExecTime + 1)) + minExecTime;

        const generateRandomPrice = () =>
            Math.floor(Math.random() * 100) + 10; // Random prices between 10 and 110

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const slots: { start: DateTime; end: DateTime; price: number }[] = Array.from({length: 24}, (_, index) => ({
            start: dateTime.set({hour: index}).startOf('hour'),
            end: dateTime.set({hour: index}).endOf('hour').set({millisecond: 0}), // eg. 15:59:59.000+0200
            price: generateRandomPrice(),
        }));

        const executionTime = generateRandomExecutionTime();
        await delay(executionTime);
        
        console.log({slots, executionTime});

        return slots;
    };

    const [calendarSlots, setCalendarSlots] = useState<{
        day1: { start: DateTime; end: DateTime; price: number }[];
        day2: { start: DateTime; end: DateTime; price: number }[];
        day3: { start: DateTime; end: DateTime; price: number }[];
    }>({
        day1: [],
        day2: [],
        day3: []
    });


    const [selectedSlot, setSelectedSlot] = useState<{ start: DateTime; end: DateTime; price: number } | null >(null);
    
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        const initializeCalendarSlots = async () => {
            setIsLoading(true);
            try {
                const [day1Slots, day2Slots, day3Slots] = await Promise.all([
                    fetchSlotsForDay(DateTime.now().startOf('day')),
                    fetchSlotsForDay(DateTime.now().plus({days: 1}).startOf('day')),
                    fetchSlotsForDay(DateTime.now().plus({days: 2}).startOf('day'))
                ]);

                setCalendarSlots({...calendarSlots, day1: day1Slots });
                setCalendarSlots({...calendarSlots, day2: day2Slots });
                setCalendarSlots({...calendarSlots, day3: day3Slots });

            } catch (error) {
                console.error("Error initializing calendar slots:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeCalendarSlots();

    }, []);

    return (
        <div>
            {isLoading ? (
                <p>Loading calendar slots...</p>
            ) : (
                <div className={"flex flex-row align-center justify-center gap-4"}>
                    <Day slots={calendarSlots.day1}/>
                    <Day slots={calendarSlots.day2}/>
                    <Day slots={calendarSlots.day3}/>
                </div>
            )}
        </div>
    );
};