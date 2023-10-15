import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    Create,
    Edit,
    SimpleForm,
    ReferenceInput,
    TextInput,
    PasswordInput, 
    SelectInput,
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
            <TextInput source="name" label="检测科室"/>
            <TextInput source="createAt" label="创建时间" />
          
         </SimpleForm>
    </Edit>
);

export const DepartmentCreate = () => 
   
    (
     <Create >
      <SimpleForm >
      <TextInput source="name" label="检测科室"/>
      <TextInput source="createAt" label="创建时间"  defaultValue={getCurrentDateTime} />
      </SimpleForm>
    </Create>
  ) ;

  const departmentFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="name" label="检测科室" reference="departments" />,
];
