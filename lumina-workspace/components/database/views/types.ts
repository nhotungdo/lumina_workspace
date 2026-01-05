
import { Block, DatabaseProperty, DatabaseView, DatabasePropertyType } from '../../../types';

export interface ViewProps {
    data: Block[];
    properties: DatabaseProperty[];
    view: DatabaseView;
    onUpdateRow: (rowId: string, updates: Partial<Block>) => void;
    onAddRow: () => void;
    onAddProperty?: (name: string, type: DatabasePropertyType) => void;
    onUpdateProperty?: (property: DatabaseProperty) => void;
}
