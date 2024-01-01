import {
    List,
    Datagrid,
    TextField,
    required,
    Create,
    Edit,
    SimpleForm,
    DateInput,
    TextInput,
  
} from "react-admin";

import {getCurrentDateTime } from './users'
export const DepartmentList = () => (
    <List filters={departmentFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="name" label="检测科室" />
            <TextField source="createAt" label="创建时间" />
          </Datagrid>
    </List>
);

export const DepartmentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="检测科室" validate={required()}/>
            <TextInput source="createAt" label="创建时间" validate={required()} />
          
         </SimpleForm>
    </Edit>
);

export const DepartmentCreate = () => 
   
    (
     <Create >
      <SimpleForm >
      <TextInput source="name" label="检测科室" validate={required()} />
      <TextInput source="createAt" label="创建时间"  defaultValue={getCurrentDateTime} validate={required()} />
      </SimpleForm>
    </Create>
  ) ;

  const departmentFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <DateInput source="start_date" label="起始日期" />,
    <DateInput source="end_date"   label="截至日期"/>,
];
