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

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="username" label="用户名" />
            <PasswordInput source="password" label="密码"/>
            <TextInput source="phone" label="手机"/>
            <TextInput source="department" label="科室"/>
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

export const UserCreate = () =>
(
    <Create>
      <SimpleForm>
            <TextInput source="username" label="用户名" validate={[required()]}  />
            <PasswordInput source="password" label="密码" validate={[required()]} />
            <TextInput source="phone" label="手机" validate={[required()]} />
            <TextInput source="department" label="科室" validate={[required()]} />
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


  const userFilters = [
    <TextInput source="q" label="搜索..." alwaysOn />,
    <ReferenceInput source="username" label="用户名" reference="users" />,
];
