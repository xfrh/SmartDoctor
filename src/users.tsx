import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    EditButton,
    required ,
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

export const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  
  };

export const UserList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="username" label="用户名" />
            <TextField source="phone" label="手机" />
            <TextField source="createAt" label="创建时间" />
            <TextField source="role" label="角色" />
            <TextField source="department" label="科室" />
        </Datagrid>
    </List>
);

export const UserEdit = () =>(
    
     <Edit>
        <SimpleForm>
            <TextInput source="username" label="用户名" />
            <PasswordInput source="password" label="密码"/>
            <TextInput source="phone" label="手机"/>
            <TextInput source="department" label="科室" inputProps={{ readOnly: true }}/>
            <TextInput source="createAt" label="创建时间"  />
            <SelectInput
                source="role"
                label="角色"
                choices={[
                { id: 'admin', name: '管理员' },
                { id: 'user', name: '用户' },
                ]}
      />
        </SimpleForm>
    </Edit>
    );


export const UserCreate = () =>{

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
    <Create>
      <SimpleForm>
            <TextInput source="username" label="用户名" validate={[required()]}  />
            <PasswordInput source="password" label="密码" validate={[required()]} />
            <TextInput source="phone" label="手机" validate={[required()]} />
            <SelectInput label="选择科室" source="department" choices={departments} optionText="name" optionValue="name" />
            <TextInput source="createAt" label="创建时间" defaultValue={getCurrentDateTime} validate={[required()]} />
            <SelectInput
            validate={[required()]} 
            source="role"
            label="角色"
            choices={[
            { id: 'admin', name: '管理员' },
            { id: 'user', name: '用户' },
            ]}
      />
      </SimpleForm>
    </Create>
  );
        }


  const userFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="username" label="用户名" reference="users" />,
];


