import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    required,
    Create,
    Edit,
    SimpleForm,
    ReferenceInput,
    TextInput,
    PasswordInput, 
    SelectInput,
} from "react-admin";
import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import {getCurrentDateTime,validatePhoneNumber,validateAge } from './users'
export const AccepterList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="name" label="受检人"  />
            <TextField source="sex" label="性别" />
            <TextField source="age" label="年龄" />
            <TextField source="phone" label="手机" />
            <TextField source="createAt" label="创建时间" />
            <TextField source="department" label="检验科室"  />
        </Datagrid>
    </List>
);

export const AccepterEdit = () =>(
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="受检人" validate={required()}/>
            <SelectInput
                validate={required()}
                source="sex"
                label="性别"
                choices={[
                { id: '男', name: '男' },
                { id: '女', name: '女' },
                ]}
      />
            <TextInput source="age" label="年龄" validate={[required(),validateAge]}/>
            <TextInput source="phone" label="手机" validate={[required(),validatePhoneNumber]}/>
            <TextInput source="createAt" label="创建时间" inputProps={{ readOnly: true }} />
            <TextInput source="department" label="检验科室" inputProps={{ readOnly: true }} />
         </SimpleForm>
    </Edit>
);


export const AccepterCreate = () => 
   {
    const[departments,setDepartments] = useState([]);
    const dataProvider = useDataProvider();
    useEffect(() => {
       // 使用dataProvider获取departments数据
       dataProvider
         .getList('departments', {
           pagination: { page: 1, perPage: 100 }, // 适应实际情况的分页设置
           sort: { field: 'name', order: 'ASC' }, // 按名称升序排序
         })
         .then(({ data }) => {
           setDepartments(data);
         });
     }, [dataProvider]);
    return (
     <Create >
      <SimpleForm >
      <TextInput source="name" label="受检人" validate={required()}/>
      <SelectInput
                validate={required()}
                source="sex"
                label="性别"
                choices={[
                { id: '男', name: '男' },
                { id: '女', name: '女' },
                ]}
      />
            <TextInput source="age" label="年龄" validate={required()}  />
            <TextInput source="phone" label="手机" validate={validatePhoneNumber}/>
            <TextInput source="createAt" label="创建时间"  defaultValue={getCurrentDateTime} validate={required()}/>
            <SelectInput label="选择科室" source="department" choices={departments} optionText="name" optionValue="name" validate={required()}/>
     
      </SimpleForm>
    </Create>
  ) ;
 }
  const userFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="name" label="受检人" reference="accepters" />,
];
