import {
    List,
    Datagrid,
    TextField,
    ReferenceField , 
} from "react-admin";

export const ItemList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="file" label="图片" />
            <ReferenceField source="inspection_id" reference="inspections" label="测试编号" />
          
        </Datagrid>
    </List>
);