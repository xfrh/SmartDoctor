import {
    List,
    Datagrid,
    TextField,
    ReferenceField,
    SelectInput,
    Create,
    Edit,
    SimpleForm,
    ReferenceInput,
    TextInput,
    useEditController,
    
 
} from "react-admin";

import React, { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import {getCurrentDateTime } from './users'

  
export const InspectionList = () => (
    <List filters={userFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id"  />
            <TextField source="name" label="受检人" />
            <TextField source="sex" label="性别" />
            <TextField source="age" label="年龄" />
            <TextField source="phone" label="手机" />
            <TextField source="createAt" label="创建时间" />
            <TextField source="updateAt" label="更新时间" />
             <TextField source="testedby" label="科室" />
             
        </Datagrid>
    </List>
);

export const InspectionEdit = (props) =>{
    const { record } = useEditController(props);
    const dataProvider = useDataProvider();
    const [imageSrc, setImageSrc] = useState(null);
    useEffect(() => {
        if (record.id) {
            dataProvider.getImage('detail', { id: record.id })
            .then((response) => {
                let base64Data = response.data; 
                base64Data = base64Data.replace(/"/g, '');
                setImageSrc(base64Data);  
            })
         
        }
      }, []);

  return (
    
        <Edit>
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
            <TextInput source="createAt" label="创建时间" />
            <TextInput source="updateAt" label="更新时间" />
             <TextInput source="testedby" label="科室" />
            <TextInput multiline source="conclusion" label="结论"
             format={(value) => {
                if (value && value.control_distance !== undefined) {
                  return `Control 色差:${value.control_distance}   text_1色差: ${value.test_1}   text_2色差: ${value.test_2}   text_3色差: ${value.test_3}   text_4色差: ${value.test_4}`;
                } else {
                  return "暂无结论";
                }
              }} />
                    
         </SimpleForm>
         {imageSrc && <img src={imageSrc} alt="图像" style={{ width: '25%', height: 'auto' }} />}
         </Edit>

               
      );
   }



export const InspectionCreate = () => (
    <Create>
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
            <TextInput source="createAt" label="创建时间"  defaultValue={getCurrentDateTime}/>
            <TextInput source="updateAt" label="更新时间" />
             <TextInput source="testedby" label="科室" />
             <TextInput source="conclusion" label="结论" />
     
      </SimpleForm>
    </Create>
  );

  const userFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="name" label="受检人" reference="accepters" />,
];
