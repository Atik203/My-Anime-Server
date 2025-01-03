import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  name: 'Super Admin',
  email: 'superadmin@gmail.com',
  password: config.super_admin_password,
  role: USER_ROLE.superAdmin,
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      role: USER_ROLE.superAdmin,
    });

    if (!isSuperAdminExist) {
      await User.create(superUser);
      console.log('Super Admin user created successfully');
    } else {
      console.log('Super Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding Super Admin user:', error);
    throw error; // Re-throw the error to be caught by the main process
  }
};

export default seedSuperAdmin;
