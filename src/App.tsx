import {
  Admin,
  Resource,
 
 } from "react-admin";
 import { Dashboard } from './Dashboard';
 import dataProvider from './dataProvider';
 import { UserList,UserEdit,UserCreate } from "./users";
 import { AccepterList,AccepterEdit,AccepterCreate } from "./accepter";
 import { InspectionList,InspectionEdit,InspectionCreate } from "./inspection";
 import { DepartmentList,DepartmentEdit,DepartmentCreate } from "./department";
 import UserIcon from "@mui/icons-material/Group";
 import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
 import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
 import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
 import { authProvider } from './authProvider';
export const App = () => (
  <Admin authProvider={authProvider}   dataProvider={dataProvider} dashboard={Dashboard} >
    <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate}  icon={UserIcon} options={{ label: "用户管理" }}  />
    <Resource name="accepters" list={AccepterList} edit={AccepterEdit} create={AccepterCreate}  icon={AccessibilityNewIcon} options={{ label: "受检人管理" }}  />
    <Resource name="inspections" list={InspectionList} edit={InspectionEdit} create={InspectionCreate}  icon={LibraryAddIcon} options={{ label: "检测管理" }}  />
    <Resource name="departments" list={DepartmentList} edit={DepartmentEdit} create={DepartmentCreate}  icon={LocalFireDepartmentIcon} options={{ label: "科室管理" }}  />
  </Admin>
);