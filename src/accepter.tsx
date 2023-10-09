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
export const AccepterList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="name" label="受检人" />
            <TextField source="sex" label="性别" />
            <TextField source="age" label="年龄" />
            <TextField source="phone" label="手机" />
            <TextField source="createAt" label="创建时间" />
            <TextField source="department" label="检验科室" />
        </Datagrid>
    </List>
);

export const AccepterEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="受检人"/>
            <SelectInput
                source="sex"
                label="性别"
                choices={[
                { id: '男', name: '男' },
                { id: '女', name: '女' },
                ]}
      />
            <TextInput source="age" label="年龄" />
            <TextInput source="phone" label="手机"/>
            <TextInput source="createAt" label="创建时间" />
            <TextInput source="department" label="检验科室" />
         </SimpleForm>
    </Edit>
);

export const AccepterCreate = () => 
   
    (
     <Create >
      <SimpleForm >
      <TextInput source="name" label="受检人"/>
      <SelectInput
                source="sex"
                label="性别"
                choices={[
                { id: '男', name: '男' },
                { id: '女', name: '女' },
                ]}
      />
            <TextInput source="age" label="年龄" />
            <TextInput source="phone" label="手机"/>
            <TextInput source="createAt" label="创建时间"  defaultValue={getCurrentDateTime} />
            <TextInput source="department" label="检验科室" />
     
      </SimpleForm>
    </Create>
  ) ;

  const userFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="name" label="受检人" reference="accepters" />,
];
