import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  actions: string[];
}

const PERMISSIONS_COLLECTION = 'permissions';

export const checkUserPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) return false;
  
  const userData = userSnap.data();
  if (userData.role === 'admin') return true;
  
  const roleRef = doc(db, 'roles', userData.role);
  const roleSnap = await getDoc(roleRef);
  
  if (!roleSnap.exists()) return false;
  
  const roleData = roleSnap.data();
  return roleData.permissions.includes(permission);
};

export const getPermissions = async (): Promise<Permission[]> => {
  const permissionsRef = doc(db, PERMISSIONS_COLLECTION, 'all');
  const permissionsSnap = await getDoc(permissionsRef);
  
  if (permissionsSnap.exists()) {
    return permissionsSnap.data().permissions;
  }
  return [];
};

export const addPermission = async (permission: Omit<Permission, 'id'>): Promise<Permission> => {
  const permissionsRef = doc(db, PERMISSIONS_COLLECTION, 'all');
  const permissionsSnap = await getDoc(permissionsRef);
  
  const newPermission: Permission = {
    ...permission,
    id: crypto.randomUUID()
  };
  
  const currentPermissions = permissionsSnap.exists() 
    ? permissionsSnap.data().permissions 
    : [];
  
  await setDoc(permissionsRef, {
    permissions: [...currentPermissions, newPermission],
    updatedAt: new Date().toISOString()
  });
  
  return newPermission;
};