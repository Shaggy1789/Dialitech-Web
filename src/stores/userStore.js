import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userService } from '../services/userService';
import { users as mockUsers } from '../modules/user-management/data/users';

export const useUserStore = defineStore('users', () => {
  const users = ref([...mockUsers]);
  const loading = ref(false);
  const error = ref('');

  async function fetchAll() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await userService.getAll();
      users.value = data.map(mapApiUserToFrontend);
    } catch {
      users.value = [...mockUsers];
    } finally {
      loading.value = false;
    }
  }

  async function remove(id) {
    loading.value = true;
    error.value = '';
    try {
      await userService.delete(id);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (err) {
      error.value = err.response?.data?.message || 'Delete failed';
    } finally {
      loading.value = false;
    }
  }

  return { users, loading, error, fetchAll, remove };
});

function mapApiUserToFrontend(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role || 'Doctor',
    department: apiUser.department || 'General',
    lastAccess: apiUser.lastLogin || 'N/A',
    status: apiUser.isActive !== false ? 'Active' : 'Inactive',
  };
}
