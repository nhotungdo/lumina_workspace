
import React from 'react';
import { ViewProps } from './types';
import { DatabasePropertyType } from '../../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

export const CalendarView: React.FC<ViewProps> = ({ data, properties, onUpdateRow }) => {
    // Find a date property
    const dateProperty = properties.find(p => p.type === DatabasePropertyType.DATE);

    if (!dateProperty) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg border dark:border-gray-800 m-4 border-dashed border-2">
                <p>This view requires a <strong>Date</strong> property to display items.</p>
                <p className="text-sm mt-2">Add a Date property in the Table view first.</p>
            </div>
        );
    }

    // Simple current month view
    const today = new Date();
    const currentMonthStart = startOfMonth(today);
    const currentMonthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });

    // Group items by date
    const itemsByDate: Record<string, any[]> = {};
    data.forEach(item => {
        const dateVal = item.metadata?.propertyValues?.[dateProperty.id];
        if (dateVal) {
            itemsByDate[dateVal] = [...(itemsByDate[dateVal] || []), item];
        }
    });

    return (
        <div className="p-4 bg-white dark:bg-[#1e1e1e]">
            <div className="mb-4 text-center font-bold text-lg dark:text-gray-200">
                {format(today, 'MMMM yyyy')}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-500 uppercase py-2">
                        {d}
                    </div>
                ))}
                {days.map(day => {
                    // Pad with empty cells if start of month doesn't align (simplified, just iterating days of month)
                    // Improvement: calculate offset.
                    return (
                        <div key={day.toISOString()} className="min-h-[100px] border dark:border-gray-700 p-1 relative hover:bg-gray-50 dark:hover:bg-[#252525]">
                            <div className={`text-xs font-medium mb-1 ${isSameDay(day, today) ? 'bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500'}`}>
                                {format(day, 'd')}
                            </div>
                            <div className="space-y-1">
                                {itemsByDate[format(day, 'yyyy-MM-dd')]?.map(item => (
                                    <div key={item.id} className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200 rounded px-1 py-0.5 truncate border border-purple-200 dark:border-purple-800/50">
                                        {item.content || "Untitled"}
                                        {item.metadata?.propertyValues?.['name'] /* Force redraw hack if needed? */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
