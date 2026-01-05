
import React from 'react';
import { ViewProps } from './types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DatabasePropertyType } from '../../../types';

export const BoardView: React.FC<ViewProps> = ({ data, properties, onUpdateRow }) => {
    // Find a select property to group by
    const groupProperty = properties.find(p => p.type === DatabasePropertyType.SELECT);

    const groups = groupProperty?.options || [];

    // Group data
    const groupedData: Record<string, any[]> = {};
    groups.forEach(g => groupedData[g.id] = []);
    groupedData['no-status'] = [];

    if (!groupProperty) {
        // If no select property, everything is effectively ungrouped/unavailable for board view in this simple impl
    } else {
        data.forEach(item => {
            const val = item.metadata?.propertyValues?.[groupProperty.id];
            if (val && groups.find(g => g.id === val)) {
                if (!groupedData[val]) groupedData[val] = [];
                groupedData[val].push(item);
            } else {
                groupedData['no-status'].push(item);
            }
        });
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Moved to a new column -> update property
            const item = data.find(d => d.id === draggableId);
            if (item && groupProperty) {
                const newValue = destination.droppableId === 'no-status' ? undefined : destination.droppableId;
                onUpdateRow(item.id, {
                    metadata: {
                        ...item.metadata,
                        propertyValues: {
                            ...item.metadata?.propertyValues,
                            [groupProperty.id]: newValue
                        }
                    }
                });
            }
        }
    };

    if (!groupProperty) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-gray-50 dark:bg-[#1e1e1e] rounded-lg border dark:border-gray-800 m-4 border-dashed border-2">
                <p>This view requires a <strong>Select</strong> property to group by.</p>
                <p className="text-sm mt-2">Add a Select property in the Table view first.</p>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 p-4 overflow-x-auto min-h-[500px] items-start">
                {/* No Status Column */}
                {(groupedData['no-status']?.length > 0 || groups.length === 0) && (
                    <div className="min-w-[260px] w-[260px] flex flex-col bg-gray-50 dark:bg-[#252525] rounded-lg border dark:border-gray-700 max-h-full shrink-0">
                        <div className="p-3 font-medium text-sm text-gray-500 flex justify-between">
                            <span>No Status</span>
                            <span className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded text-xs">{groupedData['no-status'].length}</span>
                        </div>
                        <Droppable droppableId="no-status">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 p-2 space-y-2 min-h-[100px] ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}
                                >
                                    {groupedData['no-status'].map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white dark:bg-[#1e1e1e] p-3 rounded shadow-sm border dark:border-gray-600 group hover:border-gray-400 dark:hover:border-gray-500 ${snapshot.isDragging ? 'shadow-lg rotate-2 z-50' : ''}`}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <div className="text-sm dark:text-gray-200">{item.content || "Untitled"}</div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                )}

                {groups.map(group => (
                    <div key={group.id} className="min-w-[260px] w-[260px] flex flex-col bg-gray-50 dark:bg-[#252525] rounded-lg border dark:border-gray-700 max-h-full shrink-0">
                        <div className="p-3 font-medium text-sm flex items-center justify-between text-gray-700 dark:text-gray-200">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color || 'gray' }}></div>
                                <span>{group.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 rounded">{groupedData[group.id]?.length || 0}</span>
                        </div>

                        <Droppable droppableId={group.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px] ${snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700/50' : ''}`}
                                >
                                    {groupedData[group.id]?.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`bg-white dark:bg-[#1e1e1e] p-3 rounded shadow-sm border dark:border-gray-600 group hover:border-gray-400 dark:hover:border-gray-500 ${snapshot.isDragging ? 'shadow-lg rotate-2 z-50' : ''}`}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <div className="text-sm dark:text-gray-200">{item.content || "Untitled"}</div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};
