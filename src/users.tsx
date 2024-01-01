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
    DateInput, 

} from "react-admin";
import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';



const validatePassword = (value) => {
  if (value.length < 6) {
    return '密码不能少于6位';
  }
  return undefined; // No validation error
};

export const validatePhoneNumber = (value) => {
  const phoneNumberPattern = /^1[3|4|5|6|7|8][0-9]{9}$/;
  if (!phoneNumberPattern.test(value)) {
    return '请输入有效手机号码'; 
  }
 
};

export const validateAge = (value) => {
  if (isNaN(value) || value <= 0) {
    return '年龄必须是正整数';
  }
};

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
            <TextInput source="username" label="用户名" validate={required()} />
            <PasswordInput source="password" label="密码" validate={validatePassword}/>
            <TextInput source="phone" label="手机" validate={validatePhoneNumber}/>
            <TextInput source="department" label="科室" validate={required()}/>
            <TextInput source="createAt" label="创建时间"  />
            <SelectInput
                source="role"
                label="角色"
                choices={[
                { id: 'admin', name: '管理员' },
                { id: 'user', name: '用户' },
                ]}
     
       validate={required()}
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
            <PasswordInput source="password" label="密码" validate={[required(),validatePassword]} />
            <TextInput source="phone" label="手机"  validate={[required(),validatePhoneNumber]} />
            <SelectInput label="选择科室" source="department" choices={departments} optionText="name" optionValue="name" validate={required()} />
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
    <TextInput source="q" label="用户名" alwaysOn />,
    <DateInput source="start_date" label="起始日期" />,
    <DateInput source="end_date"   label="截至日期"/>,
 
];


