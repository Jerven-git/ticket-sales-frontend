<template>
    <div class="max-w-lg mx-auto my-10 bg-white">
        <form @submit.prevent="updateProfile" class="max-w-md w-full mx-auto">
            <div class="relative z-0 w-full mb-5 group">
                <BaseInput
                    type="email"
                    name="email"
                    label="Your email"
                    placeholder="name@company.com"
                    v-model="email"
                    customClass="w-full"
                />
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <BaseInput
                    type="password"
                    name="password"
                    label="New Password"
                    placeholder="Leave blank to keep current"
                    v-model="password"
                    customClass="w-full"
                />
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <BaseInput
                    type="password"
                    name="repeat_password"
                    label="Confirm password"
                    placeholder="••••••••"
                    v-model="repeatPassword"
                    customClass="w-full"
                />
            </div>
            <div class="grid md:grid-cols-2 md:gap-3">
                <div class="relative z-0 w-full mb-5 group">
                    <BaseInput
                        type="text"
                        name="first-name"
                        label="First name"
                        placeholder="Enter first name"
                        v-model="firstName"
                        customClass="w-full"
                    />
                </div>
                <div class="relative z-0 w-full mb-5 group">
                    <BaseInput
                        type="text"
                        name="last-name"
                        label="Last name"
                        placeholder="Enter last name"
                        v-model="lastName"
                        customClass="w-full"
                    />
                </div>
            </div>
            <div class="flex justify-center">
                <BaseButton
                  label="Update Profile"
                  type="submit"
                  customClass="w-40"
                />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from '@/components/Base/BaseButton.vue';
import BaseInput from '@/components/Base/BaseInput.vue';
import { useAuthStore } from '@/store/authLogin';
import { axiosInstance } from '@/axios/axios';

export default defineComponent({
  name: 'ProfileInfo',
  components: {
    BaseButton,
    BaseInput,
  },
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      firstName: '',
      lastName: '',
    }
  },
  mounted() {
    const authStore = useAuthStore();
    const user = authStore.getUser as any;
    if (user) {
      this.email = user.email || '';
      this.firstName = user.first_name || '';
      this.lastName = user.last_name || '';
    }
  },
  methods: {
    async updateProfile() {
      if (this.password && this.password !== this.repeatPassword) {
        this.$notify({
          type: 'error',
          title: 'Error',
          text: 'Passwords do not match',
        });
        return;
      }

      const authStore = useAuthStore();
      const user = authStore.getUser as any;

      if (!user) return;

      try {
        const data: any = {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          password: this.password || undefined,
        };

        if (!this.password) {
          delete data.password;
        }

        await axiosInstance.patch(`/v1/sign-up/update/${user.id}`, data);

        this.$notify({
          type: 'success',
          title: 'Success',
          text: 'Profile updated successfully',
        });

        await authStore.checkAuth();
      } catch (error: any) {
        let errorMessage = 'Failed to update profile';
        if (error.response?.data?.errors) {
          errorMessage = error.response.data.errors.join(', ');
        }
        this.$notify({
          type: 'error',
          title: 'Error',
          text: errorMessage,
        });
      }
    },
  },
});
</script>
